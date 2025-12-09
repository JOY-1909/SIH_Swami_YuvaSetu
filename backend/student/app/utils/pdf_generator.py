from fpdf import FPDF
from typing import Dict, List
from datetime import datetime
import logging
import re

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
                summary_text = str(data.get('careerObjective', ''))
                # Process bullet points and special characters
                summary_text = ResumePDFGenerator._clean_text_for_ats(summary_text)
                pdf.multi_cell(0, 5, summary_text)
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
                    
                    date_str = ""
                    if start_date or end_date:
                        # Clean date strings
                        start_clean = ResumePDFGenerator._clean_date(start_date)
                        end_clean = ResumePDFGenerator._clean_date(end_date)
                        date_str = f" ({start_clean} - {end_clean})"
                    
                    pdf.cell(0, 5, header_text + date_str, ln=True)
                    
                    if description:
                        pdf.set_font("Helvetica", size=10)
                        # Clean description text
                        clean_desc = ResumePDFGenerator._clean_text_for_ats(description)
                        pdf.multi_cell(0, 5, clean_desc)
                    
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
                        pdf.cell(0, 5, ResumePDFGenerator._clean_text_for_ats(title), ln=True)
                    
                    pdf.set_font("Helvetica", size=10)
                    if role: 
                        role_text = ResumePDFGenerator._clean_text_for_ats(f"Role: {role}")
                        pdf.cell(0, 5, role_text, ln=True)
                    if tech: 
                        tech_text = ResumePDFGenerator._clean_text_for_ats(f"Technologies: {tech}")
                        pdf.cell(0, 5, tech_text, ln=True)
                    if desc: 
                        clean_desc = ResumePDFGenerator._clean_text_for_ats(desc)
                        pdf.multi_cell(0, 5, clean_desc)
                    
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
                    if degree and institution: 
                        line = f"{degree}, {institution}"
                    elif degree: 
                        line = degree
                    elif institution: 
                        line = institution
                    
                    if year: 
                        line += f" ({year})"
                    
                    pdf.set_font("Helvetica", 'B', 10)
                    pdf.cell(0, 5, ResumePDFGenerator._clean_text_for_ats(line), ln=True)
                    
                    if score:
                        pdf.set_font("Helvetica", size=10)
                        score_text = ResumePDFGenerator._clean_text_for_ats(f"Score: {score}")
                        pdf.cell(0, 5, score_text, ln=True)
                    
                    pdf.ln(3)

            # --- SKILLS ---
            skills_data = data.get('skills', [])
            if skills_data and isinstance(skills_data, list) and len(skills_data) > 0:
                ResumePDFGenerator._add_ats_header(pdf, "SKILLS")
                
                # Flatten skills into a comma-separated list for ATS readability
                all_skills = []
                for skill in skills_data:
                    if isinstance(skill, dict) and skill.get('name'):
                        all_skills.append(ResumePDFGenerator._clean_text_for_ats(skill.get('name')))
                    elif isinstance(skill, str):
                        all_skills.append(ResumePDFGenerator._clean_text_for_ats(skill))
                
                if all_skills:
                    pdf.set_font("Helvetica", size=10)
                    skills_text = ResumePDFGenerator._format_skills_for_ats(all_skills)
                    pdf.multi_cell(0, 5, skills_text)
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
                             clean_title = ResumePDFGenerator._clean_text_for_ats(title)
                             clean_provider = ResumePDFGenerator._clean_text_for_ats(provider) if provider else ""
                             extras.append(f"{clean_title} - {clean_provider}" if clean_provider else clean_title)

            # Accomplishments
            achievements = data.get('accomplishments', [])
            if isinstance(achievements, list):
                 for a in achievements:
                     if isinstance(a, dict) and a.get('title'):
                         clean_title = ResumePDFGenerator._clean_text_for_ats(a.get('title'))
                         extras.append(clean_title)
            
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
        pdf.ln(1)
    
    @staticmethod
    def _clean_text_for_ats(text: str) -> str:
        """
        Clean and format text to be ATS-friendly while preserving important characters.
        Converts bullet points to dashes, ensures proper spacing around colons and brackets.
        """
        if not text:
            return ""
        
        # Convert to string
        text = str(text)
        
        # Replace various bullet point characters with dashes (ATS-friendly)
        bullet_replacements = {
            '•': '-',
            '○': '-',
            '▪': '-',
            '‣': '-',
            '→': '-',
            '▶': '-',
            '✓': '-',
            '✔': '-',
            '☆': '-',
            '★': '-',
            '●': '-',
        }
        
        for bullet_char, replacement in bullet_replacements.items():
            text = text.replace(bullet_char, replacement)
        
        # Ensure proper spacing around colons (for ATS parsing)
        text = re.sub(r'(\S):(\S)', r'\1: \2', text)
        text = re.sub(r'(\S):\s+(\S)', r'\1: \2', text)
        
        # Ensure proper spacing around brackets
        text = re.sub(r'(\S)\((\S)', r'\1 (\2', text)  # Add space before (
        text = re.sub(r'(\S)\)(\S)', r'\1) \2', text)  # Add space after )
        
        # Normalize multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Ensure proper hyphen/dash spacing
        text = re.sub(r'(\S)-(\S)', r'\1 - \2', text)
        
        # Remove any non-standard characters that might confuse ATS
        # Keep standard punctuation: , . ; : ! ? - ( ) [ ] { } / \
        text = re.sub(r'[^\w\s\-.,;:!?()\[\]{}/\\\'\"@#$%&*+=|<>]', '', text)
        
        return text.strip()
    
    @staticmethod
    def _clean_date(date_str: str) -> str:
        """Clean date string for ATS"""
        if not date_str:
            return "Present"
        
        # Remove any non-standard characters, keep only alphanumeric and basic punctuation
        date_str = str(date_str)
        date_str = re.sub(r'[^\w\s\-\/]', '', date_str)
        return date_str.strip()
    
    @staticmethod
    def _format_skills_for_ats(skills: List[str]) -> str:
        """
        Format skills list for ATS parsing.
        Uses commas and semicolons appropriately.
        """
        if not skills:
            return ""
        
        # Join with commas, ensure proper formatting
        skills_text = ", ".join(skills)
        
        # Clean the final text
        skills_text = ResumePDFGenerator._clean_text_for_ats(skills_text)
        
        return skills_text