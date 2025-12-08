# File: Yuva-setu/backend/app/api/v1/resume.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.api.deps import get_current_user
from app.utils.pdf_generator import ResumePDFGenerator
import io
import logging
import traceback

router = APIRouter(prefix="/resume", tags=["Resume"])
logger = logging.getLogger(__name__)

@router.post("/generate-pdf")
async def generate_resume_pdf(
    resume_data: dict,
    current_user=Depends(get_current_user),
):
    """
    Generate a professional Resume PDF from user-provided data.
    """
    try:
        logger.info(f"Generating resume PDF for user: {current_user.email}")
        
        # Add user email to resume data if not present
        if 'email' not in resume_data and hasattr(current_user, 'email'):
            resume_data['email'] = current_user.email
        
        # Validate required fields
        if not resume_data.get('firstName'):
            # Try to get first name from current user
            if hasattr(current_user, 'first_name'):
                resume_data['firstName'] = current_user.first_name
            else:
                resume_data['firstName'] = "User"
        
        if not resume_data.get('lastName'):
            if hasattr(current_user, 'last_name'):
                resume_data['lastName'] = current_user.last_name
        
        logger.info(f"Generating PDF with data structure: {list(resume_data.keys())}")
        
        pdf_bytes = ResumePDFGenerator.generate_pdf(resume_data)
        
        # Create filename with user name
        first_name = resume_data.get('firstName', 'user').replace(' ', '_')
        last_name = resume_data.get('lastName', '').replace(' ', '_')
        filename = f"resume_{first_name}_{last_name}.pdf".strip('_').replace('__', '_')
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")