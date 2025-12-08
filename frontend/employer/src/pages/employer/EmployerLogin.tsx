import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { backendRequest } from "@/services/backend";
import { saveEmployerAuth, clearEmployerAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EmployerLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);

  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const validateEmailPassword = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setError(null);
    return true;
  };

  const fetchAndStoreProfile = async (): Promise<boolean> => {
    try {
      const profile = await backendRequest<{
        organisationName: string;
        contactEmail: string;
        contactPerson: string;
      }>("/employer/profile", {
        method: "GET",
      });

      // Check if profile actually has data (not auto-created empty)
      if (!profile.organisationName || profile.organisationName.trim() === "") {
        clearEmployerAuth();
        return false; // No real profile
      }

      saveEmployerAuth({
        organisationName: profile.organisationName,
        email: profile.contactEmail,
        contactPerson: profile.contactPerson,
      });

      return true; // Profile exists
    } catch {
      clearEmployerAuth();
      return false; // Error or no profile
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailPassword()) return;

    try {
      setLoading(true);
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const hasProfile = await fetchAndStoreProfile();
      if (!hasProfile) {
        // Delete the Firebase user account so signup can work
        await userCredential.user.delete();
        setShowSignupPrompt(true);
        setLoading(false);
        return;
      }

      navigate("/employer/dashboard");
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up first.");
      } else if (err?.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err?.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        await user.delete();
        setError(
          "Google account has no email associated. Please use another account."
        );
        setLoading(false);
        return;
      }

      const hasProfile = await fetchAndStoreProfile();
      if (!hasProfile) {
        // Delete the Firebase user account so signup can work
        await user.delete();
        setShowSignupPrompt(true);
        setLoading(false);
        return;
      }

      navigate("/employer/dashboard");
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google login was cancelled. Please try again.");
      } else {
        setError(err.message || "Failed to log in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(null);
    setError(null);

    const targetEmail =
      resetEmail.trim().toLowerCase() || email.trim().toLowerCase();

    if (!targetEmail) {
      setResetMessage("Please enter your email to reset the password.");
      return;
    }

    try {
      setSendingReset(true);
      await sendPasswordResetEmail(auth, targetEmail);
      setResetMessage("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        setResetMessage("No account found with this email address.");
      } else if (err?.code === "auth/invalid-email") {
        setResetMessage("Please enter a valid email address.");
      } else {
        setResetMessage(
          err.message || "Failed to send reset email. Please try again."
        );
      }
    } finally {
      setSendingReset(false);
    }
  };

  const onBack = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Signup Prompt Dialog */}
      <AlertDialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <AlertDialogTitle className="text-xl">
                Please Sign Up First
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base leading-relaxed">
              You need to complete the signup process before you can access the
              employer portal. Please create your account to start posting
              internships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSignupPrompt(false);
                navigate("/employer/signup");
              }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-[1.15fr,1.1fr] gap-8 items-stretch">
          {/* Left: Hero / branding */}
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
                  Employer portal
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                  Welcome back to{" "}
                  <span className="text-indigo-600">Yuva Setu</span>
                </h1>
                <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed">
                  Log in to manage your internships, review student
                  applications, and stay connected with emerging talent across
                  India.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="inline-flex items-center gap-2 text-slate-900">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">Manage opportunities</span>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      Post roles, track applications, and communicate with
                      candidates.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="inline-flex items-center gap-2 text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">Secure access</span>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      Protected login for verified employers and their teams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Real-time updates
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Student insights
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Built for India
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login card */}
          <div className="h-full">
            <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-lg px-5 py-6 md:px-6 md:py-7 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Employer Login
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Access your dashboard and manage your organisation profile.
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 text-right">
                  <span className="font-medium text-slate-800">
                    Returning user
                  </span>
                  <div>Use email or Google</div>
                </div>
              </div>

              {error && (
                <div className="text-xs md:text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                <form className="space-y-4" onSubmit={handleEmailLogin}>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-sm"
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReset(true);
                        setResetEmail(email);
                        setResetMessage(null);
                      }}
                      className="text-indigo-600 hover:text-indigo-500 underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </button>

                    <span className="text-slate-500">
                      New here?{" "}
                      <Link
                        to="/employer/signup"
                        className="text-indigo-600 hover:text-indigo-500 underline-offset-2 hover:underline"
                      >
                        Create an account
                      </Link>
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-1 inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In with Email"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>

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
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  {loading
                    ? "Connecting to Google..."
                    : "Continue with Google"}
                </Button>

                {/* Inline forgot-password prompt */}
                {showReset && (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-700">
                        Reset password
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReset(false);
                          setResetMessage(null);
                        }}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Close
                      </button>
                    </div>

                    <form className="space-y-2" onSubmit={handleForgotPassword}>
                      <Input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="text-sm"
                        required
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="text-xs bg-indigo-600 hover:bg-indigo-500"
                        disabled={sendingReset}
                      >
                        {sendingReset ? "Sending..." : "Send reset link"}
                      </Button>
                    </form>

                    {resetMessage && (
                      <p className="text-[11px] text-slate-600">
                        {resetMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
