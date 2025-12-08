import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

// Social Media Data - 4 slides
const socialMediaSlides: {
  id: number;
  image: string;
  captionKey: TranslationKey;
  platformKey: TranslationKey;
  color: string;
}[] = [
  {
    id: 1,
    image: "📱",
    captionKey: "gallery.social.new.caption",
    platformKey: "social.twitter",
    color: "bg-blue-50",
  },
  {
    id: 2,
    image: "📸",
    captionKey: "gallery.social.star.caption",
    platformKey: "social.instagram",
    color: "bg-pink-50",
  },
  {
    id: 3,
    image: "💼",
    captionKey: "gallery.social.tips.caption",
    platformKey: "social.linkedin",
    color: "bg-indigo-50",
  },
  {
    id: 4,
    image: "🎥",
    captionKey: "gallery.social.bts.caption",
    platformKey: "social.youtube",
    color: "bg-red-50",
  },
];

// Event Gallery Data - 4 slides
const eventGallerySlides: {
  id: number;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  image: string;
  color: string;
}[] = [
  {
    id: 1,
    titleKey: "gallery.events.launch.title",
    descriptionKey: "gallery.events.launch.description",
    image: "🎉",
    color: "bg-purple-50",
  },
  {
    id: 2,
    titleKey: "gallery.events.workshop.title",
    descriptionKey: "gallery.events.workshop.description",
    image: "📚",
    color: "bg-green-50",
  },
  {
    id: 3,
    titleKey: "gallery.events.report.title",
    descriptionKey: "gallery.events.report.description",
    image: "📄",
    color: "bg-orange-50",
  },
  {
    id: 4,
    titleKey: "gallery.events.success.title",
    descriptionKey: "gallery.events.success.description",
    image: "⭐",
    color: "bg-yellow-50",
  },
];

// Testimonials and Sponsors Data - 4 slides
const testimonialsSponsorsSlides = [
  {
    id: 1,
    type: "testimonial" as const,
    name: "Priya Sharma",
    roleKey: "gallery.testimonials.priya.role" as TranslationKey,
    quoteKey: "gallery.testimonials.priya.quote" as TranslationKey,
    avatar: "👩‍💻",
    color: "bg-teal-50",
  },
  {
    id: 2,
    type: "testimonial" as const,
    name: "Rahul Kumar",
    roleKey: "gallery.testimonials.rahul.role" as TranslationKey,
    quoteKey: "gallery.testimonials.rahul.quote" as TranslationKey,
    avatar: "👨‍💼",
    color: "bg-cyan-50",
  },
  {
    id: 3,
    type: "testimonial" as const,
    name: "Ananya Singh",
    roleKey: "gallery.testimonials.ananya.role" as TranslationKey,
    quoteKey: "gallery.testimonials.ananya.quote" as TranslationKey,
    avatar: "👩‍💼",
    color: "bg-blue-50",
  },
  {
    id: 4,
    type: "sponsor" as const,
    sponsors: [
      { name: "Deloitte", logo: "🔷", descriptionKey: "gallery.sponsors.deloitte" as TranslationKey },
      { name: "Infosys", logo: "💻", descriptionKey: "gallery.sponsors.infosys" as TranslationKey },
      { name: "TCS", logo: "🏢", descriptionKey: "gallery.sponsors.tcs" as TranslationKey },
      { name: "Amazon", logo: "📦", descriptionKey: "gallery.sponsors.amazon" as TranslationKey },
      { name: "Flipkart", logo: "🛍️", descriptionKey: "gallery.sponsors.flipkart" as TranslationKey },
      { name: "Accenture", logo: "💠", descriptionKey: "gallery.sponsors.accenture" as TranslationKey },
    ],
    color: "bg-slate-50",
  },
];

// Individual Slideshow Component
const Slideshow = ({
  slides,
  cardTitleKey,
}: {
  slides: any[];
  cardTitleKey: TranslationKey;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const { t } = useLanguage();


  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      // Start fade out
      setFadeClass("opacity-0");
      
      // Change slide after fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setFadeClass("opacity-100");
      }, 300); // Half of transition duration for smooth effect
      
    }, 2000); // 2 second interval


    return () => clearInterval(timer);
  }, [slides.length, isHovered, currentIndex]);


  const goToPrevious = () => {
    setFadeClass("opacity-0");
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
      setFadeClass("opacity-100");
    }, 300);
  };


  const goToNext = () => {
    setFadeClass("opacity-0");
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      setFadeClass("opacity-100");
    }, 300);
  };


  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setFadeClass("opacity-0");
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeClass("opacity-100");
    }, 300);
  };


  const renderSlideContent = () => {
    const slide = slides[currentIndex];


    // Social Media Slide
    if (slide.captionKey && slide.platformKey) {
      return (
        <div className={`${slide.color} rounded-lg p-8 min-h-[280px] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeClass}`}>
          <div className="text-7xl mb-4 animate-bounce">{slide.image}</div>
          <p className="text-lg font-medium text-gray-800 text-center mb-2">
            {t(slide.captionKey)}
          </p>
          <span className="inline-block px-4 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm">
            {t(slide.platformKey)}
          </span>
        </div>
      );
    }


    // Event Gallery Slide
    if (slide.titleKey && slide.descriptionKey) {
      return (
        <div className={`${slide.color} rounded-lg p-8 min-h-[280px] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeClass}`}>
          <div className="text-7xl mb-4 animate-pulse">{slide.image}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {t(slide.titleKey)}
          </h3>
          <p className="text-gray-600 text-center">
            {t(slide.descriptionKey)}
          </p>
        </div>
      );
    }


    // Testimonial Slide
    if (slide.type === "testimonial") {
      return (
        <div className={`${slide.color} rounded-lg p-8 min-h-[280px] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeClass}`}>
          <div className="text-6xl mb-4">{slide.avatar}</div>
          <p className="text-gray-700 text-center italic mb-4 text-base leading-relaxed">
            "{t(slide.quoteKey)}"
          </p>
          <div className="text-center">
            <p className="font-bold text-gray-800">{slide.name}</p>
            <p className="text-sm text-gray-600">
              {t(slide.roleKey)}
            </p>
          </div>
        </div>
      );
    }


    // Sponsor Slide
    if (slide.type === "sponsor") {
      return (
        <div className={`${slide.color} rounded-lg p-8 min-h-[280px] flex flex-col justify-center transition-opacity duration-500 ${fadeClass}`}>
          <h3 className="text-center text-lg font-bold text-gray-800 mb-6">
            {t("gallery.sponsors.heading")}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {slide.sponsors.map((sponsor: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="text-3xl mb-1">{sponsor.logo}</div>
                <p className="font-semibold text-xs text-gray-800">{sponsor.name}</p>
                <p className="text-[10px] text-gray-600 leading-tight">
                  {t(sponsor.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500">
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {t(cardTitleKey)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden">
            {renderSlideContent()}
            
            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>


          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};


// Main Component - Keeping the same export name "Gallery"
export const Gallery = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("gallery.heading")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("gallery.subheading")}
          </p>
        </div>


        {/* Three Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Social Media */}
          <Slideshow 
            slides={socialMediaSlides}
            cardTitleKey="gallery.cards.social"
          />


          {/* Card 2: Event Gallery */}
          <Slideshow 
            slides={eventGallerySlides}
            cardTitleKey="gallery.cards.events"
          />


          {/* Card 3: Testimonials & Sponsors */}
          <Slideshow 
            slides={testimonialsSponsorsSlides}
            cardTitleKey="gallery.cards.testimonials"
          />
        </div>
      </div>
    </section>
  );
};
