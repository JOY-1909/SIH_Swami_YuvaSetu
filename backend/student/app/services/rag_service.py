# File: app/services/rag_service.py
import faiss
import numpy as np
import logging
from typing import List, Dict, Optional, Tuple
from sentence_transformers import SentenceTransformer
import pickle
from pathlib import Path
import google.generativeai as genai
from app.config import settings

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2', index_path: str = "rag_index.faiss"):
        self.model = SentenceTransformer(model_name)
        self.index: Optional[faiss.Index] = None
        self.documents: List[str] = []
        self.index_path = Path(index_path)
        self.doc_store_path = self.index_path.with_suffix('.pkl')
        self._load_index()
        
        self.gemini_configured = False
        if settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel('gemini-2.0-flash')
                self.gemini_configured = True
                logger.info("✅ Gemini client initialized for RAG generation.")
            except Exception as e:
                logger.error(f"❌ Failed to configure Gemini: {e}")
        else:
            logger.warning("⚠️ No Gemini API key found. RAG generation will be mocked.")

    def _load_index(self):
        """Load index from disk if exists"""
        if self.index_path.exists() and self.doc_store_path.exists():
            try:
                self.index = faiss.read_index(str(self.index_path))
                with open(self.doc_store_path, 'rb') as f:
                    self.documents = pickle.load(f)
                logger.info(f"Loaded RAG index with {self.index.ntotal} documents.")
            except Exception as e:
                logger.error(f"Failed to load RAG index: {e}")
                self.index = None
                self.documents = []
        else:
            logger.info("No existing RAG index found. Initializing empty.")

    def ingest_documents(self, documents: List[str]):
        """Ingest new documents into the vector store"""
        if not documents:
            return

        embeddings = self.model.encode(documents)
        dimension = embeddings.shape[1]

        if self.index is None:
            self.index = faiss.IndexFlatL2(dimension)
        
        self.index.add(np.array(embeddings).astype('float32'))
        self.documents.extend(documents)
        
        self._save_index()
        logger.info(f"Ingested {len(documents)} documents.")

    def _save_index(self):
        """Save index and documents to disk"""
        if self.index:
            faiss.write_index(self.index, str(self.index_path))
            with open(self.doc_store_path, 'wb') as f:
                pickle.dump(self.documents, f)

    def retrieve(self, query: str, k: int = 3) -> List[str]:
        """Retrieve relevant documents for a query"""
        if not self.index or self.index.ntotal == 0:
            return []

        query_vector = self.model.encode([query])
        distances, indices = self.index.search(np.array(query_vector).astype('float32'), k)
        
        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx != -1 and idx < len(self.documents):
                results.append(self.documents[idx])
        
        return results

    def generate_response(self, query: str) -> str:
        """
        Generate a response based on retrieved documents using Gemini.
        """
        context_docs = self.retrieve(query)
        context_str = "\n\n".join(context_docs)
        
        if not self.gemini_configured:
            if not context_docs:
                return "I couldn't find any relevant information to answer your question."
            return f"Based on the available information (API Key missing):\n\n{context_str}"

        try:
            prompt = f"""You are Yuva Setu, a helpful AI assistant for a student internship platform. 
            Use the provided Context to answer the user's Question. 
            If the answer is not in the context, say you don't know but offer general help. 
            Keep answers concise and friendly.

            Context:
            {context_str}

            Question:
            {query}
            """

            response = self.gemini_model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return f"I encountered an issue generating a response. Here is the relevant information I found:\n\n{context_str}"

# Global instance
rag_service = RAGService()

# Initial dummy ingestion for testing if empty
if not rag_service.documents:
    dummy_docs = [
        "Yuva Setu is a platform connecting students with internships throughout India.",
        "To apply for an internship, navigate to the 'Internships' tab, search for a role, and click 'Apply Now'.",
        "Students can track their application status in the 'My Applications' section of the dashboard.",
        "Employers can post internship opportunities and manage applicants through the Employer Portal.",
        "The platform offers internships in various domains including Technology, Marketing, Finance, and Design.",
        "Stipends are determined by the employer and are clearly listed on the internship details page.",
        "You can update your skills, education, and resume in the Profile section.",
        "For technical support, email support@yuvasetu.com or use the 'Help & Support' feature."
    ]
    rag_service.ingest_documents(dummy_docs)
