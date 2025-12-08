from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.models.support import SupportTicket, TicketCreate, TicketResponse
from app.api.v1.auth import get_current_user
from app.models.user import User
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/create", response_model=TicketResponse)
async def create_ticket(ticket_data: TicketCreate, current_user: User = Depends(get_current_user)):
    """Create a new support ticket"""
    try:
        new_ticket = SupportTicket(
            user_id=str(current_user.id),
            user_email=current_user.email,
            user_name=current_user.full_name or "User",
            subject=ticket_data.subject,
            message=ticket_data.message,
            category=ticket_data.category,
            status="Open"
        )
        await new_ticket.create()
        
        return TicketResponse(
            id=str(new_ticket.id),
            subject=new_ticket.subject,
            message=new_ticket.message,
            status=new_ticket.status,
            created_at=new_ticket.created_at,
            resolution=new_ticket.resolution
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create ticket: {str(e)}")

@router.get("/my-tickets", response_model=List[TicketResponse])
async def get_my_tickets(current_user: User = Depends(get_current_user)):
    """Get all tickets for the current user"""
    try:
        tickets = await SupportTicket.find(SupportTicket.user_email == current_user.email).sort("-created_at").to_list()
        
        return [
            TicketResponse(
                id=str(ticket.id),
                subject=ticket.subject,
                message=ticket.message,
                status=ticket.status,
                created_at=ticket.created_at,
                resolution=ticket.resolution
            ) for ticket in tickets
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tickets: {str(e)}")

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket_details(ticket_id: str, current_user: User = Depends(get_current_user)):
    """Get details of a specific ticket"""
    try:
        ticket = await SupportTicket.get(ticket_id)
        
        if not ticket:
             raise HTTPException(status_code=404, detail="Ticket not found")
             
        # Ensure user owns the ticket
        if ticket.user_email != current_user.email:
             raise HTTPException(status_code=403, detail="Not authorized to view this ticket")
             
        return TicketResponse(
            id=str(ticket.id),
            subject=ticket.subject,
            message=ticket.message,
            status=ticket.status,
            created_at=ticket.created_at,
            resolution=ticket.resolution
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching ticket: {str(e)}")
