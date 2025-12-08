import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EmployerNavbar } from "@/components/employer/EmployerNavbar";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import { getEmployerAuth } from "@/lib/auth";

import { TrendingUp, Users, Zap, ArrowRight } from "lucide-react";

export default function EmployerLanding() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: "Access Top Talent",
      description:
        "Connect with motivated students matched by AI to your internship requirements.",
    },
    {
      icon: Users,
      title: "Build Future Teams",
      description:
        "Mentor and evaluate interns before making full-time hiring decisions.",
    },
    {
      icon: Zap,
      title: "Streamlined Process",
      description:
        "Manage applications, track status, and communicate all in one platform.",
    },
  ];

  const handlePostInternship = () => {
    const session = getEmployerAuth();
    if (session) {
      navigate("/employer/dashboard");
    } else {
      navigate("/employer/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-gradient-start))] to-[hsl(var(--background-gradient-end))]">
      <EmployerNavbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <div className="space-y-7">
            <div className="inline-flex items-center rounded-full bg-chip-blue-bg px-4 py-1.5 text-xs md:text-sm font-medium text-chip-blue-text shadow-sm border border-border/40">
              For Organisations &amp; Departments
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-[2.9rem] font-bold text-foreground leading-tight tracking-tight">
                Host PM Internships
                <br />
                <span className="text-primary">Mentor. Impact. Build.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Post internship opportunities and let our AI recommend them to
                the right students. Build your team while contributing to
                India&apos;s youth development.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>AI-assisted matching with verified student profiles.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Central dashboard to track applications and outcomes.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Designed for ministries, departments, and partner organisations.</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 pt-3">
              <Button
                size="lg"
                className="rounded-full bg-primary hover:bg-primary-hover px-8 shadow-md shadow-primary/20"
                onClick={handlePostInternship}
              >
                Post an Internship
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-border/70 bg-white/40 backdrop-blur"
                onClick={() =>
                  document
                    .getElementById("benefits")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Benefits
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chip-green-bg" />
                <span>Trusted by government departments</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chip-blue-bg" />
                <span>Built for PM YUVA Setu ecosystem</span>
              </div>
            </div>
          </div>

          {/* Right visual card */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-white/90 shadow-xl border border-border/60 overflow-hidden backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-4 left-4 bg-white rounded-2xl shadow-lg border border-border/70 px-4 py-3 flex items-center gap-3 text-xs md:text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-foreground text-xs md:text-sm">
                  Applications managed in one view
                </p>
                <p className="text-[0.7rem] md:text-xs text-muted-foreground">
                  Track status, update outcomes, and stay aligned with student progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary/80 uppercase">
            Why use the employer portal
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Built for structured, outcome-driven internships
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Simplify postings, manage applications, and provide a transparent journey
            for students—all aligned with PM YUVA Setu objectives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-border p-6 space-y-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <EmployerFooter />
    </div>
  );
}
