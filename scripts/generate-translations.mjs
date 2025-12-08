import { readFile, writeFile } from "node:fs/promises";

const base = {
  "common.selectLanguage": "Select language",
  "hero.badge": "Government of India Initiative",
  "hero.titlePrefix": "PM Internship —",
  "hero.titleHighlight": "Learn. Contribute. Lead.",
  "hero.description":
    "Find recommended internships from top companies and government projects. Apply, track and build your professional future.",
  "hero.primaryCta": "Get Started",
  "hero.secondaryCta": "Explore Opportunities",
  "hero.quotePrimary": "One step — towards progress",
  "hero.quoteSecondary": "Together we shape the nation's future",
  "sections.heading": "Available Sections",
  "sections.subheading": "Explore internship opportunities across diverse sectors",
  "sections.openPositions": "{{count}} Open Positions",
  "sections.applyNow": "Apply Now",
  "sections.modalTitleSuffix": "Internships",
  "sections.sector.technology": "Technology",
  "sections.sector.technology.desc":
    "Software development, AI/ML, Data Science, Cybersecurity",
  "sections.sector.publicPolicy": "Public Policy",
  "sections.sector.publicPolicy.desc":
    "Government programs, Policy research, Administration",
  "sections.sector.healthcare": "Healthcare",
  "sections.sector.healthcare.desc":
    "Medical research, Healthcare management, Public health",
  "sections.sector.environment": "Environment",
  "sections.sector.environment.desc":
    "Climate action, Sustainability, Conservation",
  "sections.sector.finance": "Finance",
  "sections.sector.finance.desc":
    "Banking, Investment, Financial analysis, FinTech",
  "sections.sector.education": "Education",
  "sections.sector.education.desc":
    "EdTech, Curriculum development, Teaching",
  "sections.sector.research": "Research",
  "sections.sector.research.desc":
    "Scientific research, Innovation, R&D projects",
  "sections.sector.media": "Media",
  "sections.sector.media.desc":
    "Journalism, Content creation, Digital media",
  "sections.mock.fullStack.title": "Full Stack Developer Intern",
  "sections.mock.fullStack.company": "Tech Innovations Ltd",
  "sections.mock.fullStack.location": "Bangalore",
  "sections.mock.fullStack.duration": "6 months",
  "sections.mock.fullStack.stipend": "₹25,000 / month",
  "sections.mock.fullStack.type": "Full-time",
  "sections.mock.dataScience.title": "Data Science Intern",
  "sections.mock.dataScience.company": "Analytics Pro",
  "sections.mock.dataScience.location": "Mumbai",
  "sections.mock.dataScience.duration": "3 months",
  "sections.mock.dataScience.stipend": "₹20,000 / month",
  "sections.mock.dataScience.type": "Part-time",
  "sections.mock.uiux.title": "UI/UX Design Intern",
  "sections.mock.uiux.company": "Creative Studios",
  "sections.mock.uiux.location": "Delhi",
  "sections.mock.uiux.duration": "4 months",
  "sections.mock.uiux.stipend": "₹18,000 / month",
  "sections.mock.uiux.type": "Hybrid",
  "navbar.home": "Home",
  "navbar.about": "About Us",
  "navbar.dashboard": "Dashboard",
  "navbar.social": "Social",
  "navbar.editProfile": "Edit Profile",
  "navbar.settings": "Settings",
  "navbar.logout": "Log out",
  "navbar.howToUse": "How to Use",
  "navbar.videoGuide": "Video Guide",
  "navbar.guidelines": "Guidelines",
  "navbar.platformGuidelines": "Platform Guidelines",
  "navbar.support": "Support",
  "navbar.contact": "Contact: +91 7498398230",
  "navbar.raiseRequest": "Raise Request",
  "navbar.trackRequest": "Track Request",
  "navbar.login": "Login",
  "navbar.signup": "Signup",
  "navbar.welcome": "Welcome back, {{name}}!",
  "social.youtube": "YouTube",
  "social.google": "Google",
  "social.telegram": "Telegram",
  "social.instagram": "Instagram",
  "social.linkedin": "LinkedIn",
  "social.website": "Website",
  "social.twitter": "Twitter",
  "social.facebook": "Facebook",
  "about.title": "About PM Internship",
  "about.body1":
    "The PM Internship Scheme is a flagship initiative by the Government of India to provide meaningful internship opportunities to young professionals across the nation. Our platform connects talented individuals with top companies and government projects.",
  "about.body2":
    "We aim to bridge the gap between education and employment by offering hands-on experience in various sectors including Technology, Healthcare, Finance, Public Policy, and more.",
  "about.body3":
    "Through this platform, interns gain valuable skills, build professional networks, and contribute to nation-building initiatives. We partner with leading companies to ensure quality internship experiences.",
  "about.stats.interns": "Active Interns",
  "about.stats.companies": "Partner Companies",
  "about.readMore": "Read More",
  "about.readLess": "Read Less",
  "about.events.title": "Event Record",
  "about.events.launch.title": "PM Internship Launch Event",
  "about.events.launch.description":
    "Official launch of the PM Internship program with industry leaders and government officials.",
  "about.events.fair.title": "Career Fair 2024",
  "about.events.fair.description":
    "Connect with top employers and explore internship opportunities across sectors.",
  "about.events.workshop.title": "Skill Development Workshop",
  "about.events.workshop.description":
    "Learn essential skills for modern workplace success and career growth.",
  "about.events.industry.title": "Industry Connect Session",
  "about.events.industry.description":
    "Interactive session with industry experts sharing insights and career guidance.",
  "about.events.viewDetails": "View Full Details",
  "gallery.heading": "Our Journey & Community",
  "gallery.subheading":
    "Explore our social presence, events, success stories, and the partners who make it all possible",
  "gallery.cards.social": "Social Media",
  "gallery.cards.events": "Event Gallery",
  "gallery.cards.testimonials": "Testimonials & Sponsors",
  "gallery.social.new.caption": "New internship opportunities announced!",
  "gallery.social.star.caption": "Meet our star interns of the month",
  "gallery.social.tips.caption": "Career tips for aspiring professionals",
  "gallery.social.bts.caption": "Behind the scenes at PM Internship",
  "gallery.events.launch.title": "Launch Event 2024",
  "gallery.events.launch.description": "Grand inauguration ceremony",
  "gallery.events.workshop.title": "Workshop Series",
  "gallery.events.workshop.description": "Skill development sessions",
  "gallery.events.report.title": "Annual Report",
  "gallery.events.report.description": "Year in review highlights",
  "gallery.events.success.title": "Success Stories",
  "gallery.events.success.description": "Inspiring intern journeys",
  "gallery.testimonials.priya.quote":
    "Life-changing experience! The PM Internship gave me real-world exposure and mentorship.",
  "gallery.testimonials.priya.role": "Tech Intern",
  "gallery.testimonials.rahul.quote":
    "Gained invaluable insights into governance and policy-making at the highest level.",
  "gallery.testimonials.rahul.role": "Policy Intern",
  "gallery.testimonials.ananya.quote":
    "Perfect career launchpad with exposure to financial operations and strategic planning.",
  "gallery.testimonials.ananya.role": "Finance Intern",
  "gallery.sponsors.heading": "Our Sponsors",
  "gallery.sponsors.deloitte": "Global consulting leader",
  "gallery.sponsors.infosys": "IT services pioneer",
  "gallery.sponsors.tcs": "Technology solutions",
  "gallery.sponsors.amazon": "E-commerce giant",
  "gallery.sponsors.flipkart": "India's marketplace",
  "gallery.sponsors.accenture": "Professional services",
  "marquee.heading": "Trusted by Leading Companies",
  "footer.brand.title": "PM INTERNSHIP",
  "footer.brand.hindi": "भारत सरकार की पहल",
  "footer.brand.tagline": "Government of India Initiative",
  "footer.quickLinks.title": "Quick Links",
  "footer.quickLinks.home": "Home",
  "footer.quickLinks.about": "About Us",
  "footer.quickLinks.opportunities": "Opportunities",
  "footer.quickLinks.login": "Login",
  "footer.resources.title": "Resources",
  "footer.resources.guidelines": "Guidelines",
  "footer.resources.faqs": "FAQs",
  "footer.resources.privacy": "Privacy Policy",
  "footer.resources.terms": "Terms & Conditions",
  "footer.contact.title": "Contact Us",
  "footer.contact.phone": "+91 7498398230",
  "footer.contact.email": "support@pminternship.gov.in",
  "footer.contact.address": "New Delhi, India",
  "footer.copy": "© 2024 PM Internship Platform. All rights reserved. | Government of India",
  "map.loading.title": "Loading Real-Time Data...",
  "map.loading.subtitle": "Connecting to MongoDB database",
  "map.error.title": "Backend Connection Error",
  "map.error.description": "Cannot connect to backend. Please ensure the backend server is running.",
  "map.error.cta": "Retry Connection",
  "map.banner.title": "Database is Empty",
  "map.banner.description": "The map will automatically update when employers add internships to the database.",
  "map.summary.heading": "India Internship Overview",
  "map.summary.live": "LIVE DATA from MongoDB",
  "map.summary.lastUpdated": "Last updated:",
  "map.summary.refresh": "Refresh Now",
  "map.summary.refreshing": "Refreshing...",
  "map.summary.cards.totalCompanies": "Total Companies",
  "map.summary.cards.totalInternships": "Total Internships",
  "map.summary.cards.activeInternships": "Active Internships",
  "map.summary.cards.closedInternships": "Closed Internships",
  "map.summary.cards.pmInternships": "PM Internships",
  "map.summary.cards.totalApplications": "Total Applications",
  "map.summary.cards.studentsHired": "Students Hired",
  "map.section.title": "Dynamic India Internship Map",
  "map.section.instructions": "Hover over any state to view detailed statistics • Auto-updates every 30 seconds",
  "map.panel.selectedState": "Selected State",
  "map.panel.labels.companies": "Companies providing internships",
  "map.panel.labels.hired": "Hired internships",
  "map.panel.labels.pm": "PM internships",
  "map.panel.labels.active": "Active internships",
  "map.panel.labels.students": "Students hired",
  "map.panel.quote": "\"Expert in anything, was once a beginner\"",
  "dashboard.loading": "Loading your dashboard...",
  "dashboard.backHome": "Back to Home",
  "dashboard.welcome": "Welcome back, {{name}}!",
  "dashboard.subtitle": "Manage your profile and track your career progress",
  "dashboard.editProfile": "Edit Profile",
  "dashboard.downloadResume": "Download Resume",
  "dashboard.resume.comingSoon.title": "Coming Soon",
  "dashboard.resume.comingSoon.description": "Resume download feature will be available soon!",
  "dashboard.profileIncomplete.title": "Complete Your Profile",
  "dashboard.profileIncomplete.body": "Add more information to make your profile stand out to employers",
  "dashboard.profileIncomplete.cta": "Complete Now",
  "dashboard.recommendations.title": "Recommended Internships",
  "dashboard.recommendations.subtitle": "Personalized matches based on your profile and preferences",
  "dashboard.recommendations.loading": "Fetching recommendations for you...",
  "dashboard.recommendations.error": "Unable to load recommendations right now.",
  "dashboard.recommendations.retry": "Try Again",
  "dashboard.recommendations.empty": "No recommendations yet. Complete your profile to help us match you better.",
  "dashboard.recommendations.applied": "Applied",
  "dashboard.recommendations.remote": "Remote",
  "dashboard.recommendations.flexible": "Flexible",
  "dashboard.recommendations.durationTbd": "Duration TBD",
  "dashboard.recommendations.stipendUnknown": "Stipend not disclosed",
  "dashboard.recommendations.matchScore": "Match Score",
  "dashboard.recommendations.skills": "Skills",
  "dashboard.recommendations.location": "Location",
  "dashboard.recommendations.stipend": "Stipend",
  "dashboard.recommendations.timeline": "Timeline",
  "dashboard.recommendations.moreSkills": "• more",
  "dashboard.recommendations.apply": "Apply Now",
  "dashboard.profileNotFound.title": "Profile Not Found",
  "dashboard.profileNotFound.description": "Unable to load your profile data",
  "dashboard.profileNotFound.cta": "Complete Your Profile",
  "dashboard.authRequired.title": "Authentication Required",
  "dashboard.authRequired.description": "Please login to view your dashboard",
  "dashboard.error.title": "Error",
  "dashboard.error.profileLoad": "Failed to load profile data",
  "dashboard.error.toastDescription": "Something went wrong. Please try again.",
  "dashboard.toast.logout": "You have been logged out.",
  "dashboard.notProvided": "Not provided",
  "dashboard.tabs.overview": "Overview",
  "dashboard.tabs.education": "Education",
  "dashboard.tabs.experience": "Experience",
  "dashboard.tabs.skills": "Skills",
  "dashboard.tabs.projects": "Projects",
  "dashboard.tabs.achievements": "Achievements",
  "dashboard.tabs.contact": "Contact",
  "dashboard.personalInfo.title": "Personal Information",
  "dashboard.personalInfo.fullName": "Full Name",
  "dashboard.personalInfo.email": "Email",
  "dashboard.personalInfo.phone": "Phone",
  "dashboard.personalInfo.address": "Address",
  "dashboard.personalInfo.dob": "Date of Birth",
  "dashboard.personalInfo.gender": "Gender",
  "dashboard.careerObjective.title": "Career Objective",
  "dashboard.stats.education": "Education",
  "dashboard.stats.experience": "Experience",
  "dashboard.stats.skills": "Skills",
  "dashboard.stats.projects": "Projects",
  "dashboard.education.title": "Education History",
  "dashboard.education.description": "Your academic background and qualifications",
  "dashboard.education.empty": "No education records added yet",
  "dashboard.education.add": "Add Education",
  "dashboard.experience.title": "Work Experience",
  "dashboard.experience.description": "Your professional journey and internships",
  "dashboard.experience.empty": "No work experience added yet",
  "dashboard.experience.add": "Add Experience",
  "dashboard.trainings.title": "Trainings & Certifications",
  "dashboard.trainings.viewCertificate": "View Certificate →",
  "dashboard.skills.title": "Technical Skills",
  "dashboard.skills.description": "Your technical abilities and proficiency levels",
  "dashboard.skills.empty": "No skills added yet",
  "dashboard.skills.add": "Add Skills",
  "dashboard.skills.level.advanced": "Advanced",
  "dashboard.skills.level.intermediate": "Intermediate",
  "dashboard.skills.level.beginner": "Beginner",
  "dashboard.skills.languages": "Languages",
  "dashboard.projects.title": "Projects",
  "dashboard.projects.description": "Your notable projects and contributions",
  "dashboard.projects.empty": "No projects added yet",
  "dashboard.projects.add": "Add Projects",
  "dashboard.projects.portfolio": "Portfolio",
  "dashboard.projects.role": "Role: {{role}}",
  "dashboard.projects.viewProject": "View Project →",
  "dashboard.achievements.title": "Accomplishments & Awards",
  "dashboard.achievements.description": "Your achievements and recognitions",
  "dashboard.achievements.empty": "No accomplishments added yet",
  "dashboard.achievements.add": "Add Accomplishments",
  "dashboard.contact.title": "Contact Information",
  "dashboard.contact.description": "How employers can reach you",
  "dashboard.contact.email": "Email",
  "dashboard.contact.phone": "Phone",
  "dashboard.contact.address": "Address",
  "dashboard.contact.linkedin": "LinkedIn",
  "dashboard.contact.viewProfile": "View Profile",
};

