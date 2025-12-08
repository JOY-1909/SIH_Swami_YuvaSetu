# File: app/scripts/data/generate_synthetic_dataset.py
"""
Generate synthetic but realistic dataset for training and evaluation
"""
import json
import random
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Tuple
import numpy as np
from dataclasses import dataclass, asdict
from enum import Enum
import logging
import sys

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the project root directory
SCRIPT_DIR = Path(__file__).resolve().parent
APP_DIR = SCRIPT_DIR.parent.parent  # app/scripts/data -> app/scripts -> app
PROJECT_ROOT = APP_DIR.parent  # app -> project_root (backend/student)

# Output directories
DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_DIR = DATA_DIR / "synthetic"

# Create directories
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
(OUTPUT_DIR / "train").mkdir(parents=True, exist_ok=True)
(OUTPUT_DIR / "test").mkdir(parents=True, exist_ok=True)

print(f"Script directory: {SCRIPT_DIR}")
print(f"Project root: {PROJECT_ROOT}")
print(f"Output directory: {OUTPUT_DIR}")


class MatchQuality(Enum):
    """Ground truth match quality levels"""
    EXCELLENT = "excellent"
    GOOD = "good"
    MODERATE = "moderate"
    POOR = "poor"
    IRRELEVANT = "irrelevant"


# ============ INDIA-SPECIFIC DATA ============

INDIAN_SKILLS_TAXONOMY = {
    "technology": [
        "Python", "Java", "JavaScript", "React", "Node.js", "Angular", "Vue.js",
        "Machine Learning", "Deep Learning", "Data Science", "AI", "TensorFlow",
        "PyTorch", "SQL", "MongoDB", "PostgreSQL", "AWS", "Azure", "GCP",
        "Docker", "Kubernetes", "Git", "Linux", "C++", "C#", ".NET",
        "Flutter", "React Native", "Android", "iOS", "Swift", "Kotlin",
        "HTML", "CSS", "TypeScript", "GraphQL", "REST API", "Microservices"
    ],
    "business": [
        "Marketing", "Digital Marketing", "SEO", "SEM", "Content Writing",
        "Social Media Marketing", "Brand Management", "Market Research",
        "Business Development", "Sales", "Account Management", "CRM",
        "Financial Analysis", "Accounting", "Tally", "GST", "Excel",
        "PowerPoint", "Business Analysis", "Project Management", "Agile"
    ],
    "design": [
        "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop",
        "Illustrator", "InDesign", "After Effects", "Premiere Pro",
        "Graphic Design", "Motion Graphics", "3D Modeling", "Blender"
    ],
    "engineering": [
        "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
        "Electronics", "VLSI", "Embedded Systems", "IoT", "Robotics",
        "Control Systems", "CAD/CAM", "Manufacturing", "Quality Control"
    ],
    "healthcare": [
        "Medical Writing", "Clinical Research", "Pharmacovigilance",
        "Healthcare Management", "Medical Coding", "Biotechnology",
        "Bioinformatics", "Laboratory Skills"
    ]
}

INDIAN_CITIES = {
    "Mumbai": {"lat": 19.0760, "lon": 72.8777, "state": "Maharashtra"},
    "Delhi": {"lat": 28.6139, "lon": 77.2090, "state": "Delhi"},
    "Bangalore": {"lat": 12.9716, "lon": 77.5946, "state": "Karnataka"},
    "Hyderabad": {"lat": 17.3850, "lon": 78.4867, "state": "Telangana"},
    "Chennai": {"lat": 13.0827, "lon": 80.2707, "state": "Tamil Nadu"},
    "Kolkata": {"lat": 22.5726, "lon": 88.3639, "state": "West Bengal"},
    "Pune": {"lat": 18.5204, "lon": 73.8567, "state": "Maharashtra"},
    "Ahmedabad": {"lat": 23.0225, "lon": 72.5714, "state": "Gujarat"},
    "Jaipur": {"lat": 26.9124, "lon": 75.7873, "state": "Rajasthan"},
    "Lucknow": {"lat": 26.8467, "lon": 80.9462, "state": "Uttar Pradesh"},
    "Chandigarh": {"lat": 30.7333, "lon": 76.7794, "state": "Chandigarh"},
    "Gurgaon": {"lat": 28.4595, "lon": 77.0266, "state": "Haryana"},
    "Noida": {"lat": 28.5355, "lon": 77.3910, "state": "Uttar Pradesh"},
}

