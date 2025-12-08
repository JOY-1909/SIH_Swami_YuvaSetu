# File: scripts/training/continuous_learning.py
"""
Continuous learning pipeline that processes user feedback
and updates the recommendation model weights
"""
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import logging
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from scipy.optimize import minimize
from collections import defaultdict
import pickle

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = Path("models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

FEEDBACK_WEIGHTS_PATH = MODEL_DIR / "feedback_adjusted_weights.json"
LEARNING_HISTORY_PATH = MODEL_DIR / "learning_history.json"


@dataclass
class LearningIteration:
    """Record of a learning iteration"""
    iteration_id: str
    timestamp: str
    feedback_count: int
    interactions_count: int
    outcomes_count: int
    previous_weights: Dict[str, float]
    new_weights: Dict[str, float]
    improvement_metrics: Dict[str, float]


class FeedbackProcessor:
    """Process user feedback for continuous learning"""
    
    def __init__(self, db_url: str, db_name: str):
        self.db_url = db_url
        self.db_name = db_name
        self.client = None
        self.db = None
        
        # Current weights
        self.current_weights = self._load_current_weights()
        
        # Learning rate for weight updates
        self.learning_rate = 0.1
        
        # Minimum feedback required for update
        self.min_feedback_for_update = 10
    
    def _load_current_weights(self) -> Dict[str, float]:
        """Load current weights from file"""
        try:
            if FEEDBACK_WEIGHTS_PATH.exists():
                with open(FEEDBACK_WEIGHTS_PATH) as f:
                    data = json.load(f)
                return data.get('weights', self._default_weights())
            
            # Try loading from training
            trained_path = MODEL_DIR / "trained_weights.json"
            if trained_path.exists():
                with open(trained_path) as f:
                    data = json.load(f)
                return data.get('final_weights', self._default_weights())
        except Exception as e:
            logger.error(f"Error loading weights: {e}")
        
        return self._default_weights()
    
    def _default_weights(self) -> Dict[str, float]:
        """Default weights"""
        return {
            'skills': 0.5,
            'location': 0.2,
            'stipend': 0.2,
            'timeline': 0.1
        }
    
    async def connect(self):
        """Connect to database"""
        self.client = AsyncIOMotorClient(self.db_url)
        self.db = self.client[self.db_name]
        logger.info("Connected to database for continuous learning")
    
    async def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()
    
    async def fetch_unprocessed_feedback(self) -> List[Dict]:
        """Fetch unprocessed feedback"""
        cursor = self.db.recommendation_feedback.find({"processed": False})
        feedback = await cursor.to_list(length=None)
        logger.info(f"Fetched {len(feedback)} unprocessed feedback items")
        return feedback
    
    async def fetch_unprocessed_interactions(self) -> List[Dict]:
        """Fetch unprocessed interactions"""
        cursor = self.db.user_interactions.find({"processed": False})
        interactions = await cursor.to_list(length=None)
        logger.info(f"Fetched {len(interactions)} unprocessed interactions")
        return interactions
    
    async def fetch_unprocessed_outcomes(self) -> List[Dict]:
        """Fetch unprocessed application outcomes"""
        cursor = self.db.application_outcomes.find({"processed": False})
        outcomes = await cursor.to_list(length=None)
        logger.info(f"Fetched {len(outcomes)} unprocessed outcomes")
        return outcomes
    
    def compute_feedback_signals(
        self,
        feedback: List[Dict],
        interactions: List[Dict],
        outcomes: List[Dict]
    ) -> Dict[str, float]:
        """
        Compute adjustment signals from feedback data
        Returns weight adjustment suggestions
        """
        adjustments = {
            'skills': 0.0,
            'location': 0.0,
            'stipend': 0.0,
            'timeline': 0.0
        }
        
        total_signals = 0
        
        # Process explicit feedback
        for fb in feedback:
            rating = fb.get('rating', 3)
            normalized_rating = (rating - 3) / 2  # -1 to 1
            
            helpful_reasons = fb.get('match_reasons_helpful', [])
            
            if helpful_reasons:
                for reason in helpful_reasons:
                    reason_lower = reason.lower()
                    if 'skill' in reason_lower:
                        adjustments['skills'] += normalized_rating * 0.5
                    if 'location' in reason_lower:
                        adjustments['location'] += normalized_rating * 0.5
                    if 'stipend' in reason_lower:
                        adjustments['stipend'] += normalized_rating * 0.5
                    if 'timeline' in reason_lower or 'duration' in reason_lower:
                        adjustments['timeline'] += normalized_rating * 0.5
            else:
                # Distribute across all dimensions
                for dim in adjustments:
                    adjustments[dim] += normalized_rating * 0.1
            
            total_signals += 1
        
        # Process interactions (implicit feedback)
        interaction_weights = {
            'view': 0.1,
            'click': 0.3,
            'save': 0.5,
            'apply': 1.0,
            'dismiss': -0.3,
            'hide': -0.5
        }
        
        for interaction in interactions:
            interaction_type = interaction.get('interaction_type', 'view')
            weight = interaction_weights.get(interaction_type, 0)
            
            position = interaction.get('position_in_list', 10)
            position_factor = max(0.5, 1 - position / 20)
            
            signal = weight * position_factor
            
            for dim in adjustments:
                adjustments[dim] += signal * 0.05
            
            total_signals += 1
        
        # Process outcomes (strongest signal)
        outcome_weights = {
            'accepted': 1.0,
            'offer': 0.9,
            'interview': 0.5,
            'rejected': -0.3
        }
        
        for outcome in outcomes:
            outcome_type = outcome.get('outcome', 'rejected')
            weight = outcome_weights.get(outcome_type, 0)
            satisfaction = outcome.get('satisfaction')
            
            if satisfaction:
                satisfaction_factor = (satisfaction - 3) / 2
                weight = weight * 0.7 + satisfaction_factor * 0.3
            
            for dim in adjustments:
                adjustments[dim] += weight * 0.2
            
            total_signals += 1
        
        # Normalize adjustments
        if total_signals > 0:
            for dim in adjustments:
                adjustments[dim] /= total_signals
        
        return adjustments
    
    def update_weights(
        self,
        adjustments: Dict[str, float]
    ) -> Dict[str, float]:
        """
        Update weights based on adjustment signals
        """
        new_weights = {}
        
        for dim, current_weight in self.current_weights.items():
            adjustment = adjustments.get(dim, 0)
            
            # Apply learning rate
            delta = adjustment * self.learning_rate
            
            # Update weight with bounds
            new_weight = current_weight + delta
            new_weight = max(0.05, min(0.8, new_weight))
            
            new_weights[dim] = new_weight
        
        # Normalize to sum to 1
        total = sum(new_weights.values())
        new_weights = {k: v / total for k, v in new_weights.items()}
        
        return new_weights
    
    async def mark_as_processed(
        self,
        feedback_ids: List,
        interaction_ids: List,
        outcome_ids: List
    ):
        """Mark feedback as processed"""
        if feedback_ids:
            await self.db.recommendation_feedback.update_many(
                {"_id": {"$in": feedback_ids}},
                {"$set": {"processed": True, "processed_at": datetime.utcnow()}}
            )
        
        if interaction_ids:
            await self.db.user_interactions.update_many(
                {"_id": {"$in": interaction_ids}},
                {"$set": {"processed": True, "processed_at": datetime.utcnow()}}
            )
        
        if outcome_ids:
            await self.db.application_outcomes.update_many(
                {"_id": {"$in": outcome_ids}},
                {"$set": {"processed": True, "processed_at": datetime.utcnow()}}
            )
        
        logger.info("Marked feedback as processed")
    
    def save_weights(self, weights: Dict[str, float], iteration: LearningIteration):
        """Save updated weights and learning history"""
        # Save weights
        weights_data = {
            'weights': weights,
            'updated_at': datetime.utcnow().isoformat(),
            'iteration_id': iteration.iteration_id
        }
        
        with open(FEEDBACK_WEIGHTS_PATH, 'w') as f:
            json.dump(weights_data, f, indent=2)
        
        # Append to learning history
        history = []
        if LEARNING_HISTORY_PATH.exists():
            with open(LEARNING_HISTORY_PATH) as f:
                history = json.load(f)
        
        history.append(asdict(iteration))
        
        # Keep last 100 iterations
        history = history[-100:]
        
        with open(LEARNING_HISTORY_PATH, 'w') as f:
            json.dump(history, f, indent=2)
        
        logger.info(f"Saved updated weights: {weights}")
    
    async def run_learning_iteration(self) -> Optional[LearningIteration]:
        """Run a single learning iteration"""
        logger.info("="*50)
        logger.info("Starting learning iteration")
        logger.info("="*50)
        
        # Fetch unprocessed data
        feedback = await self.fetch_unprocessed_feedback()
        interactions = await self.fetch_unprocessed_interactions()
        outcomes = await self.fetch_unprocessed_outcomes()
        
        total_signals = len(feedback) + len(interactions) + len(outcomes)
        
        if total_signals < self.min_feedback_for_update:
            logger.info(f"Not enough feedback ({total_signals} < {self.min_feedback_for_update}). Skipping update.")
            return None
        
        # Compute adjustments
        adjustments = self.compute_feedback_signals(feedback, interactions, outcomes)
        logger.info(f"Computed adjustments: {adjustments}")
        
        # Update weights
        previous_weights = self.current_weights.copy()
        new_weights = self.update_weights(adjustments)
        
        # Calculate improvement (this would ideally use held-out validation)
        weight_change = sum(abs(new_weights[k] - previous_weights[k]) for k in new_weights)
        
        # Create iteration record
        iteration = LearningIteration(
            iteration_id=f"iter_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            timestamp=datetime.utcnow().isoformat(),
            feedback_count=len(feedback),
            interactions_count=len(interactions),
            outcomes_count=len(outcomes),
            previous_weights=previous_weights,
            new_weights=new_weights,
            improvement_metrics={
                'total_signals': total_signals,
                'weight_change': weight_change,
                'adjustments': adjustments
            }
        )
        
        # Save weights
        self.save_weights(new_weights, iteration)
        
        # Mark as processed
        await self.mark_as_processed(
            [f['_id'] for f in feedback],
            [i['_id'] for i in interactions],
            [o['_id'] for o in outcomes]
        )
        
        # Update current weights
        self.current_weights = new_weights
        
        logger.info(f"Learning iteration complete. Weight change: {weight_change:.4f}")
        
        return iteration


class ContinuousLearningScheduler:
    """Schedule and run continuous learning"""
    
    def __init__(
        self,
        db_url: str,
        db_name: str,
        interval_hours: int = 24
    ):
        self.processor = FeedbackProcessor(db_url, db_name)
        self.interval_hours = interval_hours
        self.running = False
    
    async def start(self):
        """Start the continuous learning scheduler"""
        self.running = True
        await self.processor.connect()
        
        logger.info(f"Starting continuous learning scheduler (interval: {self.interval_hours}h)")
        
        while self.running:
            try:
                iteration = await self.processor.run_learning_iteration()
                
                if iteration:
                    logger.info(f"Completed iteration: {iteration.iteration_id}")
                
            except Exception as e:
                logger.error(f"Error in learning iteration: {e}")
            
            # Wait for next iteration
            await asyncio.sleep(self.interval_hours * 3600)
    
    async def stop(self):
        """Stop the scheduler"""
        self.running = False
        await self.processor.close()
        logger.info("Continuous learning scheduler stopped")
    
    async def run_once(self):
        """Run a single iteration (for testing/manual trigger)"""
        await self.processor.connect()
        iteration = await self.processor.run_learning_iteration()
        await self.processor.close()
        return iteration


async def main():
    """Run continuous learning manually"""
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    db_url = os.getenv("MONGODB_URL")
    db_name = os.getenv("DATABASE_NAME", "yuva_setu")
    
    scheduler = ContinuousLearningScheduler(db_url, db_name)
    iteration = await scheduler.run_once()
    
    if iteration:
        print("\n" + "="*50)
        print("LEARNING ITERATION COMPLETE")
        print("="*50)
        print(f"Iteration ID: {iteration.iteration_id}")
        print(f"Feedback processed: {iteration.feedback_count}")
        print(f"Interactions processed: {iteration.interactions_count}")
        print(f"Outcomes processed: {iteration.outcomes_count}")
        print(f"\nPrevious weights: {iteration.previous_weights}")
        print(f"New weights: {iteration.new_weights}")
    else:
        print("No update performed (insufficient feedback)")


if __name__ == "__main__":
    asyncio.run(main())