// src/pages/employer/EmployerApplications.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { backendRequest } from "@/services/backend";
import { EmployerNavbar } from "@/components/employer/EmployerNavbar";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import { Mail, User, Phone, Download } from "lucide-react";

interface StudentDetails {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  full_name?: string | null;
}

interface Application {
  id: string;
  internship_id: string;
  student_uid: string;
  status: string; // "applied" | "under_review" | "shortlisted" | "rejected" | "selected"
  student_details?: StudentDetails | null;
}

export default function EmployerApplications() {
  const { id } = useParams<{ id: string }>(); // internship_id
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await backendRequest<Application[]>(
          `/employer/internships/${id}/applications`,
          { method: "GET" }
        );
        setApplications(data || []);
      } catch (err: any) {
        toast({
          title: "Error",
          description:
            err?.message || "Failed to load applications for this internship.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "applied":
        return "secondary";
      case "under_review":
        return "default";
      case "shortlisted":
        return "default";
      case "selected":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "selected":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      const updated = await backendRequest<Application>(
        `/employer/applications/${appId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? updated : a))
      );
      toast({
        title: "Status updated",
        description: `Application status changed to ${formatStatus(newStatus)}.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.message || "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EmployerNavbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Applicants
            </h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Applications for this Internship
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-500">Loading applications...</p>
              ) : applications.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">
                  No applications have been received yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                        <th className="py-2 pr-4 font-medium">Applicant</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 pr-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => {
                        const studentName = app.student_details?.full_name || 
                                          app.student_details?.name || 
                                          app.student_uid;
                        const studentEmail = app.student_details?.email;
                        const studentPhone = app.student_details?.phone;
                        
                        return (
                          <tr
                            key={app.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                          >
                            <td className="py-4 pr-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-slate-500" />
                                  <span className="font-medium text-slate-900">
                                    {studentName}
                                  </span>
                                </div>
                                {studentEmail && (
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Mail className="h-3 w-3" />
                                    <span>{studentEmail}</span>
                                  </div>
                                )}
                                {studentPhone && (
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Phone className="h-3 w-3" />
                                    <span>{studentPhone}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 pr-4">
                              <Badge 
                                className={`${getStatusColor(app.status)} border-0`}
                                variant={getStatusBadgeVariant(app.status)}
                              >
                                {formatStatus(app.status)}
                              </Badge>
                            </td>
                            <td className="py-4 pr-4">
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem('employer_token');
                                      const response = await fetch(
                                        `${import.meta.env.VITE_EMPLOYER_API_URL || 'http://127.0.0.1:8000'}/employer/applications/${app.id}/resume`,
                                        {
                                          method: 'GET',
                                          headers: {
                                            'Authorization': `Bearer ${token}`,
                                          },
                                        }
                                      );
                                      
                                      if (!response.ok) {
                                        throw new Error('Failed to download resume');
                                      }
                                      
                                      const blob = await response.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      const studentName = app.student_details?.full_name || app.student_details?.name || 'student';
                                      a.download = `resume_${studentName.replace(/\s+/g, '_')}.pdf`;
                                      document.body.appendChild(a);
                                      a.click();
                                      window.URL.revokeObjectURL(url);
                                      document.body.removeChild(a);
                                      
                                      toast({
                                        title: "Resume Downloaded",
                                        description: "Student resume has been downloaded successfully.",
                                      });
                                    } catch (err: any) {
                                      toast({
                                        title: "Error",
                                        description: err?.message || "Failed to download resume.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Resume
                                </Button>
                                {app.status !== "under_review" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[11px]"
                                    onClick={() =>
                                      updateStatus(app.id, "under_review")
                                    }
                                  >
                                    Under review
                                  </Button>
                                )}
                                {app.status !== "shortlisted" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[11px]"
                                    onClick={() =>
                                      updateStatus(app.id, "shortlisted")
                                    }
                                  >
                                    Shortlist
                                  </Button>
                                )}
                                {app.status !== "selected" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[11px]"
                                    onClick={() =>
                                      updateStatus(app.id, "selected")
                                    }
                                  >
                                    Select
                                  </Button>
                                )}
                                {app.status !== "rejected" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[11px] text-red-600 border-red-200 hover:border-red-300"
                                    onClick={() =>
                                      updateStatus(app.id, "rejected")
                                    }
                                  >
                                    Reject
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <EmployerFooter />
    </div>
  );
}
