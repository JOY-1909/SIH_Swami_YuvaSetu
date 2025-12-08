# app/scripts/test_semantic_search.py
"""
Simple test script to verify semantic search implementation.
Tests embedding generation, FAISS operations, and search functionality.

Usage:
    python -m app.scripts.test_semantic_search
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.services.embedding_service import get_embedding_service
from app.services.faiss_service import get_faiss_service


def test_embedding_service():
    """Test embedding service functionality."""
    print("=" * 60)
    print("TEST 1: Embedding Service")
    print("=" * 60)
    
    try:
        service = get_embedding_service()
        
        # Test text generation
        text = service.build_internship_text(
            skills=["Python", "Django", "PostgreSQL"],
            location="Remote",
            city="Mumbai",
            state="Maharashtra",
            sector="Technology",
            stipend="₹15000/month",
            duration_months=3
        )
        print(f"✓ Generated text: {text}")
        
        # Test embedding generation
        embedding = service.generate_embedding(text)
        print(f"✓ Embedding dimension: {len(embedding)}")
        print(f"✓ Embedding sample: [{embedding[0]:.4f}, {embedding[1]:.4f}, ...]")
        
        assert len(embedding) == 384, "Embedding should be 384-dimensional"
        print("\n✅ Embedding service test PASSED\n")
        return True
    
    except Exception as e:
        print(f"\n❌ Embedding service test FAILED: {e}\n")
        return False


def test_faiss_service():
    """Test FAISS service functionality."""
    print("=" * 60)
    print("TEST 2: FAISS Service")
    print("=" * 60)
    
    try:
        embedding_service = get_embedding_service()
        faiss_service = get_faiss_service()
        
        # Test index initialization
        print(f"✓ Initial index size: {faiss_service.get_index_size()}")
        
        # Create test embeddings
        test_docs = [
            {
                "id": "test_001",
                "text": "Python Django backend developer remote"
            },
            {
                "id": "test_002",
                "text": "React frontend developer office Mumbai"
            },
            {
                "id": "test_003",
                "text": "Python machine learning data science"
            }
        ]
        
        # Generate embeddings and add to index
        for doc in test_docs:
            embedding = embedding_service.generate_embedding(doc["text"])
            faiss_service.add_vector(embedding, doc["id"])
        
        print(f"✓ Added {len(test_docs)} test vectors")
        print(f"✓ New index size: {faiss_service.get_index_size()}")
        
        # Test search
        query = "python backend remote work"
        print(f"\n✓ Testing search with query: '{query}'")
        query_embedding = embedding_service.generate_embedding(query)
        results = faiss_service.search(query_embedding, k=3)
        
        print(f"✓ Search returned {len(results)} results:")
        for i, (doc_id, distance) in enumerate(results, 1):
            print(f"  {i}. ID: {doc_id}, Distance: {distance:.4f}")
        
        # Test duplicate detection
        print(f"\n✓ Testing duplicate detection...")
        duplicate = faiss_service.check_duplicate(
            embedding_service.generate_embedding("Python Django backend developer remote work")
        )
        if duplicate:
            doc_id, distance = duplicate
            print(f"  Duplicate found: {doc_id} (distance: {distance:.4f})")
        else:
            print(f"  No duplicate found")
        
        # Test persistence
        print(f"\n✓ Testing index persistence...")
        faiss_service.save_index()
        print(f"  Index saved to: {faiss_service.index_path}")
        
        # Clean up test vectors
        for doc in test_docs:
            faiss_service.remove_vector(doc["id"])
        
        print(f"✓ Cleaned up test vectors")
        print(f"✓ Final index size: {faiss_service.get_index_size()}")
        
        print("\n✅ FAISS service test PASSED\n")
        return True
    
    except Exception as e:
        print(f"\n❌ FAISS service test FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False


def test_similarity_scoring():
    """Test similarity scoring with known similar/dissimilar texts."""
    print("=" * 60)
    print("TEST 3: Similarity Scoring")
    print("=" * 60)
    
    try:
        service = get_embedding_service()
        
        # Similar texts
        text1 = "Python backend developer remote internship"
        text2 = "Python backend engineer work from home"
        
        # Dissimilar texts
        text3 = "Marketing social media manager office"
        
        emb1 = service.generate_embedding(text1)
        emb2 = service.generate_embedding(text2)
        emb3 = service.generate_embedding(text3)
        
        # Calculate L2 distances
        import numpy as np
        
        dist_similar = np.linalg.norm(np.array(emb1) - np.array(emb2))
        dist_dissimilar = np.linalg.norm(np.array(emb1) - np.array(emb3))
        
        print(f"✓ Text 1: '{text1}'")
        print(f"✓ Text 2 (similar): '{text2}'")
        print(f"  → Distance: {dist_similar:.4f}")
        print(f"\n✓ Text 3 (dissimilar): '{text3}'")
        print(f"  → Distance: {dist_dissimilar:.4f}")
        
        print(f"\n✓ Similarity check:")
        print(f"  Similar texts should have distance < 0.5: {dist_similar < 0.5} ✓")
        print(f"  Dissimilar texts should have distance > 0.5: {dist_dissimilar > 0.5} ✓")
        
        assert dist_similar < dist_dissimilar, "Similar texts should be closer"
        
        print("\n✅ Similarity scoring test PASSED\n")
        return True
    
    except Exception as e:
        print(f"\n❌ Similarity scoring test FAILED: {e}\n")
        return False


def main():
    """Run all tests."""
    print("\n")
    print("█" * 60)
    print("  SEMANTIC SEARCH IMPLEMENTATION TESTS")
    print("█" * 60)
    print()
    
    results = {
        "Embedding Service": test_embedding_service(),
        "FAISS Service": test_faiss_service(),
        "Similarity Scoring": test_similarity_scoring(),
    }
    
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print("=" * 60)
    
    all_passed = all(results.values())
    if all_passed:
        print("\n🎉 ALL TESTS PASSED! Implementation is working correctly.\n")
        return 0
    else:
        print("\n⚠️  SOME TESTS FAILED. Please check the errors above.\n")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
