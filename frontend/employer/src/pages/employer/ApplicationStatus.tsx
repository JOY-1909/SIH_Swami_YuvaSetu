// src/pages/employer/ApplicationStatus.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmployerNavbar } from "@/components/employer/EmployerNavbar";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { backendRequest } from "@/services/backend";

type ApplicationStatusType =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "selected"
  | "rejected";

interface TimelineStep {
  id: ApplicationStatusType;
  label: string;
  description: string;
}

interface ApplicationData {
  id: string;
  internship_id: string;
  student_uid: string;
  status: string;
}

const timelineSteps: TimelineStep[] = [
  {
    id: "applied",
    label: "Application Submitted",
    description: "Candidate has submitted their application.",
  },
  {
    id: "under_review",
    label: "Application Under Review",
    description: "Your team is reviewing the application.",
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
    description: "Candidate is shortlisted for next steps.",
  },
  {
    id: "interview",
    label: "Interview / Assessment Scheduled",
    description: "Candidate is scheduled for interview or assessment.",
  },
  {
    id: "selected",
    label: "Selected",
    description: "Candidate has been selected.",
  },
  {
    id: "rejected",
    label: "Rejected",
    description: "Candidate has been rejected.",
  },
];

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // app_id

  const [currentStatus, setCurrentStatus] =
    useState<ApplicationStatusType>("under_review");
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load application details
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await backendRequest<ApplicationData>(
          `/employer/applications/${id}`,
          { method: "GET" }
        );
        setApplication(data);
        setCurrentStatus(data.status as ApplicationStatusType);
      } catch (err: any) {
        toast.error(
          err?.message || "Failed to load application details."
        );
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex((step) => step.id === currentStatus);
  };

  const handleStatusChange = async (newStatus: ApplicationStatusType) => {
    if (!id) return;
    try {
      setUpdating(true);
      setCurrentStatus(newStatus);
      const updated = await backendRequest<ApplicationData>(
        `/employer/applications/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      setApplication(updated);
      toast.success("Application status updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update application status.");
    } finally {
      setUpdating(false);
    }
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EmployerNavbar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-xs text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                  Application Status
                </h1>
                {application && (
                  <p className="text-xs text-slate-500 mt-1">
                    Application ID: {application.id} · Candidate UID:{" "}
                    {application.student_uid}
                  </p>
                )}
              </div>
              <div className="text-xs">
                <span className="font-medium text-slate-600">
                  Current Status:{" "}
                </span>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {
                    timelineSteps.find((s) => s.id === currentStatus)
                      ?.label
                  }
                </span>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading application...</p>
            ) : (
              <>
                {/* Timeline */}
                <div className="mt-4 mb-6">
                  <div className="relative">
                    {timelineSteps.map((step, index) => {
                      const isCompleted = index < currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div
                          key={step.id}
                          className="flex items-start gap-3 mb-4 last:mb-0"
                        >
                          {/* Left: timeline line + circle */}
                          <div className="flex flex-col items-center">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle
                                className={`w-4 h-4 ${
                                  isCurrent
                                    ? "text-indigo-500"
                                    : "text-slate-300"
                                }`}
                              />
                            )}
                            {index < timelineSteps.length - 1 && (
                              <div
                                className={`w-px flex-1 ${
                                  isCompleted
                                    ? "bg-emerald-300"
                                    : "bg-slate-200"
                                }`}
                              />
                            )}
                          </div>

                          {/* Right: details */}
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-800">
                              {step.label}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Control */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <Label className="text-xs mb-1 block">
                    Update Application Status
                  </Label>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <Select
                      value={currentStatus}
                      onValueChange={(value) =>
                        handleStatusChange(value as ApplicationStatusType)
                      }
                      disabled={updating}
                    >
                      <SelectTrigger className="w-full md:w-64 h-8 text-xs">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">
                          Application Submitted
                        </SelectItem>
                        <SelectItem value="under_review">
                          Under Review
                        </SelectItem>
                        <SelectItem value="shortlisted">
                          Shortlisted
                        </SelectItem>
                        <SelectItem value="interview">
                          Interview Scheduled
                        </SelectItem>
                        <SelectItem value="selected">
                          Selected
                        </SelectItem>
                        <SelectItem value="rejected">
                          Rejected
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-slate-500">
                      Changes to the application status will be visible to
                      the student in real-time.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <EmployerFooter />
    </div>
  );
}