INDIAN_INSTITUTIONS = [
    "IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
    "BITS Pilani", "NIT Trichy", "NIT Warangal", "Delhi University",
    "VIT Vellore", "SRM University", "Manipal University", "Amity University",
    "IIIT Hyderabad", "Christ University", "Symbiosis", "NMIMS"
]

INDIAN_COMPANIES = {
    "tech_giants": ["Google India", "Microsoft India", "Amazon India", "Meta India", "IBM India"],
    "indian_it": ["TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra"],
    "startups": ["Flipkart", "Swiggy", "Zomato", "Paytm", "Razorpay", "Freshworks", "Zerodha"],
    "consulting": ["Deloitte India", "EY India", "PwC India", "KPMG India", "Accenture India"],
    "finance": ["Goldman Sachs India", "JP Morgan India", "HDFC Bank", "ICICI Bank"],
}


@dataclass
class SyntheticStudent:
    id: str
    name: str
    email: str
    phone: str
    location: str
    city: str
    state: str
    location_coordinates: Dict[str, Any]
    skills: List[Dict[str, str]]
    education: List[Dict[str, Any]]
    experience: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    career_objective: str
    preferred_locations: List[str]
    preferred_stipend_min: int
    preferred_stipend_max: int
    preferred_work_type: List[str]
    preferred_duration_months: List[int]
    primary_category: str
    created_at: str


@dataclass
class SyntheticInternship:
    id: str
    title: str
    company: str
    company_type: str
    description: str
    location: str
    city: str
    state: str
    location_coordinates: Dict[str, Any]
    work_type: str
    is_remote: bool
    stipend: int
    stipend_currency: str
    duration: str
    duration_months: int
    skills: List[str]
    requirements: List[str]
    responsibilities: List[str]
    category: str
    sector: str
    positions_available: int
    application_deadline: str
    start_date: str
    is_active: bool
    is_featured: bool
    created_at: str


@dataclass
class GroundTruthMatch:
    student_id: str
    internship_id: str
    match_quality: str
    match_score: float
    skill_overlap: float
    skill_overlap_count: int
    total_required_skills: int
    matching_skills: List[str]
    location_match: bool
    location_distance_category: str
    stipend_match: bool
    stipend_difference: int
    duration_match: bool
    work_type_match: bool
    category_match: bool
    match_reasons: List[str]
    detailed_explanation: str


