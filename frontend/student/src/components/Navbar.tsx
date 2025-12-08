// File: Yuva-setu/src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  Mail,
  Send,
  Instagram,
  Linkedin,
  Globe,
  Twitter,
  Facebook,
  Phone,
  HelpCircle,
  FileText,
  Video,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useLanguage } from "@/context/LanguageContext";
import { TranslationMap } from "@/i18n/translations";
import { RaiseRequestModal, TrackRequestView } from "@/components/SupportComponents";

// Define types for user data
interface UserData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: keyof TranslationMap;
  href: string;
}

const socialLinks: SocialLink[] = [
  { icon: Youtube, labelKey: "social.youtube", href: "#" },
  { icon: Mail, labelKey: "social.google", href: "#" },
  { icon: Send, labelKey: "social.telegram", href: "#" },
  { icon: Instagram, labelKey: "social.instagram", href: "#" },
  { icon: Linkedin, labelKey: "social.linkedin", href: "#" },
  { icon: Globe, labelKey: "social.website", href: "#" },
  { icon: Twitter, labelKey: "social.twitter", href: "#" },
  { icon: Facebook, labelKey: "social.facebook", href: "#" },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check login status on component mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("access_token");
      let userProfile = localStorage.getItem("userFullProfile");
      
      // Fallback: if userFullProfile doesn't exist, try to get from 'user' key
      if (!userProfile) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const userProfileData: UserData = {
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              fullName: user.full_name,
            };
            userProfile = JSON.stringify(userProfileData);
            localStorage.setItem("userFullProfile", userProfile);
          } catch (err) {
            console.error("Failed to parse user:", err);
          }
        }
      }
      
      if (accessToken) {
        setIsLoggedIn(true);
        if (userProfile) {
          try {
            const parsedData: UserData = JSON.parse(userProfile);
            setUserData(parsedData);
          } catch (err) {
            console.error("Failed to parse userFullProfile:", err);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Initial check
    checkAuthStatus();

    // Listen for storage changes (for when login/logout happens in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "userFullProfile") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for changes (for same tab updates)
    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all auth-related items
      localStorage.removeItem("access_token");
      localStorage.removeItem("userFullProfile");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userFormData");
      
      // Sign out from Firebase if user is logged in with Firebase
      try {
        await signOut(auth);
      } catch (firebaseError) {
        console.log("No Firebase session or already logged out");
      }
      
      setIsLoggedIn(false);
      setUserData(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (): string => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    } else if (userData?.firstName) {
      return userData.firstName[0].toUpperCase();
    } else if (userData?.fullName) {
      const names = userData.fullName.split(" ").filter(Boolean);
      if (names.length > 0) {
        if (names.length > 1) {
          return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return names[0][0].toUpperCase();
      }
    }
    return "U";
  };

  const getUserName = (): string => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData?.firstName) {
      return userData.firstName;
    } else if (userData?.fullName) {
      return userData.fullName;
    }
    return "User";
  };

  const getUserEmail = (): string => {
    return userData?.email || localStorage.getItem("userEmail") || "user@example.com";
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      {/* ROW 1 - Top Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Brand & Quick Links */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">PM</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground hidden sm:block">
                  YUVA SETU
                </h1>
              </Link>

            <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                {t("navbar.home")}
                </Link>
                <button
                  onClick={() => {
                    const aboutSection = document.getElementById("about-us");
                    aboutSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                {t("navbar.about")}
                </button>
                {isLoggedIn && (
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                  {t("navbar.dashboard")}
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Social dropdown + language + burger + PROFILE */}
            <div className="flex items-center gap-4">
              {/* Social Media Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden md:inline">{t("navbar.social")}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <DropdownMenuItem key={social.label} asChild>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {t(social.labelKey)}
                        </a>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <LanguageSelector />

              {/* Profile Dropdown - Always visible for logged-in users */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarImage 
                          src={userData?.avatarUrl} 
                          alt={getUserName()}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getUserName()}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {getUserEmail()}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>{t("navbar.dashboard")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      const userProfile = localStorage.getItem('userFullProfile');
                      if (userProfile) {
                        try {
                          const profileData = JSON.parse(userProfile);
                          navigate("/multi-step-form", {
                            state: {
                              edit: true,
                              profile: profileData
                            }
                          });
                        } catch (e) {
                          navigate("/multi-step-form");
                        }
                      } else {
                        navigate("/multi-step-form");
                      }
                    }}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("navbar.editProfile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("navbar.settings")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("navbar.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ROW 2 - Secondary Navigation (Hidden for logged-in users in mobile view) */}
      <nav
        className={`border-b border-border ${
          mobileMenuOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: Utility Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Video className="h-4 w-4" />
                    <span className="text-sm">{t("navbar.howToUse")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem>
                    <Video className="h-4 w-4 mr-2" />
                    {t("navbar.videoGuide")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{t("navbar.guidelines")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                    <a 
                      href="/api/v1/guidelines/download" 
                      target="_blank"
                      className="flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t("navbar.platformGuidelines")}
                    </a>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm">{t("navbar.support")}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    {t("navbar.contact")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsRaiseModalOpen(true)}>
                    {t("navbar.raiseRequest")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsTrackModalOpen(true)}>
                    {t("navbar.trackRequest")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right: Auth OR Profile (row 2) - Only show for non-logged in users */}
            {!isLoggedIn ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="btn-3d">
                      {t("navbar.login")}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      size="sm"
                      className="btn-3d bg-primary hover:bg-primary-hover"
                    >
                      {t("navbar.signup")}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // For logged-in users, show a welcome message or nothing
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                {t("navbar.welcome", { name: getUserName() })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navbar.home")}
              </Link>
              <button
                onClick={() => {
                  const aboutSection = document.getElementById("about-us");
                  aboutSection?.scrollIntoView({ behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-sm font-medium hover:text-primary transition-colors text-left"
              >
                {t("navbar.about")}
              </button>
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navbar.dashboard")}
                  </Link>
                  <Link
                    to="/multi-step-form"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      const userProfile = localStorage.getItem('userFullProfile');
                      if (userProfile) {
                        try {
                          const profileData = JSON.parse(userProfile);
                          navigate("/multi-step-form", {
                            state: {
                              edit: true,
                              profile: profileData
                            }
                          });
                          e.preventDefault();
                        } catch (err) {
                          // Continue with normal navigation
                        }
                      }
                    }}
                  >
                    {t("navbar.editProfile")}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors text-left"
                  >
                    {t("navbar.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/signup"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("navbar.signup")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    <RaiseRequestModal open={isRaiseModalOpen} onOpenChange={setIsRaiseModalOpen} />
    </>
  );
};