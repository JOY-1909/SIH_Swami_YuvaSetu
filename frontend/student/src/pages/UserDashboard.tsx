import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Recommendation } from "@/types/recommendations";
import { useLanguage } from "@/context/LanguageContext"; // Added import
import { 
  MapPin, 
  Calendar, 
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";

interface Application {
  application_id: string;
  internship_id: string;
  title: string;
  company: string;
  location: string;
  stipend: number;
  duration: string;
  work_type: string;
  application_status: string;
  applied_at: string | null;
  cover_letter?: string;
  notes?: string;
}

interface InternshipDetails {
  id: string;
  title: string;
  company: string;
  company_description?: string;
  description: string;
  location?: string;
  work_type?: string;
  duration?: string;
  stipend?: number;
  stipend_currency?: string;
  requirements?: string[];
  skills?: string[];
  responsibilities?: string[];
  is_remote?: boolean;
  application_deadline?: string;
  start_date?: string;
  positions_available?: number;
  applications_received?: number;
  category?: string;
  tags?: string[];
  contact_email?: string;
  contact_phone?: string;
  apply_url?: string;
  has_applied?: boolean;
  application_status?: string;
  applied_at?: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage(); // Hook
  const [activeTab, setActiveTab] = useState("internships");
  const [locationFilter, setLocationFilter] = useState("");
  const [stipendFilter, setStipendFilter] = useState(0);
  const [durationFilter, setDurationFilter] = useState("");
  const [workType, setWorkType] = useState<string[]>([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const [internshipDetails, setInternshipDetails] = useState<InternshipDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  
  // Refs for polling intervals
  const applicationsPollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recommendationsPollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch recommendations with filters
  const fetchRecommendations = useCallback(async () => {
    try {
      setRecommendationsLoading(true);
      const params: Record<string, string | number | undefined> = { limit: 5 };
      
      if (locationFilter && locationFilter !== "") {
        params.location = locationFilter;
      }
      if (stipendFilter > 0) {
        params.min_stipend = stipendFilter;
      }
      if (durationFilter && durationFilter !== "") {
        params.duration = durationFilter;
      }
      // Send work type as comma-separated string (backend will handle it)
      if (workType.length > 0) {
        params.work_type = workType.join(',');
      }
      
      const data = await apiService.getStudentRecommendations(params);
      console.log("Recommendations API Response:", data);
      console.log("Number of recommendations:", data.recommendations?.length || 0);
      const sortedRecommendations = data.recommendations
        .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
        .slice(0, 5);
      setRecommendations(sortedRecommendations);
      setRecommendationsError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load recommendations";
      setRecommendationsError(errorMessage);
      if (!recommendations.length) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setRecommendationsLoading(false);
    }
  }, [locationFilter, stipendFilter, durationFilter, workType, toast]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      setApplicationsLoading(true);
      const data = await apiService.getMyApplications();
      setApplications(data.applications || []);
      setApplicationsError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load applications";
      setApplicationsError(errorMessage);
    } finally {
      setApplicationsLoading(false);
    }
  }, []);

  // Fetch internship details for modal
  const fetchInternshipDetails = useCallback(async (internshipId: string) => {
    try {
      setDetailsLoading(true);
      const response = await apiService.getInternshipDetails(internshipId);
      if (response.success && response.internship) {
        setInternshipDetails(response.internship);
      } else {
        throw new Error("Failed to load internship details");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load internship details";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setSelectedInternshipId(null);
    } finally {
      setDetailsLoading(false);
    }
  }, [toast]);

  // Handle apply button click - opens modal
  const handleViewDetails = (internshipId: string) => {
    setSelectedInternshipId(internshipId);
    fetchInternshipDetails(internshipId);
  };

  // Handle apply from modal
  const handleApply = async () => {
    if (!internshipDetails || !internshipDetails.id) return;
    
    try {
      setApplying(true);
      if (internshipDetails.apply_url) {
        // External URL
        window.open(internshipDetails.apply_url, "_blank");
        toast({
          title: "Application",
          description: "Opening application page...",
        });
        setSelectedInternshipId(null);
        setInternshipDetails(null);
      } else {
        // API apply
        await apiService.applyToInternship(internshipDetails.id);
        toast({
          title: "Success",
          description: `Successfully applied to ${internshipDetails.title} at ${internshipDetails.company}`,
        });
        // Refresh data
        await Promise.all([fetchApplications(), fetchRecommendations()]);
        setSelectedInternshipId(null);
        setInternshipDetails(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to apply";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  // Handle resume download
  const handleDownloadResume = async () => {
    try {
      toast({
        title: "Generating Resume",
        description: "Please wait while we generate your resume PDF...",
      });
      const blob = await apiService.downloadResume();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const userProfile = JSON.parse(localStorage.getItem('userFullProfile') || '{}');
      const fileName = `resume_${userProfile.firstName || 'User'}_${userProfile.lastName || ''}.pdf`.trim();
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Resume Downloaded! 📄",
        description: "Your professional resume PDF has been downloaded.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to download resume";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };


  // Initial load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Check if profile was just updated
    const profileUpdated = localStorage.getItem("profileUpdated");
    if (profileUpdated === "true") {
      localStorage.removeItem("profileUpdated");
      toast({
        title: "Profile Updated!",
        description: "Your recommendations will be updated based on your new profile.",
      });
      // Force refresh recommendations
      setTimeout(() => {
        fetchRecommendations();
      }, 1000);
    } else {
      fetchRecommendations();
    }
    
    fetchApplications();
  }, [fetchRecommendations, fetchApplications, navigate, toast]);

  // Auto-refresh recommendations when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRecommendations();
    }, 500); // Debounce filter changes

    return () => clearTimeout(timeoutId);
  }, [locationFilter, stipendFilter, durationFilter, workType, fetchRecommendations]);

  // Polling for application status updates (every 30 seconds)
  useEffect(() => {
    applicationsPollIntervalRef.current = setInterval(() => {
      fetchApplications();
    }, 30000); // 30 seconds

    return () => {
      if (applicationsPollIntervalRef.current) {
        clearInterval(applicationsPollIntervalRef.current);
      }
    };
  }, [fetchApplications]);

  // Auto-refresh recommendations (every 5 minutes)
  useEffect(() => {
    recommendationsPollIntervalRef.current = setInterval(() => {
      fetchRecommendations();
    }, 300000); // 5 minutes

    return () => {
      if (recommendationsPollIntervalRef.current) {
        clearInterval(recommendationsPollIntervalRef.current);
      }
    };
  }, [fetchRecommendations]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "selected":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "reviewed":
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "selected":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "reviewed":
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shortlisted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 pt-28">
        {/* RESUME DOWNLOAD BANNER */}
        <div className="bg-green-50 border-b p-6 shadow-sm mt-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button 
              onClick={handleDownloadResume}
              className="bg-blue-200 hover:bg-blue-300 text-gray-800 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Download className="w-5 h-5" />
              {t("dashboard.downloadResumeBanner.button")}
            </button>
            <p className="text-gray-700 text-sm">
              <span className="font-medium">{t("dashboard.downloadResumeBanner.text")}</span>
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-6">
          <div className="flex gap-6 max-w-7xl mx-auto">
            {/* FILTER PANEL */}
            <div className="w-1/4 bg-white shadow-md rounded-xl p-6 sticky top-32 self-start overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 150px)" }}>
              <h2 className="text-xl font-semibold mb-6">{t("dashboard.filters.title")}</h2>

              {/* LOCATION */}
              <div className="mb-8">
                <label className="block mb-3 font-medium text-gray-700">{t("dashboard.filters.location")}</label>
                <select
                  className="w-full p-3 rounded-lg shadow-sm bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">{t("dashboard.filters.allLocations")}</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* STIPEND SLIDER */}
              <div className="mb-8">
                <label className="block mb-4 font-medium text-gray-700">{t("dashboard.filters.stipend")}</label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={stipendFilter}
                  onChange={(e) => setStipendFilter(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
                />
                <div className="mt-4 text-center text-sm font-semibold text-blue-600">
                  ₹{stipendFilter.toLocaleString()} / month
                </div>
              </div>

              {/* DURATION */}
              <div className="mb-8">
                <label className="block mb-3 font-medium text-gray-700">{t("dashboard.filters.duration")}</label>
                <select
                  className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                >
                  <option value="">{t("dashboard.filters.anyDuration")}</option>
                  <option value="45 Days">45 Days</option>
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>

              {/* WORK TYPE */}
              <div className="mb-8">
                <label className="block mb-3 font-medium text-gray-700">{t("dashboard.filters.workType")}</label>
                {[
                  { value: "WFH", label: "Work from Home" },
                  { value: "WFO", label: "Work from Office" },
                  { value: "Hybrid", label: "Hybrid" },
                  { value: "Remote", label: "Remote" }
                ].map((type) => (
                  <label key={type.value} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="mr-2 accent-blue-600"
                      checked={workType.includes(type.value)}
                      onChange={() =>
                        setWorkType((prev) =>
                          prev.includes(type.value)
                            ? prev.filter((v) => v !== type.value)
                            : [...prev, type.value]
                        )
                      }
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>

              {/* CLEAR FILTERS */}
              <button
                onClick={() => {
                  setLocationFilter("");
                  setStipendFilter(0);
                  setDurationFilter("");
                  setWorkType([]);
                }}
                className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                {t("dashboard.filters.clear")}
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-3/4">
              {/* TABS */}
              <div className="flex gap-6 mb-6 text-lg font-semibold">
                <button
                  onClick={() => setActiveTab("internships")}
                  className={`pb-1 ${
                    activeTab === "internships"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {t("dashboard.tabs.internships")}
                </button>

                <button
                  onClick={() => setActiveTab("applications")}
                  className={`pb-1 ${
                    activeTab === "applications"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {t("dashboard.tabs.applications")}
                </button>
              </div>

              {/* INTERNSHIP LIST */}
              {activeTab === "internships" ? (
                <div className="space-y-6">
                  {recommendationsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">{t("dashboard.recommendations.loading")}</p>
                    </div>
                  ) : recommendationsError ? (
                    <div className="text-center py-12">
                      <p className="text-red-500 mb-4">{recommendationsError}</p>
                      <Button onClick={fetchRecommendations} variant="outline">
                        {t("dashboard.recommendations.retry")}
                      </Button>
                    </div>
                  ) : recommendations.length > 0 ? (
                    recommendations.map((item) => (
                      <div key={item.id}
                        className="p-6 bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-lg font-semibold">{item.title}</h2>
                            <p className="text-gray-600 text-sm">{item.company}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-200 block">
                              {t("dashboard.recommendations.matchScore")}: {Math.round(item.matchPercentage || 0)}%
                            </span>
                            {item.hasApplied ? (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 mt-1 inline-block">
                                {t("dashboard.recommendations.applied")}
                              </span>
                            ) : (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 mt-1 inline-block">
                                Actively hiring
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-6 mt-3 text-sm text-gray-600 flex-wrap">
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                          {item.duration && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{item.duration}</span>
                            </div>
                          )}
                          {item.stipend && (
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" />
                              <span>₹{item.stipend.toLocaleString()}/month</span>
                            </div>
                          )}
                          {item.workType && (
                            <div className="flex items-center gap-1">
                              <span>🏢</span>
                              <span>{item.workType}</span>
                            </div>
                          )}
                        </div>

                        {item.description && (
                          <p className="mt-4 text-gray-700 text-sm line-clamp-2">{item.description}</p>
                        )}

                        {item.skills && item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {item.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-md border">
                                {skill}
                              </span>
                            ))}
                            {item.skills.length > 5 && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-md border">
                                +{item.skills.length - 5} {t("dashboard.recommendations.moreSkills")}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleViewDetails(item.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            disabled={item.hasApplied}
                          >
                            {item.hasApplied ? t("dashboard.recommendations.applied") : t("dashboard.recommendations.apply")}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg mb-2">{t("dashboard.recommendations.empty")}</p>
                      <p className="text-gray-400 text-sm">Complete your profile to help us match you better.</p>
                    </div>
                  )}
                </div>
              ) : (
                /* APPLICATION STATUS TAB */
                <div className="space-y-6">
                  {applicationsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading applications...</p>
                    </div>
                  ) : applicationsError ? (
                    <div className="text-center py-12">
                      <p className="text-red-500 mb-4">{applicationsError}</p>
                      <Button onClick={fetchApplications} variant="outline">
                        {t("dashboard.recommendations.retry")}
                      </Button>
                    </div>
                  ) : applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app.application_id} className="p-6 bg-white shadow-md rounded-xl border border-gray-200">

                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900">{app.title}</h2>
                            <p className="text-orange-500 text-sm font-medium">{app.company}</p>
                          </div>
                          <Badge className={`${getStatusColor(app.application_status)} border flex items-center gap-1`}>
                            {getStatusIcon(app.application_status)}
                            {formatStatus(app.application_status)}
                          </Badge>
                        </div>

                        <div className="flex gap-6 mt-3 text-sm text-gray-600 flex-wrap mb-4">
                          <div>📍 {app.location}</div>
                          <div>📅 {app.duration}</div>
                          {app.stipend > 0 && (
                            <div>💰 ₹{app.stipend.toLocaleString()}/month</div>
                          )}
                          {app.work_type && <div>🏢 {app.work_type}</div>}
                        </div>

                        {app.applied_at && (
                          <p className="text-xs text-gray-500 mb-4">
                            Applied on: {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        )}

                        {/* Status Timeline - Same as before */}
                        <div className="space-y-4 mt-6 relative border-t pt-6">
                          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                          
                          {/* Step 1 */}
                          <div className="flex gap-4 relative">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10 ${
                              ["submitted", "pending", "under_review", "applied"].includes(app.application_status.toLowerCase())
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}>
                              1
                            </div>
                            <div>
                              <h3 className={`font-semibold ${
                                ["submitted", "pending", "under_review", "applied"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}>
                                Application Submitted
                              </h3>
                              {app.applied_at && (
                                <p className="text-xs text-gray-500 mb-1">
                                  {new Date(app.applied_at).toLocaleDateString()}
                                </p>
                              )}
                              <p className={`text-sm mb-2 ${
                                ["submitted", "pending", "under_review", "applied"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}>
                                Your application has been received successfully.
                              </p>
                              {["submitted", "pending", "under_review", "applied"].includes(app.application_status.toLowerCase()) && (
                                <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-200">
                                  Current Status
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex gap-4 relative">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10 ${
                              ["under_review", "reviewed", "shortlisted"].includes(app.application_status.toLowerCase())
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}>
                              2
                            </div>
                            <div>
                              <h3 className={`font-medium ${
                                ["under_review", "reviewed", "shortlisted"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}>
                                Application Under Review
                              </h3>
                              <p className={`text-xs mb-1 ${
                                ["under_review", "reviewed", "shortlisted"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}>
                                {["under_review", "reviewed", "shortlisted"].includes(app.application_status.toLowerCase())
                                  ? "In Progress"
                                  : "Pending"}
                              </p>
                              <p className={`text-sm ${
                                ["under_review", "reviewed", "shortlisted"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}>
                                The employer is currently reviewing your profile and skills.
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex gap-4 relative">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10 ${
                              ["shortlisted", "interview_scheduled"].includes(app.application_status.toLowerCase())
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}>
                              3
                            </div>
                            <div>
                              <h3 className={`font-medium ${
                                ["shortlisted", "interview_scheduled"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}>
                                Interview/Assessment Scheduled
                              </h3>
                              <p className={`text-xs mb-1 ${
                                ["shortlisted", "interview_scheduled"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}>
                                {["shortlisted", "interview_scheduled"].includes(app.application_status.toLowerCase())
                                  ? "In Progress"
                                  : "Pending"}
                              </p>
                              <p className={`text-sm ${
                                ["shortlisted", "interview_scheduled"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}>
                                You've been shortlisted! Check your email for next steps.
                              </p>
                            </div>
                          </div>

                          {/* Step 4 */}
                          <div className="flex gap-4 relative">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10 ${
                              ["accepted", "selected", "rejected"].includes(app.application_status.toLowerCase())
                                ? app.application_status.toLowerCase() === "rejected"
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}>
                              4
                            </div>
                            <div>
                              <h3 className={`font-medium ${
                                ["accepted", "selected", "rejected"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}>
                                Final Decision
                              </h3>
                              <p className={`text-xs mb-1 ${
                                ["accepted", "selected", "rejected"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}>
                                {["accepted", "selected", "rejected"].includes(app.application_status.toLowerCase())
                                  ? formatStatus(app.application_status)
                                  : "Pending"}
                              </p>
                              <p className={`text-sm ${
                                ["accepted", "selected", "rejected"].includes(app.application_status.toLowerCase())
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}>
                                {app.application_status.toLowerCase() === "rejected"
                                  ? "Unfortunately, your application was not selected."
                                  : "Decision pending."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg mb-2">No applications yet</p>
                      <p className="text-gray-400 text-sm">You haven't applied to any internships yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {selectedInternshipId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => {
          setSelectedInternshipId(null);
          setInternshipDetails(null);
        }}>
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading internship details...</p>
              </div>
            ) : internshipDetails ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{internshipDetails.title}</h2>
                    <p className="text-blue-600 font-medium text-lg">{internshipDetails.company}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedInternshipId(null);
                      setInternshipDetails(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {internshipDetails.company_description && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">About Company</h3>
                    <p className="text-gray-700 text-sm">{internshipDetails.company_description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  {internshipDetails.location && (
                    <div>
                      <strong>📍 Location:</strong> {internshipDetails.location}
                    </div>
                  )}
                  {internshipDetails.stipend && (
                    <div>
                      <strong>💰 Stipend:</strong> ₹{internshipDetails.stipend.toLocaleString()}/month
                    </div>
                  )}
                  {internshipDetails.duration && (
                    <div>
                      <strong>📅 Duration:</strong> {internshipDetails.duration}
                    </div>
                  )}
                  {internshipDetails.work_type && (
                    <div>
                      <strong>🏢 Work Type:</strong> {internshipDetails.work_type}
                    </div>
                  )}
                  {internshipDetails.start_date && (
                    <div>
                      <strong>📆 Start Date:</strong> {new Date(internshipDetails.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {internshipDetails.application_deadline && (
                    <div>
                      <strong>⏰ Deadline:</strong> {new Date(internshipDetails.application_deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {internshipDetails.description && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{internshipDetails.description}</p>
                  </div>
                )}

                {internshipDetails.responsibilities && Array.isArray(internshipDetails.responsibilities) && internshipDetails.responsibilities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {internshipDetails.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {internshipDetails.requirements && Array.isArray(internshipDetails.requirements) && internshipDetails.requirements.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {internshipDetails.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {internshipDetails.skills && internshipDetails.skills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {internshipDetails.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-gray-100 rounded-md border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {internshipDetails.tags && internshipDetails.tags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {internshipDetails.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-6 space-x-3 border-t pt-4">
                  <button
                    onClick={() => {
                      setSelectedInternshipId(null);
                      setInternshipDetails(null);
                    }}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={internshipDetails.has_applied || applying}
                  >
                    {applying ? "Applying..." : internshipDetails.has_applied ? "Already Applied" : "Apply Now"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default UserDashboard;
