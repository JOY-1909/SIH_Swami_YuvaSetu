// src/pages/employer/NewInternship.tsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Save, X, Calendar, MapPin, AlertCircle } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { backendRequest, getVerificationStatus } from "@/services/backend";
import { getEmployerAuth } from "@/lib/auth";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import indiaLocations from "@/data/india-locations.json";

interface InternshipForm {
  organisationName: string;
  title: string;
  state: string;
  city: string;
  stipendOffered: "yes" | "no";
  stipendAmount: string;
  sector: string;
  dateRange: DateRange;
  description: string;
  responsibilities: string;
  requirements: string;
  perks: string;
  skills: string[];
  customSkill: string;
}

const initialForm: InternshipForm = {
  organisationName: "",
  title: "",
  state: "",
  city: "",
  stipendOffered: "no",
  stipendAmount: "",
  sector: "",
  dateRange: { from: undefined, to: undefined },
  description: "",
  responsibilities: "",
  requirements: "",
  perks: "",
  skills: [],
  customSkill: "",
};

export default function NewInternship() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const internshipId = searchParams.get("id");
  const isEditMode = Boolean(internshipId);

  // ✅ ADD VERIFICATION CHECK
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [checkingVerification, setCheckingVerification] = useState(true);

  // ✅ CHECK VERIFICATION ON MOUNT
  useEffect(() => {
    checkVerification();
  }, []);

  const checkVerification = async () => {
    try {
      const status = await getVerificationStatus();
      setVerificationStatus(status);
      
      if (!status.is_verified) {
        toast({
          title: 'Verification Required',
          description: 'Your account is pending admin verification.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/employer/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Failed to check verification:', error);
    } finally {
      setCheckingVerification(false);
    }
  };

  // Autofill organisation name from session (read-only)
  useEffect(() => {
    const auth = getEmployerAuth();
    if (auth && !formData.organisationName) {
      setFormData((prev) => ({
        ...prev,
        organisationName: auth.organisationName,
      }));
    }
  }, [formData.organisationName]);

  const handleChange = (field: keyof InternshipForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    const skill = formData.customSkill.trim();
    if (!skill) return;
    if (formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, customSkill: "" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
      customSkill: "",
    }));
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Load internship when editing (prefill all structured fields)
  useEffect(() => {
    if (!internshipId) return;

    const loadInternship = async () => {
      try {
        const data = await backendRequest<{
          id: string;
          organisation_name: string;
          title: string;
          description: string;
          responsibilities: string | null;
          requirements: string | null;
          perks: string | null;
          skills: string[] | null;
          location: string;
          state: string | null;
          city: string | null;
          stipend: string | null;
          sector: string | null;
          start_date: string | null;
          end_date: string | null;
          duration_days: number | null;
          duration_weeks: number | null;
          duration_months: number | null;
        }>(`/employer/internships/${internshipId}`, {
          method: "GET",
        });

        const stateVal = data.state || "";
        const cityVal =
          data.city ||
          (data.location
            ? (data.location.split(",")[0] || "").trim()
            : "");

        setFormData((prev) => ({
          ...prev,
          organisationName: data.organisation_name,
          title: data.title,
          description: data.description || "",
          responsibilities: data.responsibilities || "",
          requirements: data.requirements || "",
          perks: data.perks || "",
          skills: data.skills || [],
          customSkill: "",
          state: stateVal,
          city: cityVal,
          sector: data.sector || "",
          stipendOffered:
            data.stipend && data.stipend !== "No stipend" ? "yes" : "no",
          stipendAmount:
            data.stipend && data.stipend.startsWith("₹")
              ? data.stipend.replace(/[^\d]/g, "")
              : "",
          dateRange:
            data.start_date && data.end_date
              ? {
                  from: new Date(data.start_date),
                  to: new Date(data.end_date),
                }
              : { from: undefined, to: undefined },
        }));
      } catch (err: any) {
        console.error("Failed to load internship for edit", err);
        toast({
          title: "Error",
          description:
            err?.message || "Failed to load internship for editing.",
          variant: "destructive",
        });
      }
    };

    loadInternship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internshipId]);

  const validateForm = (): boolean => {
    if (!formData.organisationName.trim()) {
      toast({
        title: "Missing organisation name",
        description: "Organisation name is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter the internship title.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.state.trim()) {
      toast({
        title: "Missing state",
        description: "Please select the state.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.city.trim()) {
      toast({
        title: "Missing city",
        description: "Please select the city.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.sector.trim()) {
      toast({
        title: "Missing sector",
        description: "Please enter the sector or department.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.dateRange.from || !formData.dateRange.to) {
      toast({
        title: "Missing duration",
        description: "Please select a start and end date.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.stipendOffered === "yes" && !formData.stipendAmount.trim()) {
      toast({
        title: "Missing stipend amount",
        description: "Please enter the stipend amount.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Missing description",
        description: "Please provide an overview/description.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.responsibilities.trim()) {
      toast({
        title: "Missing responsibilities",
        description: "Please describe the responsibilities.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.requirements.trim()) {
      toast({
        title: "Missing requirements",
        description: "Please describe the requirements/eligibility.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.skills.length === 0) {
      toast({
        title: "Missing skills",
        description: "Please add at least one key skill.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const computeDuration = (from: Date, to: Date) => {
    const days = differenceInDays(to, from) + 1;
    const weeks = days / 7;
    const months = days / 30;
    return { days, weeks, months };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!formData.dateRange.from || !formData.dateRange.to) return;

    setIsSubmitting(true);
    try {
      const { from, to } = formData.dateRange;
      const duration = computeDuration(from!, to!);
      const fullLocation = `${formData.city}, ${formData.state}`;
      const stipendFinal =
        formData.stipendOffered === "yes"
          ? `₹${formData.stipendAmount.trim()}`
          : "No stipend";

      const url = isEditMode
        ? `/employer/internships/${internshipId}`
        : "/employer/internships";
      const method = isEditMode ? "PUT" : "POST";

      await backendRequest(url, {
        method,
        body: JSON.stringify({
          organisation_name: formData.organisationName,
          title: formData.title,
          description: formData.description,
          responsibilities: formData.responsibilities,
          requirements: formData.requirements,
          perks: formData.perks || null,
          skills: formData.skills,
          location: fullLocation,
          state: formData.state,
          city: formData.city,
          stipend: stipendFinal,
          sector: formData.sector,
          start_date: from!.toISOString(),
          end_date: to!.toISOString(),
          duration_days: duration.days,
          duration_weeks: duration.weeks,
          duration_months: duration.months,
        }),
      });

      toast({
        title: isEditMode ? "Internship updated" : "Internship created",
        description: isEditMode
          ? "Your internship has been updated successfully."
          : "Your internship has been posted successfully.",
      });

      navigate("/employer/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save internship.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ SHOW LOADING WHILE CHECKING
  if (checkingVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ BLOCK IF NOT VERIFIED
  if (!verificationStatus?.is_verified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <p className="font-semibold">Verification Required</p>
            <p className="text-sm mt-1">
              Your account is pending verification. You cannot post internships until approved.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => navigate('/employer/dashboard')}
            >
              Go to Dashboard
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ✅ FIX TYPESCRIPT ERROR
  const statesData: Record<string, string[]> = indiaLocations.reduce(
    (acc, item) => {
      acc[item.state] = item.cities;
      return acc;
    },
    {} as Record<string, string[]>
  );

  const cities =
    formData.state && statesData[formData.state] ? statesData[formData.state] : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edit Internship" : "Post New Internship"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update your internship details below"
            : "Fill in the details to create a new internship opportunity"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Name (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Organization Name</Label>
              <Input
                value={formData.organisationName}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                From your profile (read-only)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Internship Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Software Developer Intern"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="sector">Sector / Department *</Label>
              <Input
                id="sector"
                placeholder="e.g. Information Technology"
                value={formData.sector}
                onChange={(e) => handleChange("sector", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="state">State *</Label>
              <select
                id="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.state}
                onChange={(e) => {
                  handleChange("state", e.target.value);
                  handleChange("city", ""); // Reset city when state changes
                }}
                required
              >
                <option value="">Select State</option>
                {Object.keys(statesData).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <select
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={!formData.state}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Select Start and End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.dateRange.from && formData.dateRange.to ? (
                      <>
                        {format(formData.dateRange.from, "PPP")} -{" "}
                        {format(formData.dateRange.to, "PPP")}
                      </>
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DayPicker
                    mode="range"
                    selected={formData.dateRange}
                    onSelect={(range) =>
                      handleChange("dateRange", range || { from: undefined, to: undefined })
                    }
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
              {formData.dateRange.from && formData.dateRange.to && (
                <p className="text-sm text-gray-600 mt-2">
                  Duration:{" "}
                  {differenceInDays(formData.dateRange.to, formData.dateRange.from) + 1}{" "}
                  days
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stipend */}
        <Card>
          <CardHeader>
            <CardTitle>Stipend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Is Stipend Offered? *</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stipendOffered"
                    value="yes"
                    checked={formData.stipendOffered === "yes"}
                    onChange={(e) =>
                      handleChange("stipendOffered", e.target.value as "yes" | "no")
                    }
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stipendOffered"
                    value="no"
                    checked={formData.stipendOffered === "no"}
                    onChange={(e) =>
                      handleChange("stipendOffered", e.target.value as "yes" | "no")
                    }
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {formData.stipendOffered === "yes" && (
              <div>
                <Label htmlFor="stipendAmount">Stipend Amount (₹) *</Label>
                <Input
                  id="stipendAmount"
                  type="number"
                  placeholder="e.g. 15000"
                  value={formData.stipendAmount}
                  onChange={(e) => handleChange("stipendAmount", e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Overview / Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief overview of the internship..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="responsibilities">Responsibilities *</Label>
              <Textarea
                id="responsibilities"
                placeholder="Key responsibilities and tasks..."
                rows={4}
                value={formData.responsibilities}
                onChange={(e) =>
                  handleChange("responsibilities", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements / Eligibility *</Label>
              <Textarea
                id="requirements"
                placeholder="Required skills, qualifications, etc..."
                rows={4}
                value={formData.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="perks">Perks & Benefits (Optional)</Label>
              <Textarea
                id="perks"
                placeholder="Additional perks, learning opportunities, etc..."
                rows={3}
                value={formData.perks}
                onChange={(e) => handleChange("perks", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Add Skills *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Python, React, etc."
                  value={formData.customSkill}
                  onChange={(e) => handleChange("customSkill", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSkill}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/employer/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? "Updating..." : "Posting..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Update Internship" : "Post Internship"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
