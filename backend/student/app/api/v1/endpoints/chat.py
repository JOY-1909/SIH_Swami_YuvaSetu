from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.rag_service import rag_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    context: Optional[List[str]] = None

@router.post("/query", response_model=ChatResponse)
async def chat_query(request: ChatRequest):
    """
    Process a user query and return a response from the RAG chatbot.
    """
    try:
        response_text = rag_service.generate_response(request.message)
        # Optionally return context for debugging/display
        context = rag_service.retrieve(request.message)
        return ChatResponse(response=response_text, context=context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
