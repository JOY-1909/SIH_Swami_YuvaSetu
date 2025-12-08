from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fpdf import FPDF
import os
from app.services.rag_service import rag_service
from pathlib import Path

router = APIRouter()

GUIDELINES_CONTENT = """
YUVA SETU INTERNSHIP GUIDELINES

1. Eligibility
- Students currently enrolled in a recognized university or college in India.
- Must have a valid student ID.
- Minimum age of 18 years.

2. Application Process
- Browse internshpis on the "Internships" tab.
- Click "Apply Now" and submit your profile.
- You can apply to a maximum of 3 internships simultaneously.

3. Duration & Stipend
- Standard internship duration is 8 weeks to 6 months.
- Stipends are decided by the employer and paid monthly.
- Unpaid internships must offer a certificate of completion.

4. Code of Conduct
- Maintain professionalism and punctuality.
- Respect employer's confidentiality and intellectual property.
- Any misconduct may lead to termination and blacklisting from the platform.



5. Interview Tips
- Research the company and role beforehand.
- Be punctual for the interview (online or offline).
- Dress professionally and communicate clearly.
- Prepare questions to ask the interviewer.

6. Post-Internship Opportunities
- Successful interns may be offered full-time roles (PPO).
- You can request a recommendation letter from your mentor.
- Update your Yuva Setu profile with the new experience.

7. Support
- For grievances, contact support@yuvasetu.com
- Emergency helpline: 1800-YUVA-HELP
"""

PDF_PATH = "generated_guidelines.pdf"

def generate_pdf():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=12)
    
    # Title
    pdf.set_font("Helvetica", style="B", size=16)
    pdf.cell(0, 10, "Yuva Setu Platform Guidelines", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(10)
    
    # Content
    pdf.set_font("Helvetica", size=12)
    pdf.multi_cell(0, 10, GUIDELINES_CONTENT)
    
    pdf.output(PDF_PATH)
    return PDF_PATH

@router.get("/download")
async def download_guidelines(background_tasks: BackgroundTasks):
    """Generate and download the guidelines PDF"""
    try:
        file_path = generate_pdf()
        
        # Auto-ingest into RAG if not already done (naive check)
        # We can also make this explicit via another endpoint, but doing it here ensures
        # the RAG has the latest if the PDF is generated.
        # Ideally, we should do this on startup or separate admin trigger.
        # For now, let's just do it here for demonstration or have a separate ingest endpoint.
        
        return FileResponse(file_path, media_type="application/pdf", filename="YuvaSetu_Guidelines.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest")
async def ingest_guidelines():
    """Ingest the guidelines content into the RAG system"""
    try:
        # Ingest the enriched Knowledge Base file
        kb_path = Path("app/data/knowledge_base.txt")
        if not kb_path.exists():
             # Fallback if file missing
             rag_service.ingest_documents([GUIDELINES_CONTENT])
             return {"status": "warning", "message": "Knowledge base file not found. Ingested basic guidelines."}
             
        with open(kb_path, "r") as f:
            kb_content = f.read()
            
        # Chunk the content by double newlines (paragraphs/sections)
        # Filter out empty chunks and strip whitespace
        chunks = [chunk.strip() for chunk in kb_content.split('\n\n') if chunk.strip()]
        
        rag_service.ingest_documents(chunks)
        return {"status": "success", "message": f"Enriched Knowledge Base ingested into RAG ({len(chunks)} chunks)."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
