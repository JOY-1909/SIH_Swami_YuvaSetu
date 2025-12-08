// src/components/employer/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getEmployerAuth } from "@/lib/auth";
import { backendRequest } from "@/services/backend";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        const session = getEmployerAuth();
        
        if (user && session) {
          setIsAuthenticated(true);
          
          // Check if user has completed signup
          try {
            await backendRequest("/employer/profile");
            setHasProfile(true);
          } catch (err: any) {
            // 404 means profile doesn't exist
            if (err?.message?.includes("404") || err?.message?.includes("not found")) {
              setHasProfile(false);
            } else {
              // Other errors (network, etc.)
              setHasProfile(true); // Allow through to show error
            }
          }
        } else {
          setIsAuthenticated(false);
          setHasProfile(false);
        }
        
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/employer/login" replace />;
  }

  // User is authenticated but hasn't completed signup
  if (!hasProfile && location.pathname !== "/employer/profile") {
    return <Navigate to="/employer/signup" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
