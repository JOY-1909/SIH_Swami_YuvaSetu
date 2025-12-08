from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.auth import PersonalDetailsRequest
from datetime import datetime

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.put("/personal-details", response_model=dict)
async def update_personal_details(
    request: PersonalDetailsRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Update personal details submitted from frontend.
    """
    # Update user fields with validated data from Pydantic schema
    current_user.full_name = request.full_name
    current_user.contact_number = request.contact_number
    current_user.phone = request.contact_number  # Assuming phone same as contact number
    current_user.phone_verified = True  # You can add verification check previously
    current_user.address = request.address
    current_user.differently_abled = request.differently_abled
    current_user.updated_at = datetime.utcnow()

    # Split full name into first and last name
    name_parts = request.full_name.strip().split(" ", 1)
    current_user.first_name = name_parts[0]
    current_user.last_name = name_parts[1] if len(name_parts) > 1 else ""

    await current_user.save()

    return {
        "success": True,
        "message": "Personal details updated successfully",
        "profile_completed": current_user.profile_completed,
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "full_name": current_user.full_name,
            "phone_verified": current_user.phone_verified,
        }
    }
