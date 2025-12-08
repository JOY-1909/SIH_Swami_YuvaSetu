import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  signInWithPhoneNumber, 
  ConfirmationResult,
  RecaptchaVerifier 
} from "firebase/auth";
import { auth } from "@/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, MapPin, Download, Home } from "lucide-react";
import { API_BASE_URL, apiService } from "@/services/api";

// ---------- Types ----------
interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  score: string;
}

interface ExperienceItem {
  id: number;
  type: "Internship";
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface TrainingItem {
  id: number;
  title: string;
  provider: string;
  duration: string;
  description: string;
  credentialLink: string;
}

interface ProjectItem {
  id: number;
  title: string;
  role: string;
  technologies: string;
  description: string;
}

interface SkillItem {
  id: number;
  name: string;
  level: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  link: string;
  description: string;
}

interface AccomplishmentItem {
  id: number;
  title: string;
  description: string;
  credentialUrl: string;
}

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  phoneOtp: string;
  phoneOtpVerified: boolean;
  dateOfBirth: string;
  gender: string;
  address: string;
  location: Location | null;
  languages: string;
  linkedin: string;
  careerObjective: string;

  education: EducationItem[];
  experience: ExperienceItem[];
  trainings: TrainingItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  portfolio: PortfolioItem[];
  accomplishments: AccomplishmentItem[];
}

// ---------- Constants ----------
const defaultLanguages = [
  "English", "Hindi", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu"
];

const defaultSkills = [
  "React", "JavaScript", "TypeScript", "Node.js", "Python", "Django", 
  "HTML", "CSS", "Git", "Communication"
];

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced"];
// Updated yearOptions for education (2000 to 2030)
const yearOptions = Array.from({ length: 31 }, (_, i) => `${2000 + i}`); // 2000 to 2030
// Year options for experience (2010 to 2030)
const experienceYearOptions = Array.from({ length: 21 }, (_, i) => `${2010 + i}`); // 2010 to 2030

// Fixed MapComponent with proper cleanup - UPDATED TO SQUARE SHAPE
const MapComponent: React.FC<{
  location: Location | null;
  onLocationSelect: (location: Location) => void;
}> = ({ location, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{display_name: string; lat: string; lon: string; place_id: number}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { toast } = useToast();

  // Create refs for callback functions to avoid dependency issues
  const onLocationSelectRef = useRef(onLocationSelect);
  const locationRef = useRef(location);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
    locationRef.current = location;
  }, [onLocationSelect, location]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Search failed",
        description: "Could not search for location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = async (result: {display_name: string; lat: string; lon: string}) => {
    const { lat, lon, display_name } = result;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (mapInstanceRef.current) {
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      const L = await import('leaflet');
      const newMarker = L.marker([latitude, longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup(display_name)
        .openPopup();

      markerRef.current = newMarker;
      mapInstanceRef.current.setView([latitude, longitude], 13);

      onLocationSelectRef.current({
        address: display_name,
        latitude,
        longitude
      });

      setSearchResults([]);
      setSearchQuery(display_name);
    }
  };

  // Initialize map only once
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const initializeMap = async () => {
        const L = await import('leaflet');
        
        // Fix for Leaflet markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const map = L.map(mapRef.current!).setView([20.5937, 78.9629], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsMapLoaded(true);

        // Click handler
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

            if (markerRef.current) {
              map.removeLayer(markerRef.current);
            }

            const newMarker = L.marker([lat, lng])
              .addTo(map)
              .bindPopup(address)
              .openPopup();

            markerRef.current = newMarker;
            onLocationSelectRef.current({
              address,
              latitude: lat,
              longitude: lng
            });
            setSearchQuery(address);
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            const newMarker = L.marker([lat, lng])
              .addTo(map)
              .bindPopup(address)
              .openPopup();

            markerRef.current = newMarker;
            onLocationSelectRef.current({
              address,
              latitude: lat,
              longitude: lng
            });
            setSearchQuery(address);
          }
        });

        // Set initial marker
        const currentLocation = locationRef.current;
        if (currentLocation) {
          const initialMarker = L.marker([currentLocation.latitude, currentLocation.longitude])
            .addTo(map)
            .bindPopup(currentLocation.address)
            .openPopup();
          markerRef.current = initialMarker;
          map.setView([currentLocation.latitude, currentLocation.longitude], 13);
          setSearchQuery(currentLocation.address);
        }
      };

      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker when location changes
  useEffect(() => {
    if (isMapLoaded && location && mapInstanceRef.current) {
      const updateMarker = async () => {
        const L = await import('leaflet');
        
        if (markerRef.current) {
          mapInstanceRef.current!.removeLayer(markerRef.current);
        }

        const newMarker = L.marker([location.latitude, location.longitude])
          .addTo(mapInstanceRef.current!)
          .bindPopup(location.address)
          .openPopup();

        markerRef.current = newMarker;
        mapInstanceRef.current!.setView([location.latitude, location.longitude], 13);
        setSearchQuery(location.address);
      };

      updateMarker();
    }
  }, [location, isMapLoaded]);

  return (
    <div className="space-y-2">
      <Label>Search and select your location</Label>
      
      <div className="flex gap-2">
        <Input
          placeholder="Search for a place, address, or landmark..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-md max-h-40 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSelectResult(result)}
            >
              <div className="text-sm font-medium">{result.display_name}</div>
            </div>
          ))}
        </div>
      )}

      {/* SMALL SQUARE MAP BOX - FIXED SIZE */}
      <div className="flex justify-center">
        <div className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm w-64 h-64">
          <div 
            ref={mapRef} 
            className="w-full h-full rounded-md"
          />
        </div>
      </div>
      
      {location && (
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Selected: {location.address}
        </p>
      )}
    </div>
  );
};

