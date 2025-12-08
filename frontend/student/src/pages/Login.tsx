// File: Yuva-setu/src/pages/Login.tsx
import { useState } from "react";
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
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { apiService } from "@/services/api";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Handle Email Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiService.login(email.toLowerCase().trim(), password);

      toast({
        title: "Login Successful! 🎉",
        description: "Welcome back to Yuva Setu",
      });

      // Check if profile is complete and redirect accordingly
      if (data.user?.profile_completed) {
        navigate("/dashboard");
      } else {
        navigate("/complete-profile");
      }

    } catch (error) {
      let errorMessage = "Failed to login. Please check your credentials and try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const idToken = await user.getIdToken();
      
      const data = await apiService.googleLogin(idToken);

      toast({
        title: "Welcome Back! 🎉",
        description: `Successfully logged in with Google as ${user.email}`,
      });

      // Check if profile is complete and redirect accordingly
      if (data.user?.profile_completed) {
        navigate("/dashboard");
      } else {
        navigate("/complete-profile");
      }

    } catch (error) {
      let errorMessage = "Failed to login with Google.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Google Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
            Welcome back to Yuva Setu
          </h1>
          <p className="text-gray-600">
            Log in to continue exploring internships and opportunities tailored
            for you.
          </p>
          <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
            <li>Access personalized internship recommendations.</li>
            <li>Track your applications in one place.</li>
            <li>Update your profile anytime.</li>
          </ul>
        </div>

        {/* Right side card */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your registered email and password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Continue with Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4 flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
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
              <span>{isGoogleLoading ? "Signing in..." : "Continue with Google"}</span>
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-2 text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-2">
                New to Yuva Setu?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}