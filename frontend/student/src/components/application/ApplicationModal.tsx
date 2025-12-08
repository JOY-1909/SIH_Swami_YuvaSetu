// File: frontend/src/components/application/ApplicationModal.tsx
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  X, 
  Check, 
  AlertCircle,
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";
import { StudentProfileResponse } from "@/types/profile";
import { ResumeFile } from "@/types/application";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: {
    id: string;
    title: string;
    company: string;
    location: string;
    stipend?: number;
    duration: string;
    applyUrl?: string;
  };
  userProfile: StudentProfileResponse | null;
  onSuccess?: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  internship,
  userProfile,
  onSuccess
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("profile");
  const [customResume, setCustomResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataSharingConsent, setDataSharingConsent] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
    }
  }, [isOpen]);

  const fetchResumes = async () => {
    try {
      const data = await apiService.getResumes();
      setResumes(data);
      if (data.length > 0) {
        const defaultResume = data.find(r => r.isDefault);
        if (defaultResume) {
          setSelectedResume(defaultResume.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type and size
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF or Word documents only",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setCustomResume(file);
      setSelectedResume("upload");
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await apiService.uploadResume(file);
      setUploading(false);
      setUploadProgress(100);
      return result.url;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let resumeUrl = "";
      
      // Handle resume selection
      if (selectedResume === "upload" && customResume) {
        resumeUrl = await uploadResume(customResume);
      } else if (selectedResume === "profile") {
        // Use default profile resume URL
        const defaultResume = resumes.find(r => r.isDefault);
        resumeUrl = defaultResume?.url || "";
      } else {
        // Use selected existing resume
        const selected = resumes.find(r => r.id === selectedResume);
        resumeUrl = selected?.url || "";
      }

      if (!resumeUrl) {
        throw new Error("No resume selected");
      }

      // Submit application
      const applicationData = {
        internshipId: internship.id,
        coverLetter: coverLetter || undefined,
        resumeUrl,
        termsAccepted,
        dataSharingConsent
      };

      await apiService.submitApplication(applicationData);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
        variant: "default",
      });
      
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Internship Summary */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{internship.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {internship.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {internship.location}
                      </span>
                      {internship.stipend && (
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {internship.stipend}/month
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {internship.duration}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Resume Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Resume Selection
                </CardTitle>
                <CardDescription>
                  Choose a resume to submit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing Resumes */}
                {resumes.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Your Resumes</Label>
                    <RadioGroup 
                      value={selectedResume} 
                      onValueChange={setSelectedResume}
                      className="space-y-2"
                    >
                      {resumes.map((resume) => (
                        <div key={resume.id} className="flex items-center space-x-3">
                          <RadioGroupItem value={resume.id} id={`resume-${resume.id}`} />
                          <Label 
                            htmlFor={`resume-${resume.id}`} 
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p className="font-medium">{resume.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(resume.createdAt).toLocaleDateString()}
                                    {resume.isDefault && " • Default"}
                                  </p>
                                </div>
                              </div>
                              {selectedResume === resume.id && (
                                <Badge variant="outline">
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Upload New Resume */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Upload New Resume
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <Label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600 mb-2">
                        Drag and drop or
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        PDF, DOC, DOCX up to 5MB
                      </div>
                      <Button variant="outline">
                        Browse files
                      </Button>
                    </Label>
                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    {customResume && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-sm">{customResume.name}</p>
                              <p className="text-xs text-green-600">
                                {(customResume.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCustomResume(null);
                              if (resumes.length > 0) {
                                setSelectedResume(resumes[0].id);
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {uploading && (
                          <div className="mt-3">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-center mt-1">
                              {uploadProgress}% uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Shield className="h-4 w-4 mr-2" />
                    Your resume will only be shared with the employer
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Cover Letter
                </CardTitle>
                <CardDescription>
                  Optional: Add a cover letter to your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're a great fit for this internship..."
                  className="min-h-[200px]"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Keep it concise (200-500 words recommended)
                </div>
              </CardContent>
            </Card>
            
            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Review & Submit
                </CardTitle>
                <CardDescription>
                  Review your application before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Internship
                    </span>
                    <span className="font-medium">{internship.title}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Company
                    </span>
                    <span className="font-medium">{internship.company}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Resume Used
                    </span>
                    <span className="font-medium">
                      {selectedResume === "upload" 
                        ? "Uploaded Resume"
                        : selectedResume === "profile"
                        ? "Profile Resume"
                        : "Generated Resume"}
                    </span>
                  </div>
                </div>
                
                {/* Terms Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-tight">
                      I agree to the terms and conditions
                      <a href="/terms" className="text-blue-600 hover:underline ml-1">
                        Terms & Conditions
                      </a>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="data-sharing"
                      checked={dataSharingConsent}
                      onCheckedChange={(checked) => setDataSharingConsent(checked as boolean)}
                    />
                    <Label htmlFor="data-sharing" className="text-sm leading-tight">
                      I consent to sharing my profile information with the employer
                    </Label>
                  </div>
                </div>
                
                {/* Important Note */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">
                        Important Note
                      </p>
                      <p className="mt-1">
                        Once submitted, your application cannot be edited. Make sure all information is correct.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {internship.title}
          </DialogTitle>
          <DialogDescription>
            Step {step} of 2
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Bar */}
        <div className="px-4">
          <Progress value={(step / 2) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={step >= 1 ? "font-medium text-blue-600" : ""}>
              Resume
            </span>
            <span className={step >= 2 ? "font-medium text-blue-600" : ""}>
              Submit
            </span>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="mt-4">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <DialogFooter className="flex justify-between mt-6">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} disabled={loading}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 2 ? (
              <Button onClick={nextStep} disabled={!selectedResume || loading}>
                Continue
              </Button>
            ) : (
              <Button onClick={nextStep} disabled={!termsAccepted || loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;