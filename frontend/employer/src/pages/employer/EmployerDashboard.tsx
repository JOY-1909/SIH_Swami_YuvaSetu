// src/pages/employer/EmployerDashboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Plus, Trash2, Edit3, Users, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { EmployerNavbar } from "@/components/employer/EmployerNavbar";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { backendRequest, getVerificationStatus } from "@/services/backend";
import { useToast } from "@/hooks/use-toast";

interface Internship {
  id: string;
  title: string;
  location: string;
  is_active: boolean;
  sector?: string | null;
}

// ✅ ADD THIS INTERFACE
interface VerificationStatus {
  has_profile: boolean;
  is_verified: boolean;
  organisation_name?: string;
  message: string;
}

export default function EmployerDashboard() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // ✅ ADD THIS STATE
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);

  const loadInternships = async () => {
    try {
      setLoading(true);
      
      // ✅ ADD VERIFICATION CHECK
      const status = await getVerificationStatus();
      setVerificationStatus(status);
      
      const data = await backendRequest<Internship[]>("/employer/internships", {
        method: "GET",
      });
      setInternships(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.message || "Failed to load internships. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCount = internships.filter((i) => i.is_active).length;
  const closedCount = internships.filter((i) => !i.is_active).length;

  const handleCreateNew = () => {
    navigate("/employer/internships/new");
  };

  const handleEditInternship = (id: string) => {
    navigate(`/employer/internships/new?id=${id}`);
  };

  const handleViewApplicants = (id: string) => {
    navigate(`/employer/internships/${id}/applications`);
  };

  const handleCloseInternship = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to close this internship? You will no longer receive new applications."
    );
    if (!confirm) return;

    try {
      await backendRequest(`/employer/internships/${id}/close`, {
        method: "POST",
      });
      setInternships((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_active: false } : i))
      );
      toast({
        title: "Internship closed",
        description: "The internship has been marked as closed.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.message || "Failed to close internship. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInternship = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this internship? This cannot be undone."
    );
    if (!confirm) return;

    try {
      setDeletingId(id);
      await backendRequest(`/employer/internships/${id}`, {
        method: "DELETE",
      });
      setInternships((prev) => prev.filter((i) => i.id !== id));
      toast({
        title: "Internship deleted",
        description: "The internship has been removed.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.message || "Failed to delete internship. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EmployerNavbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* ✅ ADD VERIFICATION ALERTS HERE - BEFORE HEADER */}
          {verificationStatus && !verificationStatus.is_verified && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Verification Pending</p>
                    <p className="text-sm mt-1">
                      Your account is under review. You cannot post internships until verified by admin.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadInternships}
                    className="ml-4 text-xs"
                  >
                    Refresh
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {verificationStatus && verificationStatus.is_verified && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <p className="font-semibold">Account Verified ✓</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Employer Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your internships and track student applications.
              </p>
            </div>
            <Button
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-sm"
              onClick={handleCreateNew}
              disabled={!verificationStatus?.is_verified} // ✅ DISABLE IF NOT VERIFIED
            >
              <Plus className="w-4 h-4" />
              Post New Internship
            </Button>
          </div>

          {/* Stats cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">
                    Active Internships
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {activeCount}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Briefcase className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">
                    Closed Positions
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {closedCount}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <FileText className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.12em]">
                    Total Listings
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {internships.length}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                  <Users className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your internships table */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base md:text-lg">Your Internships</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-500">Loading internships...</p>
              ) : internships.length === 0 ? (
                <div className="py-6 text-sm text-slate-500">
                  You have not posted any internships yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                        <th className="py-2 pr-4 font-medium">Title</th>
                        <th className="py-2 pr-4 font-medium">Location</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 pr-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internships.map((internship) => (
                        <tr
                          key={internship.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="py-2 pr-4 text-slate-900">
                            {internship.title}
                          </td>
                          <td className="py-2 pr-4 text-slate-700">
                            {internship.location}
                          </td>
                          <td className="py-2 pr-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                internship.is_active
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {internship.is_active ? "Active" : "Closed"}
                            </span>
                          </td>
                          <td className="py-2 pr-4">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[11px]"
                                onClick={() => handleViewApplicants(internship.id)}
                              >
                                <Users className="w-3 h-3 mr-1" />
                                Applicants
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[11px]"
                                onClick={() => handleEditInternship(internship.id)}
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              {internship.is_active ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={() => handleCloseInternship(internship.id)}
                                >
                                  Close
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-[11px] text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                  onClick={() => handleDeleteInternship(internship.id)}
                                  disabled={deletingId === internship.id}
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  {deletingId === internship.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
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
