# File: app/scripts/training/train_recommendation_model.py
"""
Training pipeline for the Yuva Setu Recommendation Engine
"""
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass
import logging
from datetime import datetime
from scipy.optimize import minimize
from tqdm import tqdm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
SCRIPT_DIR = Path(__file__).resolve().parent
APP_DIR = SCRIPT_DIR.parent.parent
PROJECT_ROOT = APP_DIR.parent

DATA_DIR = PROJECT_ROOT / "data" / "synthetic"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

print(f"Project root: {PROJECT_ROOT}")
print(f"Data directory: {DATA_DIR}")
print(f"Model directory: {MODEL_DIR}")


@dataclass
class TrainingConfig:
    base_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dim: int = 384
    cv_folds: int = 5
    initial_weights: Dict[str, float] = None
    
    def __post_init__(self):
        if self.initial_weights is None:
            self.initial_weights = {"skills": 0.5, "location": 0.2, "stipend": 0.2, "timeline": 0.1}


class WeightLearner:
    def __init__(self, config: TrainingConfig):
        self.config = config
        self.model = None
        self.students = []
        self.internships = []
        self.ground_truth = []
        self.student_embeddings = {}
        self.internship_embeddings = {}
    
    def load_data(self):
        logger.info("Loading training data...")
        train_dir = DATA_DIR / "train"
        
        if not train_dir.exists():
            raise FileNotFoundError(
                f"Training data not found at {train_dir}\n"
                f"Run: python app/scripts/data/generate_synthetic_dataset.py"
            )
        
        with open(train_dir / "students.json") as f:
            self.students = json.load(f)
        with open(train_dir / "internships.json") as f:
            self.internships = json.load(f)
        with open(train_dir / "matches.json") as f:
            self.ground_truth = json.load(f)
        
        logger.info(f"Loaded {len(self.students)} students, {len(self.internships)} internships, {len(self.ground_truth)} matches")
    
    def load_model(self):
        if self.model is None:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading model: {self.config.base_model}")
            self.model = SentenceTransformer(self.config.base_model)
    
    def precompute_embeddings(self):
        self.load_model()
        logger.info("Precomputing embeddings...")
        
        for student in tqdm(self.students, desc="Student embeddings"):
            text = " ".join([
                " ".join([s['name'] for s in student.get('skills', [])]),
                student.get('career_objective', ''),
                " ".join([e.get('field_of_study', '') for e in student.get('education', [])])
            ])
            self.student_embeddings[student['id']] = self.model.encode(text, convert_to_numpy=True)
        
        for internship in tqdm(self.internships, desc="Internship embeddings"):
            text = " ".join([
                internship.get('title', ''),
                " ".join(internship.get('skills', [])),
                internship.get('description', '')[:300]
            ])
            self.internship_embeddings[internship['id']] = self.model.encode(text, convert_to_numpy=True)
    
    def compute_dimension_scores(self, student: Dict, internship: Dict) -> Dict[str, float]:
        student_emb = self.student_embeddings.get(student['id'])
        internship_emb = self.internship_embeddings.get(internship['id'])
        
        # Skill score
        if student_emb is not None and internship_emb is not None:
            skill_score = max(0, float(np.dot(student_emb, internship_emb) / 
                              (np.linalg.norm(student_emb) * np.linalg.norm(internship_emb) + 1e-8)))
        else:
            skill_score = 0.0
        
        # Location score
        work_type = internship.get('work_type', '')
        if work_type in ['Remote', 'Hybrid']:
            location_score = 1.0
        elif student.get('city') == internship.get('city'):
            location_score = 1.0
        elif internship.get('city') in student.get('preferred_locations', []):
            location_score = 0.8
        else:
            location_score = 0.3
        
        # Stipend score
        stipend = internship.get('stipend', 0)
        min_s, max_s = student.get('preferred_stipend_min', 0), student.get('preferred_stipend_max', 50000)
        stipend_score = 1.0 if min_s <= stipend <= max_s else 0.5
        
        # Timeline score
        duration = internship.get('duration_months', 3)
        preferred = student.get('preferred_duration_months', [3])
        timeline_score = 1.0 if duration in preferred else 0.5
        
        return {'skills': skill_score, 'location': location_score, 'stipend': stipend_score, 'timeline': timeline_score}
    
    def compute_loss(self, weights_array: np.ndarray, pairs: List) -> float:
        weights = {'skills': weights_array[0], 'location': weights_array[1], 
                   'stipend': weights_array[2], 'timeline': weights_array[3]}
        
        total_loss = 0.0
        for student, internship, gt_score in pairs:
            scores = self.compute_dimension_scores(student, internship)
            predicted = sum(scores[k] * weights[k] for k in weights)
            total_loss += (predicted - gt_score) ** 2
        
        return total_loss / len(pairs)
    
    def prepare_pairs(self) -> List:
        pairs = []
        student_lookup = {s['id']: s for s in self.students}
        internship_lookup = {i['id']: i for i in self.internships}
        
        for match in self.ground_truth:
            student = student_lookup.get(match['student_id'])
            internship = internship_lookup.get(match['internship_id'])
            if student and internship:
                pairs.append((student, internship, match['match_score']))
        
        logger.info(f"Prepared {len(pairs)} training pairs")
        return pairs
    
    def optimize_weights(self, pairs: List) -> Dict[str, float]:
        logger.info("Optimizing weights...")
        
        x0 = np.array([0.5, 0.2, 0.2, 0.1])
        constraints = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1.0}]
        bounds = [(0.05, 0.8) for _ in range(4)]
        
        result = minimize(self.compute_loss, x0, args=(pairs,), method='SLSQP',
                         bounds=bounds, constraints=constraints)
        
        weights = {'skills': float(result.x[0]), 'location': float(result.x[1]),
                   'stipend': float(result.x[2]), 'timeline': float(result.x[3])}
        
        logger.info(f"Optimized weights: {weights}, Loss: {result.fun:.6f}")
        return weights
    
    def cross_validate(self, pairs: List, n_folds: int = 5) -> Dict:
        from sklearn.model_selection import KFold
        
        logger.info(f"Running {n_folds}-fold cross-validation...")
        kf = KFold(n_splits=n_folds, shuffle=True, random_state=42)
        
        fold_results = []
        all_weights = []
        
        for fold, (train_idx, val_idx) in enumerate(kf.split(pairs)):
            train_pairs = [pairs[i] for i in train_idx]
            val_pairs = [pairs[i] for i in val_idx]
            
            weights = self.optimize_weights(train_pairs)
            all_weights.append(weights)
            
            val_loss = self.compute_loss(
                np.array([weights['skills'], weights['location'], weights['stipend'], weights['timeline']]),
                val_pairs
            )
            
            fold_results.append({'fold': fold + 1, 'weights': weights, 'val_loss': val_loss})
            logger.info(f"Fold {fold + 1}: val_loss = {val_loss:.6f}")
        
        avg_weights = {k: np.mean([w[k] for w in all_weights]) for k in ['skills', 'location', 'stipend', 'timeline']}
        total = sum(avg_weights.values())
        avg_weights = {k: v/total for k, v in avg_weights.items()}
        
        return {
            'fold_results': fold_results,
            'average_weights': avg_weights,
            'average_val_loss': np.mean([r['val_loss'] for r in fold_results]),
            'std_val_loss': np.std([r['val_loss'] for r in fold_results])
        }
    
    def train(self) -> Dict:
        logger.info("="*50)
        logger.info("STARTING TRAINING PIPELINE")
        logger.info("="*50)
        
        self.load_data()
        self.precompute_embeddings()
        pairs = self.prepare_pairs()
        
        if len(pairs) < 10:
            raise ValueError(f"Not enough training pairs: {len(pairs)}")
        
        cv_results = self.cross_validate(pairs, min(self.config.cv_folds, len(pairs) // 5))
        final_weights = self.optimize_weights(pairs)
        
        results = {
            'config': {'base_model': self.config.base_model, 'cv_folds': self.config.cv_folds},
            'cross_validation': {
                'average_weights': cv_results['average_weights'],
                'average_val_loss': float(cv_results['average_val_loss']),
                'std_val_loss': float(cv_results['std_val_loss'])
            },
            'final_weights': final_weights,
            'training_stats': {
                'num_students': len(self.students),
                'num_internships': len(self.internships),
                'num_pairs': len(pairs),
                'trained_at': datetime.now().isoformat()
            }
        }
        
        with open(MODEL_DIR / "trained_weights.json", 'w') as f:
            json.dump(results, f, indent=2)
        
        logger.info(f"Results saved to {MODEL_DIR / 'trained_weights.json'}")
        return results


def main():
    print("="*60)
    print("YUVA SETU - WEIGHT TRAINING")
    print("="*60)
    
    try:
        learner = WeightLearner(TrainingConfig())
        results = learner.train()
        
        print("\n" + "="*60)
        print("TRAINING COMPLETE")
        print("="*60)
        print(f"\nFinal Weights:")
        for k, v in results['final_weights'].items():
            print(f"  {k}: {v:.4f}")
        print(f"\nCV Loss: {results['cross_validation']['average_val_loss']:.6f} ± {results['cross_validation']['std_val_loss']:.6f}")
        
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\nRun data generation first:")
        print("  python app/scripts/data/generate_synthetic_dataset.py")


if __name__ == "__main__":
    main()