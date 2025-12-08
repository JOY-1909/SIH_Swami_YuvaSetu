import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";
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
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type ProviderType = "password" | "google";

interface SignupFormState {
  organisationName: string;
  organisationType: string;
  industry: string;
  website: string;
  about: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  email: string;
  password: string;
}

const initialForm: SignupFormState = {
  organisationName: "",
  organisationType: "",
  industry: "",
  website: "",
  about: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  email: "",
  password: "",
};

const EmployerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<ProviderType>("password");
  const [error, setError] = useState<string | null>(null);
  const [googleStepDone, setGoogleStepDone] = useState(false);

  const handleChange =
    (field: keyof SignupFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validateProfileFields = (): boolean => {
    const requiredFields: (keyof SignupFormState)[] = [
      "organisationName",
      "organisationType",
      "industry",
      "about",
      "contactPerson",
      "contactEmail",
      "contactPhone",
      "address",
    ];

    for (const field of requiredFields) {
      const val = form[field];
      if (!val || (typeof val === "string" && val.trim() === "")) {
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

  const validatePasswordLoginFields = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid login email address.");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const createOrUpdateProfile = async (providerType: ProviderType) => {
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

    const profile = await backendRequest<{
      organisationName: string;
      contactEmail: string;
      contactPerson: string;
    }>("/employer/profile?provider=" + providerType, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    saveEmployerAuth({
      organisationName: profile.organisationName,
      email: profile.contactEmail,
      contactPerson: profile.contactPerson,
    });

    navigate("/employer/dashboard");
  };

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvider("password");

    if (!validateProfileFields() || !validatePasswordLoginFields()) return;

    try {
      setLoading(true);
      setError(null);

      const email = form.email.trim().toLowerCase();
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        if (methods.includes("google.com") || methods.includes("google")) {
          setError(
            "This email is already registered with Google. Please continue with Google to log in."
          );
        } else {
          setError(
            "This email is already registered. Please log in with your password or use a different email."
          );
        }
        setLoading(false);
        return;
      }

      await createUserWithEmailAndPassword(auth, email, form.password);
      await createOrUpdateProfile("password");
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setProvider("google");
    setError(null);

    try {
      setLoading(true);

      // Email of whoever is currently signed in (e.g. email/password signup)
      const existingEmail = auth.currentUser?.email
        ? auth.currentUser.email.trim().toLowerCase()
        : null;

      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email) {
        await signOut(auth);
        setError(
          "Google account has no email associated. Please use another account."
        );
        setLoading(false);
        return;
      }

      const googleEmail = user.email.trim().toLowerCase();

      // 1) If this exact email matches the already-signed-in email → block
      if (existingEmail && existingEmail === googleEmail) {
        await signOut(auth);
        setError(
          "This email is already registered with email/password. Please log in instead of signing up with Google."
        );
        setLoading(false);
        return;
      }

      // 2) Also check in Firebase Auth if this email has any methods
      const methods = await fetchSignInMethodsForEmail(auth, googleEmail);
      console.log("Google signup methods for", googleEmail, methods);

      if (methods.length > 0) {
        await signOut(auth);
        setError(
          "This email is already registered. Please log in instead of signing up again."
        );
        setLoading(false);
        return;
      }

      // Treat as fresh Google signup
      setForm((prev) => ({
        ...prev,
        contactEmail: prev.contactEmail || googleEmail,
        email: googleEmail,
        password: "",
      }));

      setGoogleStepDone(true);
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google signup was cancelled. Please try again.");
      } else {
        setError(err.message || "Failed to sign up with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileFields()) return;

    try {
      setLoading(true);
      setError(null);
      await createOrUpdateProfile("google");
    } catch (err: any) {
      setError(err.message || "Failed to complete signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    navigate(-1);
  };

  const isGoogleMode = provider === "google" && googleStepDone;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-[1.15fr,1.1fr] gap-8 items-stretch">
          {/* Left: Hero / branding (light) */}
          <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-sky-50 to-white p-[1px] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="h-full rounded-2xl bg-white px-6 py-6 md:px-8 md:py-8 flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center text-xs md:text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>

                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-indigo-700 mb-4">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Trusted employer network
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                  Join the mission to{" "}
                  <span className="text-indigo-600">empower youth</span>
                </h1>
                <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed">
                  Connect with motivated students across India, offer meaningful
                  internships, and build your future talent pipeline through
                  the Yuva Setu employer portal.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="inline-flex items-center gap-2 text-slate-900">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">
                        For forward-thinking orgs
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      Build your brand among students while collaborating on
                      real projects.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="inline-flex items-center gap-2 text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">
                        Guided, secure onboarding
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      Verified employers, clear flows, and transparent
                      communication with student talent.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Easy onboarding
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Student-ready postings
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Built for India
                </div>
              </div>
            </div>
          </div>

          {/* Right: Signup card (light) */}
          <div className="h-full">
            <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-lg px-5 py-6 md:px-6 md:py-7 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Employer Sign Up
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Create your organisation profile and start posting
                    opportunities.
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 text-right">
                  <span className="font-medium text-slate-800">
                    Step {isGoogleMode ? "2" : "1"} of 2
                  </span>
                  <div>
                    {isGoogleMode ? "Complete profile" : "Choose sign-in method"}
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-xs md:text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                <form
                  className="space-y-4"
                  onSubmit={
                    isGoogleMode ? handleGoogleProfileSubmit : handlePasswordSignup
                  }
                >
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

                  {!isGoogleMode && (
                    <div className="grid md:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs">
                          Login Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange("email")}
                          className="text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange("password")}
                          className="text-sm"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full mt-1 inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
                    disabled={loading}
                  >
                    {loading
                      ? isGoogleMode
                        ? "Saving profile..."
                        : "Creating account..."
                      : isGoogleMode
                      ? "Complete Signup"
                      : "Sign Up with Email"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>

                {!isGoogleMode && (
                  <>
                    <div className="relative py-3">
                      <div className="border-t border-slate-200" />
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Or continue with
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm inline-flex items-center justify-center gap-2"
                      onClick={handleGoogleSignup}
                      disabled={loading}
                    >
                      {loading && provider === "google"
                        ? "Connecting to Google..."
                        : "Continue with Google"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