const languageMap = {
  as: "as",
  bn: "bn",
  brx: "brx",
  doi: "doi",
  gu: "gu",
  hi: "hi",
  kn: "kn",
  ks: "ks",
  kok: "gom", // Konkani (Goan)
  mai: "mai",
  ml: "ml",
  mni: "mni-Mtei",
  mr: "mr",
  ne: "ne",
  or: "or",
  pa: "pa",
  sa: "sa",
  sat: "sat",
  sd: "sd",
  ta: "ta",
  te: "te",
  ur: "ur",
  en: "en",
};

const requestedLanguages = process.env.LANGS
  ? process.env.LANGS.split(",")
      .map((code) => code.trim())
      .filter(Boolean)
  : null;

const languagesToProcess = requestedLanguages ?? Object.keys(languageMap);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tokenizePlaceholders = (value) => {
  const tokens = new Map();
  let tokenized = value;

  tokenized = tokenized.replace(/{{(.*?)}}/g, (_, key) => {
    const token = `__${key.toUpperCase()}__`;
    tokens.set(token, `{{${key}}}`);
    return token;
  });

  return { tokenized, tokens };
};

const restorePlaceholders = (value, tokens) => {
  let restored = value;
  for (const [token, original] of tokens.entries()) {
    restored = restored.replaceAll(token, original);
  }
  return restored;
};

