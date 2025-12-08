# File: app/scripts/evaluation/evaluate_recommendations.py
"""
Complete evaluation framework for recommendation engine
"""
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass
from collections import defaultdict
import logging
from datetime import datetime
from tqdm import tqdm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
SCRIPT_DIR = Path(__file__).resolve().parent
APP_DIR = SCRIPT_DIR.parent.parent
PROJECT_ROOT = APP_DIR.parent

DATA_DIR = PROJECT_ROOT / "data" / "synthetic"
MODEL_DIR = PROJECT_ROOT / "models"
RESULTS_DIR = PROJECT_ROOT / "evaluation_results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

print(f"Project root: {PROJECT_ROOT}")
print(f"Results directory: {RESULTS_DIR}")


@dataclass
class EvaluationMetrics:
    precision_at_k: Dict[int, float]
    recall_at_k: Dict[int, float]
    ndcg_at_k: Dict[int, float]
    mrr: float
    hit_rate_at_k: Dict[int, float]
    map_score: float
    coverage: float
    diversity: float
    average_match_score: float
    excellent_match_rate: float
    good_match_rate: float


class RecommendationEvaluator:
    def __init__(self, k_values: List[int] = [1, 3, 5, 10, 20]):
        self.k_values = k_values
        self.students = []
        self.internships = []
        self.ground_truth = []
        self.ground_truth_lookup = {}
        self.weights = None
        self.model = None
        self.recommendations = {}
        self.student_embeddings = {}
        self.internship_embeddings = {}
    
    def load_data(self):
        logger.info("Loading test data...")
        test_dir = DATA_DIR / "test"
        
        if not test_dir.exists():
            raise FileNotFoundError(f"Test data not found at {test_dir}")
        
        with open(test_dir / "students.json") as f:
            self.students = json.load(f)
        with open(test_dir / "internships.json") as f:
            self.internships = json.load(f)
        with open(test_dir / "matches.json") as f:
            self.ground_truth = json.load(f)
        
        for match in self.ground_truth:
            sid = match['student_id']
            if sid not in self.ground_truth_lookup:
                self.ground_truth_lookup[sid] = []
            self.ground_truth_lookup[sid].append(match)
        
        logger.info(f"Loaded {len(self.students)} students, {len(self.internships)} internships")
    
    def load_weights(self):
        weights_path = MODEL_DIR / "trained_weights.json"
        if weights_path.exists():
            with open(weights_path) as f:
                self.weights = json.load(f)['final_weights']
            logger.info(f"Loaded weights: {self.weights}")
        else:
            self.weights = {'skills': 0.5, 'location': 0.2, 'stipend': 0.2, 'timeline': 0.1}
            logger.warning("Using default weights")
    
    def compute_embeddings(self):
        from sentence_transformers import SentenceTransformer
        logger.info("Computing embeddings...")
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        
        for s in tqdm(self.students, desc="Students"):
            text = " ".join([sk['name'] for sk in s.get('skills', [])] + [s.get('career_objective', '')])
            self.student_embeddings[s['id']] = self.model.encode(text, convert_to_numpy=True)
        
        for i in tqdm(self.internships, desc="Internships"):
            text = " ".join([i.get('title', '')] + i.get('skills', []) + [i.get('description', '')[:200]])
            self.internship_embeddings[i['id']] = self.model.encode(text, convert_to_numpy=True)
    
    def compute_score(self, student: Dict, internship: Dict) -> float:
        s_emb = self.student_embeddings.get(student['id'])
        i_emb = self.internship_embeddings.get(internship['id'])
        
        skill = max(0, float(np.dot(s_emb, i_emb) / (np.linalg.norm(s_emb) * np.linalg.norm(i_emb) + 1e-8))) if s_emb is not None else 0
        
        wt = internship.get('work_type', '')
        if wt in ['Remote', 'Hybrid'] or student.get('city') == internship.get('city'):
            location = 1.0
        elif internship.get('city') in student.get('preferred_locations', []):
            location = 0.8
        else:
            location = 0.3
        
        stipend = 1.0 if student.get('preferred_stipend_min', 0) <= internship.get('stipend', 0) <= student.get('preferred_stipend_max', 50000) else 0.5
        timeline = 1.0 if internship.get('duration_months', 3) in student.get('preferred_duration_months', [3]) else 0.5
        
        return (skill * self.weights['skills'] + location * self.weights['location'] + 
                stipend * self.weights['stipend'] + timeline * self.weights['timeline'])
    
    def generate_recommendations(self, top_k: int = 20):
        logger.info("Generating recommendations...")
        
        for student in tqdm(self.students, desc="Recommendations"):
            scored = []
            for internship in self.internships:
                score = self.compute_score(student, internship)
                scored.append({'internship_id': internship['id'], 'score': score})
            
            scored.sort(key=lambda x: x['score'], reverse=True)
            self.recommendations[student['id']] = scored[:top_k]
    
    def precision_at_k(self, k: int, threshold: float = 0.5) -> float:
        precisions = []
        for sid, recs in self.recommendations.items():
            relevant = {m['internship_id'] for m in self.ground_truth_lookup.get(sid, []) if m['match_score'] >= threshold}
            if not relevant:
                continue
            rec_ids = {r['internship_id'] for r in recs[:k]}
            precisions.append(len(relevant & rec_ids) / k)
        return np.mean(precisions) if precisions else 0.0
    
    def recall_at_k(self, k: int, threshold: float = 0.5) -> float:
        recalls = []
        for sid, recs in self.recommendations.items():
            relevant = {m['internship_id'] for m in self.ground_truth_lookup.get(sid, []) if m['match_score'] >= threshold}
            if not relevant:
                continue
            rec_ids = {r['internship_id'] for r in recs[:k]}
            recalls.append(len(relevant & rec_ids) / len(relevant))
        return np.mean(recalls) if recalls else 0.0
    
    def ndcg_at_k(self, k: int) -> float:
        ndcgs = []
        for sid, recs in self.recommendations.items():
            gt = {m['internship_id']: m['match_score'] for m in self.ground_truth_lookup.get(sid, [])}
            if not gt:
                continue
            
            dcg = sum(gt.get(r['internship_id'], 0) / np.log2(i + 2) for i, r in enumerate(recs[:k]))
            ideal = sorted(gt.values(), reverse=True)[:k]
            idcg = sum(s / np.log2(i + 2) for i, s in enumerate(ideal))
            ndcgs.append(dcg / idcg if idcg > 0 else 0)
        return np.mean(ndcgs) if ndcgs else 0.0
    
    def mrr(self, threshold: float = 0.5) -> float:
        rrs = []
        for sid, recs in self.recommendations.items():
            relevant = {m['internship_id'] for m in self.ground_truth_lookup.get(sid, []) if m['match_score'] >= threshold}
            if not relevant:
                continue
            for i, r in enumerate(recs):
                if r['internship_id'] in relevant:
                    rrs.append(1 / (i + 1))
                    break
            else:
                rrs.append(0)
        return np.mean(rrs) if rrs else 0.0
    
    def hit_rate_at_k(self, k: int, threshold: float = 0.5) -> float:
        hits, total = 0, 0
        for sid, recs in self.recommendations.items():
            relevant = {m['internship_id'] for m in self.ground_truth_lookup.get(sid, []) if m['match_score'] >= threshold}
            if not relevant:
                continue
            total += 1
            if relevant & {r['internship_id'] for r in recs[:k]}:
                hits += 1
        return hits / total if total > 0 else 0.0
    
    def mean_average_precision(self, threshold: float = 0.5) -> float:
        aps = []
        for sid, recs in self.recommendations.items():
            relevant = {m['internship_id'] for m in self.ground_truth_lookup.get(sid, []) if m['match_score'] >= threshold}
            if not relevant:
                continue
            hits, prec_sum = 0, 0
            for i, r in enumerate(recs):
                if r['internship_id'] in relevant:
                    hits += 1
                    prec_sum += hits / (i + 1)
            aps.append(prec_sum / len(relevant))
        return np.mean(aps) if aps else 0.0
    
    def coverage(self) -> float:
        all_items = {i['id'] for i in self.internships}
        rec_items = {r['internship_id'] for recs in self.recommendations.values() for r in recs}
        return len(rec_items) / len(all_items) if all_items else 0.0
    
    def diversity(self) -> float:
        lookup = {i['id']: i for i in self.internships}
        divs = []
        for recs in self.recommendations.values():
            cats = [lookup.get(r['internship_id'], {}).get('category', '') for r in recs]
            if cats:
                divs.append(len(set(cats)) / len(cats))
        return np.mean(divs) if divs else 0.0
    
    def match_quality(self) -> Dict[str, float]:
        scores, excellent, good, total = [], 0, 0, 0
        for sid, recs in self.recommendations.items():
            gt = {m['internship_id']: m for m in self.ground_truth_lookup.get(sid, [])}
            for r in recs[:10]:
                m = gt.get(r['internship_id'])
                if m:
                    scores.append(m['match_score'])
                    if m['match_quality'] == 'excellent':
                        excellent += 1
                    elif m['match_quality'] == 'good':
                        good += 1
                    total += 1
        return {
            'avg_score': np.mean(scores) if scores else 0,
            'excellent_rate': excellent / total if total else 0,
            'good_rate': good / total if total else 0
        }
    
    def evaluate(self) -> EvaluationMetrics:
        logger.info("Running evaluation...")
        mq = self.match_quality()
        return EvaluationMetrics(
            precision_at_k={k: self.precision_at_k(k) for k in self.k_values},
            recall_at_k={k: self.recall_at_k(k) for k in self.k_values},
            ndcg_at_k={k: self.ndcg_at_k(k) for k in self.k_values},
            mrr=self.mrr(),
            hit_rate_at_k={k: self.hit_rate_at_k(k) for k in self.k_values},
            map_score=self.mean_average_precision(),
            coverage=self.coverage(),
            diversity=self.diversity(),
            average_match_score=mq['avg_score'],
            excellent_match_rate=mq['excellent_rate'],
            good_match_rate=mq['good_rate']
        )
    
    def save_report(self, metrics: EvaluationMetrics) -> Dict:
        report = {
            "evaluation_date": datetime.now().isoformat(),
            "dataset": {"students": len(self.students), "internships": len(self.internships), "matches": len(self.ground_truth)},
            "weights": self.weights,
            "metrics": {
                "precision": {str(k): round(v, 4) for k, v in metrics.precision_at_k.items()},
                "recall": {str(k): round(v, 4) for k, v in metrics.recall_at_k.items()},
                "ndcg": {str(k): round(v, 4) for k, v in metrics.ndcg_at_k.items()},
                "mrr": round(metrics.mrr, 4),
                "hit_rate": {str(k): round(v, 4) for k, v in metrics.hit_rate_at_k.items()},
                "map": round(metrics.map_score, 4),
                "coverage": round(metrics.coverage, 4),
                "diversity": round(metrics.diversity, 4),
                "avg_match_score": round(metrics.average_match_score, 4),
                "excellent_rate": round(metrics.excellent_match_rate, 4),
                "good_rate": round(metrics.good_match_rate, 4)
            }
        }
        
        with open(RESULTS_DIR / "evaluation_report.json", 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def plot_metrics(self, metrics: EvaluationMetrics):
        try:
            import matplotlib.pyplot as plt
            
            fig, axes = plt.subplots(1, 3, figsize=(15, 5))
            k_vals = list(metrics.precision_at_k.keys())
            
            axes[0].plot(k_vals, list(metrics.precision_at_k.values()), 'b-o')
            axes[0].set_xlabel('K'); axes[0].set_ylabel('Precision@K'); axes[0].set_title('Precision at K'); axes[0].grid(True)
            
            axes[1].plot(k_vals, list(metrics.recall_at_k.values()), 'g-o')
            axes[1].set_xlabel('K'); axes[1].set_ylabel('Recall@K'); axes[1].set_title('Recall at K'); axes[1].grid(True)
            
            axes[2].plot(k_vals, list(metrics.ndcg_at_k.values()), 'r-o')
            axes[2].set_xlabel('K'); axes[2].set_ylabel('NDCG@K'); axes[2].set_title('NDCG at K'); axes[2].grid(True)
            
            plt.tight_layout()
            plt.savefig(RESULTS_DIR / 'metrics_plot.png', dpi=150)
            plt.close()
            logger.info(f"Plot saved to {RESULTS_DIR / 'metrics_plot.png'}")
        except ImportError:
            logger.warning("matplotlib not available, skipping plot")


def main():
    print("="*60)
    print("YUVA SETU - RECOMMENDATION EVALUATION")
    print("="*60)
    
    try:
        evaluator = RecommendationEvaluator()
        evaluator.load_data()
        evaluator.load_weights()
        evaluator.compute_embeddings()
        evaluator.generate_recommendations(top_k=20)
        
        metrics = evaluator.evaluate()
        report = evaluator.save_report(metrics)
        evaluator.plot_metrics(metrics)
        
        print("\n" + "="*60)
        print("EVALUATION RESULTS")
        print("="*60)
        print(f"\n📊 Ranking Metrics:")
        print(f"  Precision@5:  {metrics.precision_at_k[5]:.4f}")
        print(f"  Recall@5:     {metrics.recall_at_k[5]:.4f}")
        print(f"  NDCG@5:       {metrics.ndcg_at_k[5]:.4f}")
        print(f"  MRR:          {metrics.mrr:.4f}")
        print(f"  MAP:          {metrics.map_score:.4f}")
        
        print(f"\n🎯 Quality Metrics:")
        print(f"  Coverage:     {metrics.coverage:.4f}")
        print(f"  Diversity:    {metrics.diversity:.4f}")
        print(f"  Avg Match:    {metrics.average_match_score:.4f}")
        print(f"  Excellent %:  {metrics.excellent_match_rate:.2%}")
        print(f"  Good %:       {metrics.good_match_rate:.2%}")
        
        print(f"\n✅ Report saved to {RESULTS_DIR / 'evaluation_report.json'}")
        
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\nRun these first:")
        print("  1. python app/scripts/data/generate_synthetic_dataset.py")
        print("  2. python app/scripts/training/train_recommendation_model.py")


if __name__ == "__main__":
    main()