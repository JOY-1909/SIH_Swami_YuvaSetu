# File: scripts/run_complete_pipeline.py
"""
Complete pipeline script for training, evaluation, and demo
Run this to prepare everything for SIH demo
"""
import os
import sys
import json
import asyncio
from pathlib import Path
from datetime import datetime

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

def print_header(title: str):
    """Print formatted header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60 + "\n")


async def main():
    """Run complete pipeline"""
    
    print_header("YUVA SETU RECOMMENDATION ENGINE - COMPLETE PIPELINE")
    print(f"Started at: {datetime.now().isoformat()}")
    
    # Step 1: Generate Synthetic Data
    print_header("STEP 1: Generating Synthetic Dataset")
    from scripts.data.generate_synthetic_dataset import SyntheticDataGenerator, OUTPUT_DIR
    
    generator = SyntheticDataGenerator(seed=42)
    dataset = generator.generate_dataset(
        num_students=500,
        num_internships=200,
        calculate_all_matches=True
    )
    generator.save_dataset(dataset)
    print("✅ Dataset generated successfully")
    
    # Step 2: Train Model Weights
    print_header("STEP 2: Training Recommendation Weights")
    from scripts.training.train_recommendation_model import WeightLearner, TrainingConfig, MODEL_DIR
    
    config = TrainingConfig(cv_folds=5)
    learner = WeightLearner(config)
    results = learner.train()
    
    print("✅ Training complete")
    print(f"Final weights: {results['final_weights']}")
    print(f"CV Loss: {results['cross_validation']['average_val_loss']:.6f}")
    
    # Step 3: Run Evaluation
    print_header("STEP 3: Evaluating Recommendation Engine")
    from scripts.evaluation.evaluate_recommendations import (
        RecommendationEvaluator, 
        simple_recommendation_function,
        RESULTS_DIR
    )
    
    evaluator = RecommendationEvaluator(k_values=[1, 3, 5, 10, 20])
    evaluator.load_test_data()
    evaluator.weights = results['final_weights']
    
    def rec_func(student, internships, top_k):
        return simple_recommendation_function(student, internships, top_k, evaluator.weights)
    
    evaluator.generate_recommendations(rec_func, top_k=20)
    metrics = evaluator.evaluate()
    report = evaluator.generate_report(metrics)
    evaluator.plot_metrics(metrics)
    
    print("✅ Evaluation complete")
    print(f"  Precision@5: {metrics.precision_at_k[5]:.4f}")
    print(f"  Recall@5: {metrics.recall_at_k[5]:.4f}")
    print(f"  NDCG@5: {metrics.ndcg_at_k[5]:.4f}")
    print(f"  MRR: {metrics.mrr:.4f}")
    
    # Step 4: Generate Summary Report
    print_header("STEP 4: Generating Summary Report")
    
    summary = {
        "project": "Yuva Setu Recommendation Engine",
        "generated_at": datetime.now().isoformat(),
        "dataset": {
            "total_students": dataset["metadata"]["num_students"],
            "total_internships": dataset["metadata"]["num_internships"],
            "total_ground_truth_matches": dataset["metadata"]["num_matches"]
        },
        "training": {
            "model": config.base_model,
            "cv_folds": config.cv_folds,
            "final_weights": results["final_weights"],
            "cv_loss": results["cross_validation"]["average_val_loss"]
        },
        "evaluation": {
            "precision_at_5": metrics.precision_at_k[5],
            "recall_at_5": metrics.recall_at_k[5],
            "ndcg_at_5": metrics.ndcg_at_k[5],
            "mrr": metrics.mrr,
            "hit_rate_at_5": metrics.hit_rate_at_k[5],
            "coverage": metrics.coverage,
            "diversity": metrics.diversity
        },
        "files_generated": [
            str(OUTPUT_DIR / "dataset_full.json"),
            str(MODEL_DIR / "trained_weights.json"),
            str(RESULTS_DIR / "evaluation_report.json"),
            str(RESULTS_DIR / "precision_recall_ndcg.png"),
            str(RESULTS_DIR / "summary_metrics.png")
        ]
    }
    
    summary_path = PROJECT_ROOT / "pipeline_summary.json"
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
    
    print("✅ Summary report generated")
    
    # Final Summary
    print_header("PIPELINE COMPLETE")
    print(f"Finished at: {datetime.now().isoformat()}")
    print(f"\nGenerated files:")
    for file_path in summary["files_generated"]:
        print(f"  - {file_path}")
    
    print(f"\n📊 Key Metrics for SIH Demo:")
    print(f"  - Model: {config.base_model}")
    print(f"  - Training samples: {len(dataset['train']['matches'])}")
    print(f"  - Test samples: {len(dataset['test']['matches'])}")
    print(f"  - Precision@5: {metrics.precision_at_k[5]:.2%}")
    print(f"  - Recall@5: {metrics.recall_at_k[5]:.2%}")
    print(f"  - NDCG@5: {metrics.ndcg_at_k[5]:.2%}")
    print(f"  - Catalog Coverage: {metrics.coverage:.2%}")
    
    return summary


if __name__ == "__main__":
    asyncio.run(main())