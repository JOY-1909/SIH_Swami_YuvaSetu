// src/components/employer/EmployerNavbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { HelpCircle, FileText, Headphones, LogOut, User } from "lucide-react";
import { getEmployerAuth, clearEmployerAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const EmployerNavbar = () => {
  const navigate = useNavigate();
  const auth = getEmployerAuth();

  const handleLogout = () => {
    clearEmployerAuth();
    navigate("/employer/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-gradient-to-r from-white via-white to-blue-50/30 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/employer" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-bold text-lg">PM</span>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text">
            YUVA SETU
          </span>
        </Link>

        {/* Center Links (only when logged in) */}
        {auth && (
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/employer/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 group"
            >
              <HelpCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>How to Use</span>
            </Link>
            <Link
              to="/employer/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 group"
            >
              <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Guidelines</span>
            </Link>
            <Link
              to="/employer/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 group"
            >
              <Headphones className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Support</span>
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {auth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary hover:scale-105 transition-all duration-300 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white font-semibold">
                      {auth.organisationName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {auth.organisationName}
                </div>
                <div className="px-2 pb-2 text-xs text-muted-foreground">
                  {auth.email}
                </div>
                <DropdownMenuItem onClick={() => navigate("/employer/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full px-6 font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                onClick={() => navigate("/employer/login")}
              >
                LOGIN
              </Button>
              <Button
                className="rounded-full px-6 font-semibold bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/employer/signup")}
              >
                SIGNUP
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