const translateText = async (text, target) => {
  if (target === "en") return text;

  const { tokenized, tokens } = tokenizePlaceholders(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
    target,
  )}&dt=t&q=${encodeURIComponent(tokenized)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation failed for ${target}: ${response.status}`);
  }

  const data = await response.json();
  const translated = Array.isArray(data)
    ? data[0].map((segment) => segment[0]).join("")
    : tokenized;

  return restorePlaceholders(translated, tokens);
};

const translationsFileUrl = new URL("../frontend/student/src/i18n/locale-translations.json", import.meta.url);

const loadExistingTranslations = async () => {
  try {
    const raw = await readFile(translationsFileUrl, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const generateTranslations = async () => {
  const existing = await loadExistingTranslations();
  const output = { ...existing };

  for (const [language, googleCode] of Object.entries(languageMap)) {
    if (!languagesToProcess.includes(language)) {
      if (!output[language]) {
        output[language] = base;
      }
      continue;
    }
    if (language === "en") {
      output[language] = base;
      continue;
    }
    output[language] = {};

    for (const [key, text] of Object.entries(base)) {
      try {
        const translated = await translateText(text, googleCode);
        output[language][key] = translated;
      } catch (error) {
        console.warn(`⚠️  Falling back to English for ${language} -> ${key}: ${error.message}`);
        output[language][key] = text;
      }
      await delay(100);
    }
  }

  const finalOutput = Object.fromEntries(
    Object.keys(languageMap).map((language) => [language, output[language] ?? base]),
  );

  await writeFile(translationsFileUrl, JSON.stringify(finalOutput, null, 2), "utf8");
};

generateTranslations().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

