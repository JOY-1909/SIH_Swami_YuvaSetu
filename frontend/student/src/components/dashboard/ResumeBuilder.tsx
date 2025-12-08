import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResumeBuilderProps {
  onClose: () => void;
}

export const ResumeBuilder = ({ onClose }: ResumeBuilderProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    careerObjective: "",
    education: "",
    workExperience: "",
    skills: "",
    projects: "",
    training: "",
    achievements: "",
    hobbies: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate file parsing
    setTimeout(() => {
      setResumeData({
        fullName: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 9876543210",
        linkedin: "linkedin.com/in/priyasharma",
        careerObjective: "Aspiring software developer seeking internship opportunities to apply my skills in real-world projects",
        education: "BTech Computer Science, IIT Delhi (2020-2024)",
        workExperience: "Intern at Tech Solutions (Summer 2023)",
        skills: "React, Node.js, Python, SQL, Git",
        projects: "E-commerce Platform, Task Management App",
        training: "Full Stack Development Bootcamp",
        achievements: "First Prize in National Hackathon 2023",
        hobbies: "Coding, Reading, Photography",
      });
      
      setUploading(false);
      toast({
        title: "Resume Parsed Successfully! 📄",
        description: "Your resume has been auto-filled. Please review and save.",
      });
    }, 2000);
  };

  const handleSave = () => {
    toast({
      title: "Resume Saved! ✅",
      description: "Your profile has been updated successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Resume Builder</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  PDF, DOC, or DOCX (Max 5MB)
                </p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                />
              </div>

              {uploading && (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-4 text-muted-foreground">Parsing your resume...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="mt-4 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={resumeData.fullName}
                    onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="careerObjective">Career Objective</Label>
                <Textarea
                  id="careerObjective"
                  value={resumeData.careerObjective}
                  onChange={(e) => setResumeData({ ...resumeData, careerObjective: e.target.value })}
                  placeholder="Brief description of your career goals..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education *</Label>
                <Textarea
                  id="education"
                  value={resumeData.education}
                  onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })}
                  placeholder="Degree, Institution, Year, CGPA..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workExperience">Work Experience</Label>
                <Textarea
                  id="workExperience"
                  value={resumeData.workExperience}
                  onChange={(e) => setResumeData({ ...resumeData, workExperience: e.target.value })}
                  placeholder="Company, Role, Duration, Responsibilities..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills *</Label>
                <Textarea
                  id="skills"
                  value={resumeData.skills}
                  onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                  placeholder="List your technical and soft skills..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects">Projects</Label>
                <Textarea
                  id="projects"
                  value={resumeData.projects}
                  onChange={(e) => setResumeData({ ...resumeData, projects: e.target.value })}
                  placeholder="Project name, description, technologies used..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="training">Training & Certifications</Label>
                <Textarea
                  id="training"
                  value={resumeData.training}
                  onChange={(e) => setResumeData({ ...resumeData, training: e.target.value })}
                  placeholder="Courses, certifications, workshops..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={resumeData.achievements}
                  onChange={(e) => setResumeData({ ...resumeData, achievements: e.target.value })}
                  placeholder="Awards, recognitions, competitions..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies & Interests</Label>
                <Textarea
                  id="hobbies"
                  value={resumeData.hobbies}
                  onChange={(e) => setResumeData({ ...resumeData, hobbies: e.target.value })}
                  placeholder="Your interests and hobbies..."
                  rows={2}
                />
              </div>

              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Custom Field
              </Button>
            </TabsContent>

            <TabsContent value="import" className="mt-4">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Import from LinkedIn</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Connect your LinkedIn account to auto-fill your profile
                </p>
                <Button className="btn-3d">
                  Connect LinkedIn
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 btn-3d gap-2">
            <Save className="h-4 w-4" />
            Save Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
