// File: Yuva-setu/src/pages/Signup.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, UserPlus, Mail as MailIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { apiService } from "@/services/api";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const otpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    return () => {
      if (otpIntervalRef.current) {
        clearInterval(otpIntervalRef.current);
      }
    };
  }, []);

  const startOtpTimer = () => {
    setOtpTimer(60);
    if (otpIntervalRef.current) {
      clearInterval(otpIntervalRef.current);
    }
    otpIntervalRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          if (otpIntervalRef.current) {
            clearInterval(otpIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Email Signup with Backend OTP
  const handleSendOtp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Password and Confirm Password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password should be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingOtp(true);

    try {
      await apiService.sendEmailOTP(
        email.toLowerCase().trim(),
        password,
        confirmPassword
      );
      setShowOtp(true);
      setOtp("");
      startOtpTimer();

      toast({
        title: "OTP Sent! 📧",
        description: `We've sent a 6-digit verification code to ${email}.`,
      });

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send OTP. Please try again.";
      toast({
        title: "OTP Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP verification and account creation - FIXED: Added password field
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiService.verifyEmailOTP(
        email.toLowerCase().trim(),
        otp,
        agreedToTerms
      );

      toast({
        title: "Account Created! 🎉",
        description: "Your account has been created successfully. Redirecting to profile setup...",
      });

      // Redirect to multi-step form
      setTimeout(() => {
        navigate("/complete-profile");
      }, 1500);

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to verify OTP. Please try again.";
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Signup - FIXED: Always redirect to complete-profile for new users
  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const idToken = await user.getIdToken();
      
      await apiService.googleSignup(idToken);

      toast({
        title: "Welcome! 🎉",
        description: `Successfully signed in with Google as ${user.email}`,
      });

      // FIXED: Always redirect to complete-profile for Google signup
      // Since Google users typically don't have completed profiles initially
      navigate("/complete-profile");

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign up with Google.";
      toast({
        title: "Google Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtp) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  const handleResendOtp = async () => {
    try {
      await apiService.resendOtp(email.toLowerCase().trim(), 'signup');
      startOtpTimer();
      setOtp('');
      toast({
        title: "OTP Resent! 📧",
        description: "We've sent a new verification code to your email.",
      });

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again.";
      toast({
        title: "Resend Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div className="hidden md:block space-y-6">
          <button
            className="flex items-center text-sm text-blue-600 hover:underline mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create your Yuva Setu account
          </h1>
          <p className="text-gray-600">
            Sign up to explore internships and opportunities tailored for you.
          </p>
          <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
            <li>Get matched with roles based on your preferences.</li>
            <li>Build a student-friendly profile like Internshala.</li>
            <li>Track all your applications in one dashboard.</li>
          </ul>
        </div>

        {/* Right side card */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Sign up
            </CardTitle>
            <CardDescription>
              Use your email to create an account, or continue with Google.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Continue with Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4 flex items-center justify-center gap-2"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
              )}
              <span>{isGoogleLoading ? "Signing up..." : "Continue with Google"}</span>
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-2 text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="email" className="text-sm">
                  Sign up with Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form className="space-y-4 mt-4" onSubmit={handleSignup}>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={showOtp}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address *</Label>
                    <div className="relative">
                      <MailIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-9"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={showOtp}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password (min. 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={showOtp}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={showOtp}
                    />
                  </div>

                  {/* OTP Input Section */}
                  {showOtp && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code *</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          maxLength={6}
                          className="text-center text-lg font-mono tracking-widest"
                        />
                        <p className="text-xs text-gray-500">
                          Enter the 6-digit verification code sent to your email.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleResendOtp}
                          disabled={otpTimer > 0}
                        >
                          {otpTimer > 0
                            ? `Resend in ${otpTimer}s`
                            : "Resend Code"}
                        </Button>
                        <span className="text-xs text-gray-500">
                          Didn't receive the code?
                        </span>
                      </div>
                    </>
                  )}

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked === true)
                      }
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-blue-600 hover:underline font-medium">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      .
                    </Label>
                  </div>

                  {/* Main Action Button */}
                  {!showOtp ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || !agreedToTerms}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  )}

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Login
                    </Link>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}