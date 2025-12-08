import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmployerNavbar } from "@/components/employer/EmployerNavbar";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import { ArrowLeft, Eye, Download, Star } from "lucide-react";

interface Application {
  id: string;
  candidateName: string;
  appliedOn: string;
  status: "submitted" | "under_review" | "interview" | "selected" | "rejected";
  resumeScore: number;
  resumeUrl?: string;
}

export default function InternshipDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const internship = {
    title: "Software Development Intern",
    organisation: "Demo Organisation",
    sector: "Technology",
    location: "Delhi",
    mode: "Hybrid",
    status: "active",
    description: "Work on real-world projects and gain hands-on experience...",
  };

  const applications: Application[] = [
    { id: "1", candidateName: "Rahul Sharma", appliedOn: "2024-01-20", status: "submitted" as const, resumeScore: 95, resumeUrl: "#" },
    { id: "2", candidateName: "Priya Patel", appliedOn: "2024-01-19", status: "under_review" as const, resumeScore: 88, resumeUrl: "#" },
    { id: "3", candidateName: "Amit Kumar", appliedOn: "2024-01-18", status: "interview" as const, resumeScore: 82, resumeUrl: "#" },
  ].sort((a, b) => b.resumeScore - a.resumeScore);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-chip-blue-bg text-chip-blue-text";
      case "under_review":
        return "bg-chip-orange-bg text-chip-orange-text";
      case "interview":
        return "bg-chip-orange-bg text-chip-orange-text";
      case "selected":
        return "bg-chip-green-bg text-chip-green-text";
      case "rejected":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <EmployerNavbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/employer/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Internship Summary Card */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {internship.title}
              </h1>
              <p className="text-muted-foreground">{internship.organisation}</p>
            </div>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-chip-green-bg text-chip-green-text">
              {internship.status}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Sector:</span>
              <span className="ml-2 text-foreground font-medium">{internship.sector}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>
              <span className="ml-2 text-foreground font-medium">{internship.location}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mode:</span>
              <span className="ml-2 text-foreground font-medium">{internship.mode}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{internship.description}</p>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-xl border border-border shadow-sm">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Applications</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {applications.length} candidates have applied
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Candidate Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Resume Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Applied On
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Current Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-border hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {application.candidateName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="text-sm font-semibold text-accent">
                          {application.resumeScore}
                        </span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {application.appliedOn}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(application.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:text-primary-hover"
                          onClick={() =>
                            navigate(`/employer/applications/${application.id}`)
                          }
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-foreground hover:bg-slate-50"
                          onClick={() => {
                            // Mock download - in real app would download actual resume
                            window.open(application.resumeUrl || "#", "_blank");
                          }}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Resume
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EmployerFooter />
    </div>
  );
}