class SyntheticDataGenerator:
    """Generate synthetic dataset for training and evaluation"""
    
    def __init__(self, seed: int = 42):
        random.seed(seed)
        np.random.seed(seed)
        
        self.skills_taxonomy = INDIAN_SKILLS_TAXONOMY
        self.cities = INDIAN_CITIES
        self.institutions = INDIAN_INSTITUTIONS
        self.companies = INDIAN_COMPANIES
        
        self.internship_titles = {
            "technology": [
                "{skill} Developer Intern", "{skill} Engineering Intern",
                "Software Development Intern", "Data Science Intern",
                "Machine Learning Intern", "Full Stack Developer Intern",
                "Backend Developer Intern", "Frontend Developer Intern"
            ],
            "business": [
                "Marketing Intern", "Digital Marketing Intern",
                "Business Development Intern", "Sales Intern",
                "Business Analyst Intern", "Product Management Intern"
            ],
            "design": [
                "UI/UX Design Intern", "Graphic Design Intern",
                "Product Design Intern", "Visual Design Intern"
            ],
            "engineering": [
                "Mechanical Engineering Intern", "Electronics Intern",
                "Embedded Systems Intern", "Civil Engineering Intern"
            ],
            "healthcare": [
                "Medical Writing Intern", "Clinical Research Intern",
                "Biotechnology Intern", "Healthcare Analytics Intern"
            ]
        }
        
        self.degrees = ["B.Tech", "B.E.", "B.Sc", "BCA", "B.Com", "BBA", "BA", "M.Tech", "MCA", "MBA"]
        
        self.fields_of_study = {
            "technology": ["Computer Science", "Information Technology", "Software Engineering", "Data Science"],
            "business": ["Business Administration", "Marketing", "Finance", "Commerce"],
            "design": ["Design", "Visual Communication", "Fine Arts"],
            "engineering": ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
            "healthcare": ["Biotechnology", "Pharmacy", "Life Sciences"]
        }
    
    def _get_random_city(self) -> Tuple[str, Dict]:
        city_name = random.choice(list(self.cities.keys()))
        return city_name, self.cities[city_name]
    
    def _get_random_company(self) -> Tuple[str, str]:
        company_type = random.choice(list(self.companies.keys()))
        company_name = random.choice(self.companies[company_type])
        return company_name, company_type
    
    def _get_skills_for_category(self, category: str, count: int = 5) -> List[str]:
        category_skills = self.skills_taxonomy.get(category, [])
        count = min(count, len(category_skills))
        return random.sample(category_skills, count)
    
    def generate_student(self, student_id: str = None, category: str = None) -> SyntheticStudent:
        if student_id is None:
            student_id = str(uuid.uuid4())
        
        if category is None:
            category = random.choice(list(self.skills_taxonomy.keys()))
        
        city_name, city_info = self._get_random_city()
        
        # Skills
        primary_skills = self._get_skills_for_category(category, random.randint(3, 5))
        other_category = random.choice([c for c in self.skills_taxonomy.keys() if c != category])
        secondary_skills = self._get_skills_for_category(other_category, random.randint(1, 2))
        all_skills = primary_skills + secondary_skills
        
        skills_with_levels = [
            {"name": skill, "level": random.choice(["Beginner", "Intermediate", "Advanced"])}
            for skill in all_skills
        ]
        
        # Education
        degree = random.choice(self.degrees[:7])
        field = random.choice(self.fields_of_study.get(category, ["General"]))
        institution = random.choice(self.institutions)
        current_year = datetime.now().year
        
        education = [{
            "id": 1,
            "institution": institution,
            "degree": degree,
            "field_of_study": field,
            "start_year": str(current_year - random.randint(1, 4)),
            "end_year": str(current_year + random.randint(0, 2)),
            "score": f"{random.uniform(6.5, 9.5):.2f} CGPA"
        }]
        
        # Experience
        experience = []
        if random.random() > 0.4:
            exp_company, _ = self._get_random_company()
            experience.append({
                "id": 1,
                "type": "Internship",
                "company": exp_company,
                "role": f"{all_skills[0]} Intern",
                "start_date": f"{current_year - 1}-06",
                "end_date": f"{current_year - 1}-08",
                "description": f"Worked on {all_skills[0]} projects"
            })
        
        # Projects
        projects = []
        for i in range(random.randint(1, 3)):
            proj_skills = random.sample(all_skills, min(2, len(all_skills)))
            projects.append({
                "id": i + 1,
                "title": f"{proj_skills[0]} Project",
                "role": "Developer",
                "technologies": ", ".join(proj_skills),
                "description": f"Built application using {proj_skills[0]}"
            })
        
        # Preferences
        preferred_locations = [city_name]
        if random.random() > 0.5:
            preferred_locations.append(random.choice(list(self.cities.keys())))
        if random.random() > 0.6:
            preferred_locations.append("Remote")
        
        # Names
        first_names = ["Aarav", "Aditi", "Arjun", "Ananya", "Vikram", "Priya", "Rohan", "Sneha", 
                       "Karan", "Ishita", "Rahul", "Meera", "Aditya", "Kavya", "Nikhil", "Riya"]
        last_names = ["Sharma", "Patel", "Kumar", "Singh", "Reddy", "Nair", "Gupta", "Verma"]
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        
        return SyntheticStudent(
            id=student_id,
            name=name,
            email=f"{name.lower().replace(' ', '.')}@email.com",
            phone=f"+91{random.randint(7000000000, 9999999999)}",
            location=f"{city_name}, {city_info['state']}",
            city=city_name,
            state=city_info['state'],
            location_coordinates={"type": "Point", "coordinates": [city_info['lon'], city_info['lat']]},
            skills=skills_with_levels,
            education=education,
            experience=experience,
            projects=projects,
            career_objective=f"Aspiring {category.title()} professional seeking internship opportunities in {', '.join(primary_skills[:2])}.",
            preferred_locations=preferred_locations,
            preferred_stipend_min=random.choice([5000, 8000, 10000, 15000]),
            preferred_stipend_max=random.choice([20000, 25000, 30000, 40000, 50000]),
            preferred_work_type=random.sample(["Remote", "WFO", "Hybrid"], random.randint(1, 3)),
            preferred_duration_months=random.sample([1, 2, 3, 6], random.randint(1, 3)),
            primary_category=category,
            created_at=datetime.now().isoformat()
        )
    
    def generate_internship(self, internship_id: str = None, category: str = None) -> SyntheticInternship:
        if internship_id is None:
            internship_id = str(uuid.uuid4())
        
        if category is None:
            category = random.choice(list(self.skills_taxonomy.keys()))
        
        company_name, company_type = self._get_random_company()
        city_name, city_info = self._get_random_city()
        
        work_type = random.choice(["Remote", "WFO", "Hybrid"])
        required_skills = self._get_skills_for_category(category, random.randint(3, 5))
        
        title_template = random.choice(self.internship_titles.get(category, ["{skill} Intern"]))
        title = title_template.format(skill=required_skills[0] if required_skills else category.title())
        
        duration_months = random.choice([1, 2, 3, 6])
        
        base_stipend = {"tech_giants": 50000, "consulting": 40000, "indian_it": 15000, 
                        "startups": 20000, "finance": 35000}.get(company_type, 15000)
        stipend = int(base_stipend * random.uniform(0.5, 1.5))
        stipend = (stipend // 1000) * 1000
        
        start_date = datetime.now() + timedelta(days=random.randint(15, 60))
        
        return SyntheticInternship(
            id=internship_id,
            title=title,
            company=company_name,
            company_type=company_type,
            description=f"Looking for {title} to join our team. Work on {', '.join(required_skills[:2])} projects.",
            location=f"{city_name}, {city_info['state']}",
            city=city_name,
            state=city_info['state'],
            location_coordinates={"type": "Point", "coordinates": [city_info['lon'], city_info['lat']]},
            work_type=work_type,
            is_remote=work_type in ["Remote", "Hybrid"],
            stipend=stipend,
            stipend_currency="INR",
            duration=f"{duration_months} {'month' if duration_months == 1 else 'months'}",
            duration_months=duration_months,
            skills=required_skills,
            requirements=[f"Knowledge of {', '.join(required_skills[:2])}", "Good communication skills"],
            responsibilities=[f"Work on {category} projects", "Collaborate with team"],
            category=category.title(),
            sector=category,
            positions_available=random.randint(1, 5),
            application_deadline=(start_date - timedelta(days=7)).isoformat(),
            start_date=start_date.isoformat(),
            is_active=True,
            is_featured=random.random() > 0.8,
            created_at=datetime.now().isoformat()
        )
    
    def calculate_match_score(self, student: SyntheticStudent, internship: SyntheticInternship) -> GroundTruthMatch:
        """Calculate ground truth match score with detailed explanation"""
        
        # Skill analysis
        student_skills = set(s['name'].lower() for s in student.skills)
        internship_skills = set(s.lower() for s in internship.skills)
        matching_skills = student_skills.intersection(internship_skills)
        
        skill_overlap = len(matching_skills) / len(internship_skills) if internship_skills else 0
        
        # Location analysis
        same_city = student.city == internship.city
        is_remote = internship.work_type in ["Remote", "Hybrid"]
        preferred_location = internship.city in student.preferred_locations
        location_match = same_city or is_remote or preferred_location
        
        if same_city:
            location_category = "same_city"
        elif is_remote:
            location_category = "remote"
        elif student.state == internship.state:
            location_category = "same_state"
        else:
            location_category = "different"
        
        # Other matches
        stipend_match = student.preferred_stipend_min <= internship.stipend <= student.preferred_stipend_max
        duration_match = internship.duration_months in student.preferred_duration_months
        work_type_match = internship.work_type in student.preferred_work_type
        category_match = student.primary_category.lower() == internship.sector.lower()
        
        # Calculate weighted score
        weights = {'skill': 0.35, 'category': 0.15, 'location': 0.20, 'stipend': 0.15, 'duration': 0.08, 'work_type': 0.07}
        
        match_score = (
            skill_overlap * weights['skill'] +
            (1.0 if category_match else 0.3) * weights['category'] +
            (1.0 if location_match else 0.2) * weights['location'] +
            (1.0 if stipend_match else 0.3) * weights['stipend'] +
            (1.0 if duration_match else 0.5) * weights['duration'] +
            (1.0 if work_type_match else 0.5) * weights['work_type']
        )
        
        # Determine quality
        if match_score >= 0.85:
            quality = MatchQuality.EXCELLENT
        elif match_score >= 0.70:
            quality = MatchQuality.GOOD
        elif match_score >= 0.50:
            quality = MatchQuality.MODERATE
        elif match_score >= 0.30:
            quality = MatchQuality.POOR
        else:
            quality = MatchQuality.IRRELEVANT
        
        # Generate reasons
        match_reasons = []
        if skill_overlap > 0.5:
            match_reasons.append(f"Strong skill match ({len(matching_skills)}/{len(internship_skills)})")
        if category_match:
            match_reasons.append(f"Domain expertise in {internship.sector}")
        if same_city:
            match_reasons.append(f"Same city ({internship.city})")
        elif is_remote:
            match_reasons.append("Remote work available")
        if stipend_match:
            match_reasons.append(f"Stipend within range")
        if duration_match:
            match_reasons.append(f"Duration matches preference")
        
        # Detailed explanation
        explanation = (
            f"This match is {quality.value} ({match_score*100:.0f}%). "
            f"You have {len(matching_skills)}/{len(internship_skills)} required skills. "
            f"Location: {location_category.replace('_', ' ')}. "
            f"Stipend: ₹{internship.stipend:,}/month ({'within' if stipend_match else 'outside'} your range). "
        )
        
        return GroundTruthMatch(
            student_id=student.id,
            internship_id=internship.id,
            match_quality=quality.value,
            match_score=round(match_score, 4),
            skill_overlap=round(skill_overlap, 4),
            skill_overlap_count=len(matching_skills),
            total_required_skills=len(internship_skills),
            matching_skills=list(matching_skills),
            location_match=location_match,
            location_distance_category=location_category,
            stipend_match=stipend_match,
            stipend_difference=internship.stipend - student.preferred_stipend_min,
            duration_match=duration_match,
            work_type_match=work_type_match,
            category_match=category_match,
            match_reasons=match_reasons[:5],
            detailed_explanation=explanation
        )
    
    def generate_dataset(self, num_students: int = 500, num_internships: int = 200) -> Dict[str, Any]:
        """Generate complete synthetic dataset"""
        logger.info(f"Generating {num_students} students and {num_internships} internships...")
        
        students = []
        internships = []
        ground_truth_matches = []
        
        categories = list(self.skills_taxonomy.keys())
        category_weights = [0.40, 0.25, 0.15, 0.15, 0.05]
        
        # Generate students
        for i in range(num_students):
            category = random.choices(categories, weights=category_weights)[0]
            student = self.generate_student(category=category)
            students.append(asdict(student))
            if (i + 1) % 100 == 0:
                logger.info(f"Generated {i + 1} students...")
        
        # Generate internships
        for i in range(num_internships):
            category = random.choices(categories, weights=category_weights)[0]
            internship = self.generate_internship(category=category)
            internships.append(asdict(internship))
            if (i + 1) % 50 == 0:
                logger.info(f"Generated {i + 1} internships...")
        
        # Calculate ground truth matches
        logger.info("Calculating ground truth matches...")
        for idx, student_dict in enumerate(students):
            student = SyntheticStudent(**student_dict)
            for internship_dict in internships:
                internship = SyntheticInternship(**internship_dict)
                match = self.calculate_match_score(student, internship)
                if match.match_score >= 0.2:
                    ground_truth_matches.append(asdict(match))
            if (idx + 1) % 100 == 0:
                logger.info(f"Processed matches for {idx + 1} students...")
        
        logger.info(f"Generated {len(ground_truth_matches)} ground truth matches")
        
        # Train/test split
        random.shuffle(students)
        random.shuffle(internships)
        
        split = 0.8
        train_students = students[:int(len(students) * split)]
        test_students = students[int(len(students) * split):]
        train_internships = internships[:int(len(internships) * split)]
        test_internships = internships[int(len(internships) * split):]
        
        train_ids = set(s['id'] for s in train_students) | set(i['id'] for i in train_internships)
        train_matches = [m for m in ground_truth_matches if m['student_id'] in train_ids and m['internship_id'] in train_ids]
        test_matches = [m for m in ground_truth_matches if m not in train_matches]
        
        return {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "num_students": num_students,
                "num_internships": num_internships,
                "num_matches": len(ground_truth_matches),
                "train_split": split
            },
            "train": {"students": train_students, "internships": train_internships, "matches": train_matches},
            "test": {"students": test_students, "internships": test_internships, "matches": test_matches},
            "full": {"students": students, "internships": internships, "matches": ground_truth_matches}
        }
    
    def save_dataset(self, dataset: Dict[str, Any], output_dir: Path = OUTPUT_DIR):
        """Save dataset to files"""
        logger.info(f"Saving dataset to {output_dir}")
        
        with open(output_dir / "dataset_full.json", "w") as f:
            json.dump(dataset, f, indent=2, default=str)
        
        for split in ["train", "test"]:
            split_dir = output_dir / split
            split_dir.mkdir(exist_ok=True)
            
            with open(split_dir / "students.json", "w") as f:
                json.dump(dataset[split]["students"], f, indent=2)
            with open(split_dir / "internships.json", "w") as f:
                json.dump(dataset[split]["internships"], f, indent=2)
            with open(split_dir / "matches.json", "w") as f:
                json.dump(dataset[split]["matches"], f, indent=2)
        
        with open(output_dir / "metadata.json", "w") as f:
            json.dump(dataset["metadata"], f, indent=2)
        
        # Print statistics
        print("\n" + "="*60)
        print("DATASET STATISTICS")
        print("="*60)
        print(f"Output Directory: {output_dir}")
        print(f"Total Students: {dataset['metadata']['num_students']}")
        print(f"Total Internships: {dataset['metadata']['num_internships']}")
        print(f"Total Matches: {dataset['metadata']['num_matches']}")
        print(f"\nTrain: {len(dataset['train']['students'])} students, {len(dataset['train']['internships'])} internships")
        print(f"Test: {len(dataset['test']['students'])} students, {len(dataset['test']['internships'])} internships")
        
        qualities = [m['match_quality'] for m in dataset['full']['matches']]
        print(f"\nMatch Quality Distribution:")
        for q in MatchQuality:
            count = qualities.count(q.value)
            print(f"  {q.value}: {count} ({count/len(qualities)*100:.1f}%)")


def main():
    print("="*60)
    print("YUVA SETU - SYNTHETIC DATA GENERATOR")
    print("="*60)
    
    generator = SyntheticDataGenerator(seed=42)
    dataset = generator.generate_dataset(num_students=500, num_internships=200)
    generator.save_dataset(dataset)
    
    print(f"\n✅ Dataset generation complete!")
    print(f"Files saved to: {OUTPUT_DIR.absolute()}")


if __name__ == "__main__":
    main()