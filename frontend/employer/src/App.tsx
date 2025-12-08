// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import EmployerLanding from "./pages/employer/EmployerLanding";
import EmployerLogin from "./pages/employer/EmployerLogin";
import EmployerSignup from "./pages/employer/EmployerSignup";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import NewInternship from "./pages/employer/NewInternship";
import InternshipDetails from "./pages/employer/InternshipDetails";
import ApplicationStatus from "./pages/employer/ApplicationStatus";
import EmployerProfile from "./pages/employer/EmployerProfile";
import EmployerApplications from "./pages/employer/EmployerApplications";

import ProtectedRoute from "@/components/employer/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/employer" replace />} />

          {/* Employer public routes */}
          <Route path="/employer" element={<EmployerLanding />} />
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/signup" element={<EmployerSignup />} />

          {/* Employer protected routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/internships/new"
            element={
              <ProtectedRoute>
                <NewInternship />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/internships/:id"
            element={
              <ProtectedRoute>
                <InternshipDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/internships/:id/applications"
            element={
              <ProtectedRoute>
                <EmployerApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <ProtectedRoute>
                <EmployerProfile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
