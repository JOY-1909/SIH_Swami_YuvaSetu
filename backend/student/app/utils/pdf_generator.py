from fpdf import FPDF
from typing import Dict, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ResumePDFGenerator:
    @staticmethod
    def generate_pdf(data: Dict) -> bytes:
        try:
            # ATS-Friendly Configuration:
            # - Standard fonts (Times, Helvetica, Courier). We use Helvetica as core font.
            # - No graphics, columns, or tables.
            # - Black text on white background.
            # - Clear section headings.
            
            pdf = FPDF()
            pdf.set_margins(20, 20, 20) # Standard 20mm margins
            pdf.add_page()
            
            # --- HEADER (Name & Contact) ---
            first_name = data.get('firstName', '')
            last_name = data.get('lastName', '')
            full_name = f"{first_name} {last_name}".strip().upper()
            
            pdf.set_font("Helvetica", 'B', 16)
            pdf.cell(0, 8, full_name, ln=True, align='C')
            
            pdf.set_font("Helvetica", size=10)
            contact_parts = []
            if data.get('email'): contact_parts.append(data.get('email'))
            if data.get('phone'): contact_parts.append(data.get('phone'))
            if data.get('linkedin'): contact_parts.append(data.get('linkedin'))
            if data.get('address'): contact_parts.append(data.get('address'))
            
            if contact_parts:
                contact_line = " | ".join(contact_parts)
                pdf.cell(0, 5, contact_line, ln=True, align='C')
            
            pdf.ln(5)
            # Add a simple horizontal line
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(5)

            # --- PROFESSIONAL SUMMARY ---
            if data.get('careerObjective'):
                ResumePDFGenerator._add_ats_header(pdf, "PROFESSIONAL SUMMARY")
                pdf.set_font("Helvetica", size=10)
                pdf.multi_cell(0, 5, str(data.get('careerObjective', '')))
                pdf.ln(3)

            # --- EXPERIENCE ---
            experience_data = data.get('experience', [])
            if experience_data and isinstance(experience_data, list) and len(experience_data) > 0:
                ResumePDFGenerator._add_ats_header(pdf, "WORK EXPERIENCE")
                
                for exp in experience_data:
                    if not isinstance(exp, dict): continue
                    
                    company = exp.get('company', '')
                    role = exp.get('role', '')
                    start_date = exp.get('startDate', '')
                    end_date = exp.get('endDate', '')
                    description = exp.get('description', '')
                    
                    # Role and Company line
                    header_text = ""
                    if role and company: 
                        header_text = f"{role}, {company}"
                    else: 
                        header_text = role or company
                    
                    pdf.set_font("Helvetica", 'B', 10) # Bold for role/company
                    # Date on the right is tricky in FPDF without columns, so we put it next or below.
                    # ATS parses linear text better. Let's put date on the same line or next line.
                    # Standard format: Role, Company | Date
                    
                    date_str = ""
                    if start_date or end_date:
                        date_str = f" ({start_date} - {end_date})"
                    
                    pdf.cell(0, 5, header_text + date_str, ln=True)
                    
                    if description:
                        pdf.set_font("Helvetica", size=10)
                        pdf.multi_cell(0, 5, description)
                    
                    pdf.ln(3)

            # --- PROJECTS ---
            projects_data = data.get('projects', [])
            if projects_data and isinstance(projects_data, list) and len(projects_data) > 0:
                ResumePDFGenerator._add_ats_header(pdf, "PROJECTS")
                
                for project in projects_data:
                    if not isinstance(project, dict): continue
                    
                    title = project.get('title', '')
                    role = project.get('role', '')
                    desc = project.get('description', '')
                    tech = project.get('technologies', '')
                    
                    if title:
                        pdf.set_font("Helvetica", 'B', 10)
                        pdf.cell(0, 5, title, ln=True)
                    
                    pdf.set_font("Helvetica", size=10)
                    if role: pdf.cell(0, 5, f"Role: {role}", ln=True)
                    if tech: pdf.cell(0, 5, f"Technologies: {tech}", ln=True)
                    if desc: pdf.multi_cell(0, 5, desc)
                    
                    pdf.ln(3)

            # --- EDUCATION ---
            education_data = data.get('education', [])
            if education_data and isinstance(education_data, list) and len(education_data) > 0:
                ResumePDFGenerator._add_ats_header(pdf, "EDUCATION")
                
                for edu in education_data:
                    if not isinstance(edu, dict): continue
                    
                    institution = edu.get('institution', '')
                    degree = edu.get('degree', '')
                    year = edu.get('endYear', '')
                    score = edu.get('score', '')
                    
                    line = ""
                    if degree and institution: line = f"{degree}, {institution}"
                    elif degree: line = degree
                    elif institution: line = institution
                    
                    if year: line += f" ({year})"
                    
                    pdf.set_font("Helvetica", 'B', 10)
                    pdf.cell(0, 5, line, ln=True)
                    
                    if score:
                        pdf.set_font("Helvetica", size=10)
                        pdf.cell(0, 5, f"Score: {score}", ln=True)
                    
                    pdf.ln(3)

            # --- SKILLS ---
            skills_data = data.get('skills', [])
            if skills_data and isinstance(skills_data, list) and len(skills_data) > 0:
                ResumePDFGenerator._add_ats_header(pdf, "SKILLS")
                
                # Flatten skills into a comma-separated list for ATS readability
                all_skills = []
                for skill in skills_data:
                    if isinstance(skill, dict) and skill.get('name'):
                        all_skills.append(skill.get('name'))
                    elif isinstance(skill, str):
                        all_skills.append(skill)
                
                if all_skills:
                    pdf.set_font("Helvetica", size=10)
                    pdf.multi_cell(0, 5, ", ".join(all_skills))
                    pdf.ln(3)

            # --- AWARDS & CERTIFICATIONS ---
            # Combining these for compactness
            extras = []
            
            # Trainings/Certs
            trainings = data.get('trainings', [])
            if isinstance(trainings, list):
                for t in trainings:
                    if isinstance(t, dict):
                         title = t.get('title', '')
                         provider = t.get('provider', '')
                         if title:
                             extras.append(f"{title} - {provider}" if provider else title)

            # Accomplishments
            achievements = data.get('accomplishments', [])
            if isinstance(achievements, list):
                 for a in achievements:
                     if isinstance(a, dict) and a.get('title'):
                         extras.append(a.get('title'))
            
            if extras:
                ResumePDFGenerator._add_ats_header(pdf, "CERTIFICATIONS & AWARDS")
                pdf.set_font("Helvetica", size=10)
                for item in extras:
                     pdf.cell(0, 5, f"- {item}", ln=True)

            return pdf.output()
            
        except Exception as e:
            logger.error(f"Error in PDF generation: {str(e)}")
            raise Exception(f"Failed to generate PDF: {str(e)}")
    
    @staticmethod
    def _add_ats_header(pdf: FPDF, title: str):
        """Add a clean, bold, uppercase section header"""
        pdf.ln(2)
        pdf.set_font("Helvetica", 'B', 11)
        pdf.cell(0, 6, title.upper(), ln=True)
        # Optional: Add a subtle underline manually if needed, but simple bold caps is very ATS friendly.
        # pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + pdf.get_string_width(title), pdf.get_y())
        pdf.ln(1)