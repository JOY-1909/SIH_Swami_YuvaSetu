import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import heroImage1 from "@/assets/hero-carousel-1.jpg";
import heroImage2 from "@/assets/hero-carousel-2.jpg";
import heroImage3 from "@/assets/hero-carousel-3.jpg";
import heroImage4 from "@/assets/hero-carousel-4.jpg";
import { useLanguage } from "@/context/LanguageContext";

export const Hero = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<any>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const images = [heroImage1, heroImage2, heroImage3, heroImage4];
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("access_token");
      setIsLoggedIn(!!accessToken);
    };

    checkAuthStatus();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="pt-32 pb-16 px-4 hero-pattern animate-fade-in">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Hero Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                {t("hero.badge")}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t("hero.titlePrefix")}{" "}
              <span className="text-gradient-primary">{t("hero.titleHighlight")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="btn-3d gap-2 bg-primary hover:bg-primary-hover"
                onClick={handleGetStarted}
              >
                {t("hero.primaryCta")}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-3d"
                onClick={() => {
                  const sectionsElement = document.getElementById('available-sections');
                  sectionsElement?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t("hero.secondaryCta")}
              </Button>
            </div>
          </div>

          {/* Right: Hero Image & Hindi Quote */}
          <div className="relative">
            {/* Main Hero Image Carousel */}
            <div className="relative rounded-2xl overflow-hidden shadow-strong aspect-[4/3]">
              <Carousel 
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full h-full"
              >
                <CarouselContent className="h-full">
                  {images.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                      <div className="relative w-full h-full">
                        <img
                          src={image}
                          alt={`Internship scene ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Hindi Quote Card - Positioned over image */}
            <div className="absolute -bottom-6 -right-6 animate-spring-in">
              <div className="relative rounded-xl overflow-hidden shadow-3d max-w-sm">
                {/* Tricolor border */}
                <div className="absolute inset-0 tricolor-band opacity-20"></div>
                <div className="absolute left-0 top-0 bottom-0 w-2 tricolor-band"></div>
                
                {/* Content */}
                <div className="relative bg-white p-6 border-l-4 border-transparent">
                  <div className="font-hindi text-2xl md:text-3xl font-bold text-foreground text-center leading-relaxed">
                    {t("hero.quotePrimary")}
                  </div>
                  <div className="text-center mt-2 text-sm text-muted-foreground italic">
                    {t("hero.quoteSecondary")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