// Helper function to normalize profile data from dashboard format to form format
// In MultiStepForm.tsx
const normalizeProfileData = (profile: any): FormData => {
  console.log("Normalizing profile:", profile);
  
  // Handle full_name split into first and last name
  let firstName = profile.firstName || profile.first_name || "";
  let lastName = profile.lastName || profile.last_name || "";
  
  if (!firstName && !lastName && profile.full_name) {
    const nameParts = profile.full_name.trim().split(/\s+/);
    firstName = nameParts[0] || "";
    lastName = nameParts.slice(1).join(" ") || "";
  }
  
  return {
    firstName,
    lastName,
    phone: profile.phone || profile.contact_number || "",
    phoneOtp: "",
    phoneOtpVerified: profile.phone_verified || false,
    dateOfBirth: profile.dateOfBirth || profile.date_of_birth || "",
    gender: profile.gender || "",
    address: profile.address || "",
    location: profile.location || (profile.location_query ? {
      address: profile.location_query,
      latitude: 0,
      longitude: 0
    } : null),
    languages: profile.languages || "",
    linkedin: profile.linkedin || "",
    careerObjective: profile.careerObjective || profile.career_objective || "",
    
    education: Array.isArray(profile.education) ? profile.education.map((edu: any, index: number) => ({
      id: edu.id || index + 1,
      institution: edu.institution || "",
      degree: edu.degree || "",
      fieldOfStudy: edu.fieldOfStudy || edu.field_of_study || "",
      startYear: edu.startYear || edu.start_year || "",
      endYear: edu.endYear || edu.end_year || "",
      score: edu.score || "",
    })) : [{
      id: 1,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      score: "",
    }],
    
    experience: Array.isArray(profile.experience) ? profile.experience.map((exp: any, index: number) => ({
      id: exp.id || index + 1,
      type: exp.type || "Internship",
      company: exp.company || "",
      role: exp.role || "",
      startDate: exp.startDate || exp.start_date || "",
      endDate: exp.endDate || exp.end_date || "",
      description: exp.description || "",
    })) : [],
    
    trainings: Array.isArray(profile.trainings) ? profile.trainings.map((training: any, index: number) => ({
      id: training.id || index + 1,
      title: training.title || "",
      provider: training.provider || "",
      duration: training.duration || "",
      description: training.description || "",
      credentialLink: training.credentialLink || training.credential_link || "",
    })) : [],
    
    projects: Array.isArray(profile.projects) ? profile.projects.map((project: any, index: number) => ({
      id: project.id || index + 1,
      title: project.title || "",
      role: project.role || "",
      technologies: project.technologies || "",
      description: project.description || "",
    })) : [],
    
    skills: Array.isArray(profile.skills) ? profile.skills.map((skill: any, index: number) => ({
      id: skill.id || index + 1,
      name: skill.name || "",
      level: skill.level || "Intermediate",
    })) : [],
    
    portfolio: Array.isArray(profile.portfolio) ? profile.portfolio.map((item: any, index: number) => ({
      id: item.id || index + 1,
      title: item.title || "",
      link: item.link || "",
      description: item.description || "",
    })) : [],
    
    accomplishments: Array.isArray(profile.accomplishments) ? profile.accomplishments.map((acc: any, index: number) => ({
      id: acc.id || index + 1,
      title: acc.title || "",
      description: acc.description || "",
      credentialUrl: acc.credentialUrl || acc.credential_url || "",
    })) : [],
  };
};

