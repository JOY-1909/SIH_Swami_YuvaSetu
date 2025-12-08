// File: frontend/src/pages/InternshipApplication.tsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import ApplicationModal from "@/components/application/ApplicationModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Briefcase, MapPin, Calendar, IndianRupee } from "lucide-react";
import { StudentProfileResponse } from "@/types/profile";
import { InternshipDetails } from "@/types/application";

const InternshipApplication = () => {
  const { internshipId } = useParams<{ internshipId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [internship, setInternship] = useState<InternshipDetails | null>(null);
  const [userProfile, setUserProfile] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
  const fetchInternshipDetails = useCallback(async () => {
    if (!internshipId) return;
    
    try {
      // Try to get from location state first (passed from dashboard)
      if (location.state?.internship) {
        setInternship(location.state.internship);
      } else {
        // Fallback: fetch from API
        const data = await apiService.getInternshipDetails(internshipId);
        setInternship(data);
      }
    } catch (error) {
      toast({
        title: "Failed to load internship",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [internshipId, location.state, navigate, toast]);
  
  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await apiService.getProfile();
      setUserProfile(profile);
    } catch (error) {
      toast({
        title: "Failed to load profile",
        description: "Profile required to apply",
        variant: "destructive",
      });
      // Redirect to login if unauthorized
      if (error instanceof Error && error.message.toLowerCase().includes("unauthorized")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);
  
  useEffect(() => {
    fetchInternshipDetails();
    fetchUserProfile();
  }, [fetchInternshipDetails, fetchUserProfile]);
  
  const handleDirectApply = () => {
    if (internship?.applyUrl) {
      window.open(internship.applyUrl, "_blank");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading internship details...</p>
        </div>
      </div>
    );
  }
  
  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Internship Not Found</CardTitle>
            <CardDescription>
              The internship you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="max-w-4xl mx-auto">
        {/* Internship Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{internship.title}</CardTitle>
                <CardDescription className="text-lg mt-2">{internship.company}</CardDescription>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {internship.location}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {internship.duration}
                  </Badge>
                  {internship.stipend && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {internship.stipend}/month
                    </Badge>
                  )}
                  {internship.isRemote && (
                    <Badge variant="secondary">Remote</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setShowApplicationModal(true)}
                  size="lg"
                  className="min-w-[200px]"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Apply Now
                </Button>
                {internship.applyUrl && (
                  <Button 
                    onClick={handleDirectApply}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Apply on Company Website
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Internship Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {internship.description}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Requirements */}
            {internship.requirements && internship.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {internship.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Required */}
            {internship.skills && internship.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Application Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Application Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-600">
                    Tailor your resume to match the required skills
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-600">
                    Write a compelling cover letter
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-600">
                    Ensure your profile is complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Application Modal */}
      {showApplicationModal && internship && userProfile && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          internship={internship}
          userProfile={userProfile}
          onSuccess={() => {
            toast({
              title: "Application Submitted",
              description: "Your application has been submitted successfully!",
              variant: "default",
            });
            setTimeout(() => navigate("/dashboard"), 2000);
          }}
        />
      )}
    </div>
  );
};

export default InternshipApplication;