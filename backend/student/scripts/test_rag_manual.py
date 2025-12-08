
import sys
import os
from pathlib import Path

# Add backend directory to sys.path
backend_path = Path("/Users/shubhamkhilari/TEST/SIH_2025_Final/backend/student")
sys.path.append(str(backend_path))

from app.services.rag_service import rag_service

def test_rag_logic():
    print("Testing RAG Service...")
    
    # Ingest test documents
    docs = [
        "The internship duration is 6 months.",
        "You can apply for up to 3 internships at a time.",
        "Contact support@yuvasetu.com for help."
    ]
    rag_service.ingest_documents(docs)
    print("✅ Ingested documents.")

    # Test retrieval
    query = "How long is the internship?"
    results = rag_service.retrieve(query, k=1)
    
    print(f"Query: {query}")
    print(f"Retrieved: {results}")

    if results and "6 months" in results[0]:
        print("✅ Retrieval works!")
    else:
        print("❌ Retrieval failed or not accurate.")

    # Test generation (mock)
    response = rag_service.generate_response(query)
    print(f"Response: {response}")
    
    if "6 months" in response:
        print("✅ Mock generation works!")
    else:
        print("❌ Mock generation failed.")

if __name__ == "__main__":
    test_rag_logic()