export default function MultiStepForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if we're in edit mode
  const isEditMode = location.state?.edit;
  const existingProfile = location.state?.profile;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState<FormData>(() => {
    // If editing, load existing data, otherwise use defaults
    if (isEditMode && existingProfile) {
      return normalizeProfileData(existingProfile);
    }
    
    // Default form data for new profile
    return {
      firstName: "",
      lastName: "",
      phone: "",
      phoneOtp: "",
      phoneOtpVerified: true,
      dateOfBirth: "",
      gender: "",
      address: "",
      location: null,
      languages: "",
      linkedin: "",
      careerObjective: "",
      education: [
        {
          id: 1,
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          score: "",
        },
      ],
      experience: [],
      trainings: [],
      projects: [],
      skills: [],
      portfolio: [],
      accomplishments: [],
    };
  });

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Refs for scrolling to specific fields when validation fails
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLButtonElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const customSkillRef = useRef<HTMLInputElement>(null);
  const customSkillLevelRef = useRef<HTMLButtonElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [customSkillLevel, setCustomSkillLevel] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Fetch complete profile data when in edit mode
  useEffect(() => {
    const fetchProfile = async () => {
      // Always fetch fresh profile data when in edit mode to ensure we have the latest data
      if (isEditMode) {
        setIsLoadingProfile(true);
        try {
          const profileResponse = await apiService.getProfile();
          // Normalize and update form data with complete profile
          const normalizedData = normalizeProfileData(profileResponse);
          setFormData(normalizedData);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          toast({
            title: "Error",
            description: "Failed to load your profile data. Please try again.",
            variant: "destructive",
          });
          // If fetch fails and we have existing profile data, use that as fallback
          if (existingProfile) {
            const normalizedData = normalizeProfileData(existingProfile);
            setFormData(normalizedData);
          }
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfile();
  }, [isEditMode, toast]); // Removed existingProfile from dependencies to avoid re-fetching

  // Firebase Phone Authentication
  useEffect(() => {
    const initializeRecaptcha = () => {
      if (typeof window !== 'undefined' && !recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
    };

    initializeRecaptcha();

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Helper functions
  const updateField = <T extends keyof FormData>(field: T, value: FormData[T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateListItem = <T extends { id: number }>(
    key: keyof FormData,
    id: number,
    newItem: Partial<T>
  ) => {
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key] as unknown as T[]).map(item =>
        item.id === id ? { ...item, ...newItem } : item
      ),
    }));
    // Clear error for this specific list item field
    if (Object.keys(newItem).length === 1) {
      const fieldName = Object.keys(newItem)[0];
      const errorKey = `${key}-${id}-${fieldName}`;
      if (fieldErrors[errorKey]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
  };

  const removeListItem = <T extends { id: number }>(key: keyof FormData, id: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key] as unknown as T[]).filter(item => item.id !== id),
    }));
  };

  // Add item functions
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: (prev.education[prev.education.length - 1]?.id || 0) + 1,
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          score: "",
        },
      ],
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: (prev.experience[prev.experience.length - 1]?.id || 0) + 1,
          type: "Internship",
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const addTraining = () => {
    setFormData(prev => ({
      ...prev,
      trainings: [
        ...prev.trainings,
        {
          id: (prev.trainings[prev.trainings.length - 1]?.id || 0) + 1,
          title: "",
          provider: "",
          duration: "",
          description: "",
          credentialLink: "",
        },
      ],
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: (prev.projects[prev.projects.length - 1]?.id || 0) + 1,
          title: "",
          role: "",
          technologies: "",
          description: "",
        },
      ],
    }));
  };

  const addSkill = (name: string, level: string) => {
    setFormData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: (prev.skills[prev.skills.length - 1]?.id || 0) + 1,
          name,
          level,
        },
      ],
    }));
  };

  const addPortfolio = () => {
    setFormData(prev => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        {
          id: (prev.portfolio[prev.portfolio.length - 1]?.id || 0) + 1,
          title: "",
          link: "",
          description: "",
        },
      ],
    }));
  };

  const addAccomplishment = () => {
    setFormData(prev => ({
      ...prev,
      accomplishments: [
        ...prev.accomplishments,
        {
          id: (prev.accomplishments[prev.accomplishments.length - 1]?.id || 0) + 1,
          title: "",
          description: "",
          credentialUrl: "",
        },
      ],
    }));
  };

  const handleLocationSelect = useCallback((location: Location) => {
    setFormData(prev => ({ ...prev, location }));
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Validate LinkedIn URL
  const isValidLinkedInUrl = (url: string): boolean => {
    if (!url) return true; // Allow empty
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && urlObj.hostname.includes('linkedin.com');
    } catch {
      return false;
    }
  };

  // Validation function for Step 1
  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = "This field is required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "This field is required";
    } else if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be 10 digits";
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = "Phone number must contain only digits (0-9)";
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "This field is required";
    } else {
      // Check if date is valid and within range 2000-2005
      const dob = new Date(formData.dateOfBirth);
      const year = dob.getFullYear();
      if (year < 2000 || year > 2005) {
        errors.dateOfBirth = "Year must be between 2000 and 2005";
      } else {
        // Calculate age and check if between 21-24
        const age = calculateAge(formData.dateOfBirth);
        if (age < 21 || age > 24) {
          errors.dateOfBirth = "Age must be between 21 and 24 years";
        }
      }
    }
    
    if (!formData.gender) {
      errors.gender = "This field is required";
    }
    if (!formData.address.trim()) {
      errors.address = "This field is required";
    }
    
    // Validate LinkedIn URL
    if (formData.linkedin && !isValidLinkedInUrl(formData.linkedin)) {
      errors.linkedin = "Please enter a valid LinkedIn URL starting with https://";
    }
    
    return errors;
  };

  // Validation function for Step 2
  const validateStep2 = () => {
    const errors: { [key: string]: string } = {};
    
    formData.education.forEach((item) => {
      if (!item.institution.trim()) {
        errors[`education-${item.id}-institution`] = "This field is required";
      } else if (/[0-9]/.test(item.institution)) {
        errors[`education-${item.id}-institution`] = "Institution name should not contain numbers";
      }
      
      if (!item.degree.trim()) {
        errors[`education-${item.id}-degree`] = "This field is required";
      } else if (/[0-9]/.test(item.degree)) {
        errors[`education-${item.id}-degree`] = "Degree name should not contain numbers";
      }
      
      if (item.fieldOfStudy && /[0-9]/.test(item.fieldOfStudy)) {
        errors[`education-${item.id}-fieldOfStudy`] = "Field of study should not contain numbers";
      }
      
      if (!item.startYear) {
        errors[`education-${item.id}-startYear`] = "This field is required";
      }
      if (!item.endYear) {
        errors[`education-${item.id}-endYear`] = "This field is required";
      }
      
      // Validate score/CGPA (only numbers and decimal)
      if (item.score && !/^\d*\.?\d*$/.test(item.score)) {
        errors[`education-${item.id}-score`] = "Score/CGPA should contain only numbers and decimal point";
      }
    });
    
    return errors;
  };

  // Validation function for Step 5
  const validateStep5 = () => {
    const errors: { [key: string]: string } = {};
    
    // Validate each skill in the list
    formData.skills.forEach((item) => {
      if (!item.name.trim()) {
        errors[`skills-${item.id}-name`] = "This field is required";
      }
      if (!item.level.trim()) {
        errors[`skills-${item.id}-level`] = "This field is required";
      }
    });
    
    return errors;
  };

  // Navigation
  const handleNext = () => {
    if (currentStep === 1) {
      const step1Errors = validateStep1();
      
      if (Object.keys(step1Errors).length > 0) {
        setFieldErrors(step1Errors);
        
        // Scroll to first error
        const firstErrorKey = Object.keys(step1Errors)[0];
        
        // Scroll to the specific field
        setTimeout(() => {
          switch (firstErrorKey) {
            case 'firstName':
              firstNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              firstNameRef.current?.focus();
              break;
            case 'phone':
              phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              phoneRef.current?.focus();
              break;
            case 'dateOfBirth':
              dobRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              dobRef.current?.focus();
              break;
            case 'gender':
              genderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              genderRef.current?.focus();
              break;
            case 'address':
              addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              addressRef.current?.focus();
              break;
            case 'linkedin':
              // Find linkedin input
              const linkedinInput = document.getElementById('linkedin') as HTMLInputElement;
              if (linkedinInput) {
                linkedinInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                linkedinInput.focus();
              }
              break;
          }
        }, 100);
        
        toast({
          title: "Missing information",
          description: "Please fill all required personal details correctly.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 2) {
      const step2Errors = validateStep2();
      
      if (Object.keys(step2Errors).length > 0) {
        setFieldErrors(step2Errors);
        
        // Scroll to first error
        const firstErrorKey = Object.keys(step2Errors)[0];
        const errorParts = firstErrorKey.split('-');
        const educationId = errorParts[1];
        
        // Find and scroll to the education section with error
        setTimeout(() => {
          const element = document.getElementById(`education-${educationId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on the specific input field within the education section
            const fieldType = errorParts[2];
            const inputElement = element.querySelector(`[data-field="${fieldType}"]`) as HTMLInputElement;
            if (inputElement) {
              inputElement.focus();
            }
          }
        }, 100);
        
        toast({
          title: "Education incomplete",
          description: "Please fill required fields in each education entry correctly.",
          variant: "destructive",
        });
        return;
      }
    }

    // Step 5 validation with proper scrolling and error highlighting
    if (currentStep === 5) {
      const step5Errors = validateStep5();
      
      if (Object.keys(step5Errors).length > 0) {
        setFieldErrors(step5Errors);
        
        // Scroll to first error
        const firstErrorKey = Object.keys(step5Errors)[0];
        const errorParts = firstErrorKey.split('-');
        const skillId = errorParts[1];
        const fieldType = errorParts[2];
        
        // Find and scroll to the skill section with error
        setTimeout(() => {
          const element = document.getElementById(`skill-${skillId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on the specific input field within the skill section
            const inputElement = element.querySelector(`[data-field="${fieldType}"]`) as HTMLElement;
            if (inputElement) {
              inputElement.focus();
            }
          }
        }, 100);
        
        toast({
          title: "Skills incomplete",
          description: "Please fill required skill name and proficiency level.",
          variant: "destructive",
        });
        return;
      }
      
      // Also check if there are any skills added at all
      if (formData.skills.length === 0) {
        toast({
          title: "Skills required",
          description: "Please add at least one skill.",
          variant: "destructive",
        });
        
        // Scroll to the custom skill input
        setTimeout(() => {
          customSkillRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          customSkillRef.current?.focus();
        }, 100);
        
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle phone input - only allow digits
  const handlePhoneInput = (value: string) => {
    // Remove non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10);
    updateField("phone", limitedDigits);
  };

  // Handle DOB input - restrict to 4-digit year (2000-2005) and validate age
  const handleDOBInput = (value: string) => {
    updateField("dateOfBirth", value);
    
    // Clear previous age error if any
    if (fieldErrors.dateOfBirth && fieldErrors.dateOfBirth.includes("Age")) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
    
    // Calculate and show age if date is valid
    if (value) {
      const age = calculateAge(value);
      // You can optionally show the age to the user
      console.log("Age calculated:", age);
    }
  };

  // Handle score/CGPA input - only allow numbers and decimal
  const handleScoreInput = (value: string, id: number) => {
    // Remove non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;
    
    updateListItem<EducationItem>(
      "education",
      id,
      { score: finalValue }
    );
  };

  // Handle institution input - only allow alphabets and spaces
  const handleInstitutionInput = (value: string, id: number) => {
    // Allow alphabets, spaces, hyphens, apostrophes, and parentheses
    const cleanValue = value.replace(/[^a-zA-Z\s\-'()&]/g, '');
    updateListItem<EducationItem>(
      "education",
      id,
      { institution: cleanValue }
    );
  };

  // Handle degree input - only allow alphabets and spaces
  const handleDegreeInput = (value: string, id: number) => {
    // Allow alphabets, spaces, hyphens, and commas
    const cleanValue = value.replace(/[^a-zA-Z\s\-,]/g, '');
    updateListItem<EducationItem>(
      "education",
      id,
      { degree: cleanValue }
    );
  };

  // Handle field of study input - only allow alphabets and spaces
  const handleFieldOfStudyInput = (value: string, id: number) => {
    // Allow alphabets, spaces, and hyphens
    const cleanValue = value.replace(/[^a-zA-Z\s\-]/g, '');
    updateListItem<EducationItem>(
      "education",
      id,
      { fieldOfStudy: cleanValue }
    );
  };

  // Get all selected languages including custom ones
  const getAllSelectedLanguages = () => {
    const current = (formData.languages || "")
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    return current;
  };

  // Add custom language
  const handleAddCustomLanguage = () => {
    if (!customLanguage.trim()) return;
    
    const current = getAllSelectedLanguages();
    const newLanguage = customLanguage.trim();
    
    if (!current.includes(newLanguage)) {
      const next = [...current, newLanguage];
      updateField("languages", next.join(", "));
    }
    setCustomLanguage("");
  };

  // Generate PDF Resume
  const generateResumePDF = async (data: FormData) => {
    try {
      // Get user email from localStorage
      const userEmail = localStorage.getItem('userEmail') || 
                       JSON.parse(localStorage.getItem('userFullProfile') || '{}').email ||
                       '';

      console.log("📄 Generating PDF resume...");
      
      // Ensure all data is properly formatted
      const pdfData = {
        firstName: data.firstName || "User",
        lastName: data.lastName || "",
        phone: data.phone || "",
        email: userEmail,
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        address: data.address || "",
        languages: data.languages || "",
        linkedin: data.linkedin || "",
        careerObjective: data.careerObjective || "",
        education: data.education || [],
        experience: data.experience || [],
        trainings: data.trainings || [],
        projects: data.projects || [],
        skills: data.skills || [],
        portfolio: data.portfolio || [],
        accomplishments: data.accomplishments || []
      };

      console.log("PDF Data being sent:", pdfData);

      const response = await fetch(`${API_BASE_URL}/api/v1/resume/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(pdfData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_${data.firstName}_${data.lastName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Resume Generated! 📄",
          description: "Your professional resume PDF has been downloaded.",
        });
        
        return true;
      } else {
        const errorText = await response.text();
        console.error("Failed to generate PDF:", response.status, errorText);
        toast({
          title: "PDF Generation Failed",
          description: "Could not generate resume PDF. Please try again later.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Error",
        description: "An error occurred while generating your resume.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Submit with correct field names for backend and PDF generation
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Transform data to match backend schema
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        location_query: formData.location?.address || '',
        location_latitude: formData.location?.latitude,
        location_longitude: formData.location?.longitude,
        languages: formData.languages,
        linkedin: formData.linkedin,
        career_objective: formData.careerObjective,
        education: formData.education,
        experience: formData.experience,
        trainings: formData.trainings,
        projects: formData.projects,
        skills: formData.skills,
        portfolio: formData.portfolio,
        accomplishments: formData.accomplishments
      };

      console.log("Submitting data:", submitData);

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/complete-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        localStorage.setItem("userFullProfile", JSON.stringify(formData));
        
        toast({
          title: "Profile saved! 🎉",
          description: isEditMode 
            ? "Your profile has been updated successfully. Generating your resume..."
            : "Your profile has been saved successfully. Generating your resume...",
        });
        
        // Generate PDF after successful save
        const pdfGenerated = await generateResumePDF(formData);
        
        if (pdfGenerated) {
          toast({
            title: "Success! 🎉",
            description: isEditMode
              ? "Profile updated and resume downloaded! Redirecting to dashboard..."
              : "Profile saved and resume downloaded! Redirecting to dashboard...",
          });
        } else {
          toast({
            title: isEditMode ? "Profile Updated (PDF Failed)" : "Profile Saved (PDF Failed)",
            description: isEditMode
              ? "Your profile was updated but resume generation failed. Redirecting to dashboard..."
              : "Your profile was saved but resume generation failed. Redirecting to dashboard...",
            variant: "default",
          });
        }
        
        // Clear recommendation cache by setting a flag in localStorage
        // This will trigger a refresh when dashboard loads
        localStorage.setItem("profileUpdated", "true");
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error("Profile save error:", errorText);
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a separate download resume button for testing
  const handleDownloadResumeOnly = async () => {
    setIsLoading(true);
    try {
      await generateResumePDF(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-8">
      <div className="max-w-5xl w-full">
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              {isEditMode ? "Edit Your Profile" : "Complete your profile"}
            </CardTitle>
            <CardDescription>
              {isEditMode 
                ? "Update your profile information to keep it current."
                : "Tell us about yourself so we can match you with the best internships."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loading indicator when fetching profile */}
            {isLoadingProfile && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading your profile data...</span>
              </div>
            )}
            
            {/* Progress */}
            {!isLoadingProfile && (
              <div>
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            {/* Step titles */}
            {!isLoadingProfile && (
              <>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">
                    {currentStep === 1 && "Personal details"}
                    {currentStep === 2 && "Education"}
                    {currentStep === 3 && "Work experience"}
                    {currentStep === 4 && "Trainings, courses & projects"}
                    {currentStep === 5 && "Skills & portfolio"}
                    {currentStep === 6 && "Accomplishments & review"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentStep === 1 && "Basic information to build your profile."}
                    {currentStep === 2 && "Add your academic history (multiple entries allowed)."}
                    {currentStep === 3 && "Include internships you have done."}
                    {currentStep === 4 && "Highlight trainings, courses and academic / personal projects."}
                    {currentStep === 5 && "Showcase your skills and work samples."}
                    {currentStep === 6 && "Add accomplishments and finish your profile."}
                  </p>
                </div>

                {/* reCAPTCHA Container - kept but not used for OTP here */}
                <div id="recaptcha-container"></div>
              </>
            )}

            {/* Form Steps - Only show when profile is loaded */}
            {!isLoadingProfile && (
              <>
            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name *</Label>
                  <Input
                    ref={firstNameRef}
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className={fieldErrors.firstName ? "border-red-500" : ""}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-sm text-red-500">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    ref={lastNameRef}
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>

                {/* Phone number - WITHOUT OTP verification */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone number *</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        ref={phoneRef}
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handlePhoneInput(e.target.value)}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className={fieldErrors.phone ? "border-red-500" : ""}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-sm text-red-500">{fieldErrors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Enter your 10-digit phone number (digits only).
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of birth *</Label>
                  <Input
                    ref={dobRef}
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleDOBInput(e.target.value)}
                    className={fieldErrors.dateOfBirth ? "border-red-500" : ""}
                    min="2000-01-01"
                    max="2005-12-31"
                  />
                  {fieldErrors.dateOfBirth && (
                    <p className="text-sm text-red-500">{fieldErrors.dateOfBirth}</p>
                  )}
                  {formData.dateOfBirth && !fieldErrors.dateOfBirth && (
                    <p className="text-xs text-green-600">
                      Age: {calculateAge(formData.dateOfBirth)} years
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateField("gender", value)}
                  >
                    <SelectTrigger 
                      ref={genderRef}
                      className={fieldErrors.gender ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.gender && (
                    <p className="text-sm text-red-500">{fieldErrors.gender}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    ref={addressRef}
                    id="address"
                    rows={2}
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="House no., street, area, city, state"
                    className={fieldErrors.address ? "border-red-500" : ""}
                  />
                  {fieldErrors.address && (
                    <p className="text-sm text-red-500">{fieldErrors.address}</p>
                  )}
                </div>

                {/* Map Integration - UPDATED: Now in square shape with box UI */}
                <div className="md:col-span-2 space-y-2">
                  <MapComponent 
                    location={formData.location}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>

                {/* Languages */}
                <div className="md:col-span-2 space-y-2">
                  <Label>Languages you know</Label>
                  <div className="flex flex-wrap gap-2">
                    {getAllSelectedLanguages().map((lang) => {
                      const selected = getAllSelectedLanguages().includes(lang);

                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            let next: string[];
                            if (selected) {
                              next = getAllSelectedLanguages().filter((l) => l !== lang);
                            } else {
                              next = [...getAllSelectedLanguages(), lang];
                            }
                            updateField("languages", next.join(", "));
                          }}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add more languages"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCustomLanguage();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCustomLanguage}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="linkedin">LinkedIn profile link</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                    placeholder="https://www.linkedin.com/in/username"
                    className={fieldErrors.linkedin ? "border-red-500" : ""}
                    type="url"
                  />
                  {fieldErrors.linkedin && (
                    <p className="text-sm text-red-500">{fieldErrors.linkedin}</p>
                  )}
                  {formData.linkedin && !fieldErrors.linkedin && (
                    <p className="text-xs text-green-600">✓ Valid LinkedIn URL</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="careerObjective">Career objective</Label>
                  <Textarea
                    id="careerObjective"
                    rows={3}
                    value={formData.careerObjective}
                    onChange={(e) => updateField("careerObjective", e.target.value)}
                    placeholder="Briefly describe your career objective."
                  />
                </div>
              </div>
            )}

            {/* ---------- STEP 2: EDUCATION ---------- */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {formData.education.map((item) => (
                  <div
                    key={item.id}
                    id={`education-${item.id}`}
                    className="border rounded-md p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">Education {item.id}</p>
                      {formData.education.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeListItem("education", item.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {/* Institution – plain text */}
                      <div className="space-y-1 md:col-span-2">
                        <Label>Institution *</Label>
                        <Input
                          data-field="institution"
                          value={item.institution}
                          onChange={(e) =>
                            handleInstitutionInput(e.target.value, item.id)
                          }
                          placeholder="College / school name"
                          className={fieldErrors[`education-${item.id}-institution`] ? "border-red-500" : ""}
                        />
                        {fieldErrors[`education-${item.id}-institution`] && (
                          <p className="text-sm text-red-500">{fieldErrors[`education-${item.id}-institution`]}</p>
                        )}
                      </div>

                      {/* Degree / course – plain text */}
                      <div className="space-y-1">
                        <Label>Degree / course *</Label>
                        <Input
                          data-field="degree"
                          value={item.degree}
                          onChange={(e) =>
                            handleDegreeInput(e.target.value, item.id)
                          }
                          placeholder="e.g., B.Tech, B.Com, Class XII"
                          className={fieldErrors[`education-${item.id}-degree`] ? "border-red-500" : ""}
                        />
                        {fieldErrors[`education-${item.id}-degree`] && (
                          <p className="text-sm text-red-500">{fieldErrors[`education-${item.id}-degree`]}</p>
                        )}
                      </div>

                      {/* Field of study – plain text */}
                      <div className="space-y-1">
                        <Label>Field of study</Label>
                        <Input
                          data-field="fieldOfStudy"
                          value={item.fieldOfStudy}
                          onChange={(e) =>
                            handleFieldOfStudyInput(e.target.value, item.id)
                          }
                          placeholder="e.g., Computer Science"
                          className={fieldErrors[`education-${item.id}-fieldOfStudy`] ? "border-red-500" : ""}
                        />
                        {fieldErrors[`education-${item.id}-fieldOfStudy`] && (
                          <p className="text-sm text-red-500">{fieldErrors[`education-${item.id}-fieldOfStudy`]}</p>
                        )}
                      </div>

                      {/* Score */}
                      <div className="space-y-1">
                        <Label>Score / CGPA</Label>
                        <Input
                          data-field="score"
                          value={item.score}
                          onChange={(e) =>
                            handleScoreInput(e.target.value, item.id)
                          }
                          placeholder="e.g., 8.5 CGPA / 85%"
                          className={fieldErrors[`education-${item.id}-score`] ? "border-red-500" : ""}
                          inputMode="decimal"
                        />
                        {fieldErrors[`education-${item.id}-score`] && (
                          <p className="text-sm text-red-500">{fieldErrors[`education-${item.id}-score`]}</p>
                        )}
                      </div>

                      {/* Start year */}
                      <div className="space-y-1">
                        <Label>Start year *</Label>
                        <Select
                          value={item.startYear}
                          onValueChange={(value) =>
                            updateListItem<EducationItem>(
                              "education",
                              item.id,
                              { startYear: value }
                            )
                          }
                        >
                          <SelectTrigger 
                            data-field="startYear"
                            className={fieldErrors[`education-${item.id}-startYear`] ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldErrors[`education-${item.id}-startYear`] && (
                          <p className="text-sm text-red-500">{fieldErrors[`education-${item.id}-startYear`]}</p>
                        )}
                      </div>

                      {/* End year */}
                      <div className="space-y-1">
                        <Label>End year *</Label>
                        <Select
                          value={item.endYear}
                          onValueChange={(value) =>
                            updateListItem<EducationItem>(
                              "education",
                              item.id,
                              { endYear: value }
                            )
                          }
                        >
                          <SelectTrigger 
                            data-field="endYear"
                            className={fieldErrors[`education-${item.id}-endYear`] ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldErrors[`education-${item.id}-endYear`] && (
                          <p className="text-sm text-red-500">{fieldErrors[`education-${item.id}-endYear`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addEducation}>
                  + Add education
                </Button>
              </div>
            )}

            {/* ---------- STEP 3: WORK EXPERIENCE ---------- */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {formData.experience.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-md p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">
                        Internship {item.id}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem("experience", item.id)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {/* Company – plain text */}
                      <div className="space-y-1">
                        <Label>Company / organization *</Label>
                        <Input
                          value={item.company}
                          onChange={(e) =>
                            updateListItem<ExperienceItem>(
                              "experience",
                              item.id,
                              { company: e.target.value }
                            )
                          }
                          placeholder="Company name"
                        />
                      </div>

                      {/* Role – plain text */}
                      <div className="space-y-1">
                        <Label>Role / designation *</Label>
                        <Input
                          value={item.role}
                          onChange={(e) =>
                            updateListItem<ExperienceItem>(
                              "experience",
                              item.id,
                              { role: e.target.value }
                            )
                          }
                          placeholder="e.g., Web Development Intern"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Start year *</Label>
                        <Select
                          value={item.startDate}
                          onValueChange={(value) =>
                            updateListItem<ExperienceItem>(
                              "experience",
                              item.id,
                              { startDate: value }
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select start year" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceYearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label>End year *</Label>
                        <Select
                          value={item.endDate}
                          onValueChange={(value) =>
                            updateListItem<ExperienceItem>(
                              "experience",
                              item.id,
                              { endDate: value }
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select end year" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceYearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={item.description}
                          onChange={(e) =>
                            updateListItem<ExperienceItem>(
                              "experience",
                              item.id,
                              { description: e.target.value }
                            )
                          }
                          placeholder="Describe your responsibilities, technologies used, achievements, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addExperience}>
                  + Add internship
                </Button>

                {formData.experience.length === 0 && (
                  <p className="text-xs text-gray-500">
                    You can skip this step if you do not have any internships yet.
                  </p>
                )}
              </div>
            )}

            {/* ---------- STEP 4: TRAININGS & PROJECTS ---------- */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Trainings / courses */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">
                    Trainings / courses
                  </p>
                  {formData.trainings.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-4 space-y-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-xs">
                          Training / course {item.id}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeListItem("trainings", item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label>Title *</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              updateListItem<TrainingItem>(
                                "trainings",
                                item.id,
                                { title: e.target.value }
                              )
                            }
                            placeholder="e.g., Web Development Bootcamp"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Provider *</Label>
                          <Input
                            value={item.provider}
                            onChange={(e) =>
                              updateListItem<TrainingItem>(
                                "trainings",
                                item.id,
                                { provider: e.target.value }
                              )
                            }
                            placeholder="e.g., Coursera, Udemy"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Duration</Label>
                          <Input
                            value={item.duration}
                            onChange={(e) =>
                              updateListItem<TrainingItem>(
                                "trainings",
                                item.id,
                                { duration: e.target.value }
                              )
                            }
                            placeholder="e.g., 6 weeks"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <Label>Description</Label>
                          <Textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) =>
                              updateListItem<TrainingItem>(
                                "trainings",
                                item.id,
                                { description: e.target.value }
                              )
                            }
                            placeholder="What did you learn or build?"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <Label>Credential link</Label>
                          <Input
                            value={item.credentialLink}
                            onChange={(e) =>
                              updateListItem<TrainingItem>(
                                "trainings",
                                item.id,
                                { credentialLink: e.target.value }
                              )
                            }
                            placeholder="URL of certificate / credentials"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addTraining}>
                    + Add training / course
                  </Button>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">
                    Academics / personal projects
                  </p>
                  {formData.projects.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-4 space-y-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-xs">
                          Project {item.id}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeListItem("projects", item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label>Title *</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              updateListItem<ProjectItem>("projects", item.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Project title"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Your role</Label>
                          <Input
                            value={item.role}
                            onChange={(e) =>
                              updateListItem<ProjectItem>("projects", item.id, {
                                role: e.target.value,
                              })
                            }
                            placeholder="e.g., Backend developer"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Technologies used</Label>
                          <Input
                            value={item.technologies}
                            onChange={(e) =>
                              updateListItem<ProjectItem>("projects", item.id, {
                                technologies: e.target.value,
                              })
                            }
                            placeholder="e.g., React, Node.js, MongoDB"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            value={item.description}
                            onChange={(e) =>
                              updateListItem<ProjectItem>("projects", item.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="What was the project about? What did you build or achieve?"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addProject}>
                    + Add academic / personal project
                  </Button>
                </div>
              </div>
            )}

            {/* ---------- STEP 5: SKILLS & PORTFOLIO ---------- */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Skills */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Skills</p>

                  {/* Tickbox-style chips */}
                  <div className="flex flex-wrap gap-2">
                    {defaultSkills.map((skill) => {
                      const existing = formData.skills.find(
                        (s) => s.name.toLowerCase() === skill.toLowerCase()
                      );
                      const selected = !!existing;

                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            if (selected) {
                              // remove
                              setFormData((prev) => ({
                                ...prev,
                                skills: prev.skills.filter(
                                  (s) =>
                                    s.name.toLowerCase() !==
                                    skill.toLowerCase()
                                ),
                              }));
                            } else {
                              // add with default level
                              addSkill(skill, "Intermediate");
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add more skill + proficiency */}
                  <div className="grid gap-2 md:grid-cols-3 mt-3">
                    <div className="space-y-1 md:col-span-2">
                      <Label>Add more skill</Label>
                      <Input
                        ref={customSkillRef}
                        placeholder="e.g., Next.js, Figma"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Proficiency</Label>
                      <Select
                        value={customSkillLevel}
                        onValueChange={(value) => setCustomSkillLevel(value)}
                      >
                        <SelectTrigger
                          ref={customSkillLevelRef}
                        >
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      if (!customSkill.trim()) {
                        toast({
                          title: "Skill required",
                          description: "Please enter a skill name.",
                          variant: "destructive",
                        });
                        setFieldErrors(prev => ({
                          ...prev,
                          customSkill: "This field is required"
                        }));
                        customSkillRef.current?.focus();
                        return;
                      }
                      if (!customSkillLevel) {
                        toast({
                          title: "Proficiency required",
                          description: "Please select a proficiency level.",
                          variant: "destructive",
                        });
                        setFieldErrors(prev => ({
                          ...prev,
                          customSkillLevel: "This field is required"
                        }));
                        customSkillLevelRef.current?.focus();
                        return;
                      }
                      const level = customSkillLevel || "Intermediate";
                      addSkill(customSkill.trim(), level);
                      setCustomSkill("");
                      setCustomSkillLevel("");
                      // Clear custom skill errors
                      setFieldErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.customSkill;
                        delete newErrors.customSkillLevel;
                        return newErrors;
                      });
                    }}
                  >
                    + Add skill
                  </Button>

                  {/* Editable list of skills - UPDATED with proper validation styling */}
                  {formData.skills.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {formData.skills.map((item) => (
                        <div
                          key={item.id}
                          id={`skill-${item.id}`}
                          className="border rounded-md p-3 flex flex-col md:flex-row gap-3 bg-gray-50"
                        >
                          <div className="flex-1 space-y-1">
                            <Label>Skill *</Label>
                            <Input
                              data-field="name"
                              value={item.name}
                              onChange={(e) =>
                                updateListItem<SkillItem>("skills", item.id, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="Skill name"
                              className={fieldErrors[`skills-${item.id}-name`] ? "border-red-500" : ""}
                            />
                            {fieldErrors[`skills-${item.id}-name`] && (
                              <p className="text-sm text-red-500">{fieldErrors[`skills-${item.id}-name`]}</p>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label>Proficiency *</Label>
                            <Select
                              value={item.level}
                              onValueChange={(value) =>
                                updateListItem<SkillItem>("skills", item.id, {
                                  level: value,
                                })
                              }
                            >
                              <SelectTrigger
                                data-field="level"
                                className={fieldErrors[`skills-${item.id}-level`] ? "border-red-500" : ""}
                              >
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                {proficiencyLevels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldErrors[`skills-${item.id}-level`] && (
                              <p className="text-sm text-red-500">{fieldErrors[`skills-${item.id}-level`]}</p>
                            )}
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeListItem("skills", item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Portfolio / work samples */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">
                    Portfolio / work samples
                  </p>
                  {formData.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-4 space-y-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-xs">
                          Work sample {item.id}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeListItem("portfolio", item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              updateListItem<PortfolioItem>(
                                "portfolio",
                                item.id,
                                { title: e.target.value }
                              )
                            }
                            placeholder="e.g., Portfolio website, GitHub repo"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Link</Label>
                          <Input
                            value={item.link}
                            onChange={(e) =>
                              updateListItem<PortfolioItem>(
                                "portfolio",
                                item.id,
                                { link: e.target.value }
                              )
                            }
                            placeholder="URL to your work sample"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Description</Label>
                          <Textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) =>
                              updateListItem<PortfolioItem>(
                                "portfolio",
                                item.id,
                                { description: e.target.value }
                              )
                            }
                            placeholder="Short description of this work sample."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPortfolio}
                  >
                    + Add portfolio / work sample
                  </Button>
                </div>
              </div>
            )}

{/* ---------- STEP 6: ACCOMPLISHMENTS ---------- */}
{currentStep === 6 && (
  <div className="space-y-6">
    <div className="space-y-3">
      <p className="font-semibold text-sm">
        Accomplishments / additional details
      </p>
      {formData.accomplishments.map((item) => (
        <div
          key={item.id}
          className="border rounded-md p-4 space-y-3 bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <p className="font-medium text-xs">
              Entry {item.id}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                removeListItem("accomplishments", item.id)
              }
            >
              Remove
            </Button>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                value={item.title}
                onChange={(e) =>
                  updateListItem<AccomplishmentItem>(
                    "accomplishments",
                    item.id,
                    { title: e.target.value }
                  )
                }
                placeholder="e.g., Hackathon winner, Scholarship"
              />
            </div>
            <div className="space-y-1">
              <Label>Description / additional detail</Label>
              <Textarea
                rows={3}
                value={item.description}
                onChange={(e) =>
                  updateListItem<AccomplishmentItem>(
                    "accomplishments",
                    item.id,
                    { description: e.target.value }
                  )
                }
                placeholder="Explain what you achieved or any additional information about you."
              />
            </div>
            <div className="space-y-1">
              <Label>Credential / proof link</Label>
              <Input
                value={item.credentialUrl}
                onChange={(e) =>
                  updateListItem<AccomplishmentItem>(
                    "accomplishments",
                    item.id,
                    { credentialUrl: e.target.value }
                  )
                }
                placeholder="URL to certificate, article, portfolio, etc."
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addAccomplishment}
      >
        + Add accomplishment / additional detail
      </Button>
    </div>

    {/* Test Resume Download Button */}
    <div className="border-t pt-4 mt-6">
      <p className="text-sm font-medium mb-2">Test Resume Generation</p>
      <Button
        type="button"
        variant="outline"
        onClick={handleDownloadResumeOnly}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Download Resume Only
      </Button>
      <p className="text-xs text-gray-500 mt-1">
        You can test resume generation separately before submitting your profile.
      </p>
    </div>

    <p className="text-xs text-gray-500">
      After you click "{isEditMode ? "Update Profile" : "Find Internships"}", your profile will be {isEditMode ? "updated" : "saved"}
      and a professional resume PDF will be automatically downloaded.
    </p>
    </div>
)}
              </>
            )}

            {/* Navigation Buttons */}
            {!isLoadingProfile && (
              <div className="flex justify-between pt-4 border-t">
                {/* Home button for Step 1, Previous button for other steps */}
                {currentStep === 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isEditMode ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        {isEditMode ? "Update Profile" : "Find Internships"} & Download Resume
                        <Download className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}