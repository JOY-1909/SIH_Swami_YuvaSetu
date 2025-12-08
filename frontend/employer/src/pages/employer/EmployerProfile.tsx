import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendRequest } from "@/services/backend";
import { saveEmployerAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProfileFormState {
  organisationName: string;
  organisationType: string;
  industry: string;
  website: string;
  about: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

const emptyProfile: ProfileFormState = {
  organisationName: "",
  organisationType: "",
  industry: "",
  website: "",
  about: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
};

const EmployerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileFormState>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof ProfileFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await backendRequest<{
          organisationName: string;
          organisationType: string | null;
          industry: string | null;
          website: string | null;
          about: string | null;
          contactPerson: string | null;
          contactEmail: string | null;
          contactPhone: string | null;
          address: string | null;
          authProvider?: string | null;
        }>("/employer/profile", {
          method: "GET",
        });

        setForm({
          organisationName: data.organisationName || "",
          organisationType: data.organisationType || "",
          industry: data.industry || "",
          website: data.website || "",
          about: data.about || "",
          contactPerson: data.contactPerson || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          address: data.address || "",
        });
      } catch (err: any) {
        setError(
          err?.message || "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const validate = (): boolean => {
    const required: (keyof ProfileFormState)[] = [
      "organisationName",
      "organisationType",
      "industry",
      "about",
      "contactPerson",
      "contactEmail",
      "contactPhone",
      "address",
    ];

    for (const field of required) {
      const val = form[field];
      if (!val || val.trim() === "") {
        setError("Please fill all required fields marked with *.");
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.contactEmail)) {
      setError("Please enter a valid contact email address.");
      return false;
    }

    const phoneDigits = form.contactPhone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Contact phone must be exactly 10 digits.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        organisationName: form.organisationName.trim(),
        organisationType: form.organisationType.trim(),
        industry: form.industry.trim(),
        website: form.website.trim() || undefined,
        about: form.about.trim(),
        contactPerson: form.contactPerson.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        address: form.address.trim(),
      };

      const updated = await backendRequest<{
        organisationName: string;
        contactEmail: string;
        contactPerson: string;
      }>("/employer/profile?provider=password", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      // Important: update local session so navbar shows new name/initials
      saveEmployerAuth({
        organisationName: updated.organisationName,
        email: updated.contactEmail,
        contactPerson: updated.contactPerson,
      });

      navigate("/employer/dashboard");
    } catch (err: any) {
      setError(
        err?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Organisation Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and edit the details you provided while signing up.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/employer/dashboard")}
          >
            Back to dashboard
          </Button>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm px-5 py-6 md:px-6 md:py-7">
          {error && (
            <div className="text-xs md:text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="organisationName" className="text-xs">
                Organisation Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organisationName"
                value={form.organisationName}
                onChange={handleChange("organisationName")}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="organisationType" className="text-xs">
                Organisation Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.organisationType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, organisationType: value }))
                }
              >
                <SelectTrigger id="organisationType" className="text-sm">
                  <SelectValue placeholder="Select organisation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="ngo">NGO / Non-profit</SelectItem>
                  <SelectItem value="government">
                    Government Organization
                  </SelectItem>
                  <SelectItem value="education">
                    Educational Institution
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="industry" className="text-xs">
                Industry <span className="text-red-500">*</span>
              </Label>
              <Input
                id="industry"
                value={form.industry}
                onChange={handleChange("industry")}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-xs">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={form.website}
                onChange={handleChange("website")}
                placeholder="https://www.example.com"
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="about" className="text-xs">
                About Organisation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="about"
                value={form.about}
                onChange={handleChange("about")}
                rows={3}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPerson" className="text-xs">
                Contact Person Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactPerson"
                value={form.contactPerson}
                onChange={handleChange("contactPerson")}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactEmail" className="text-xs">
                Contact Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={handleChange("contactEmail")}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPhone" className="text-xs">
                Contact Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={handleChange("contactPhone")}
                pattern="\d{10}"
                maxLength={10}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs">
                Office Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={handleChange("address")}
                rows={2}
                className="text-sm"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-sm"
                onClick={() => navigate("/employer/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
