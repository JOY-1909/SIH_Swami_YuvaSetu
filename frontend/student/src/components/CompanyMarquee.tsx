import { useLanguage } from "@/context/LanguageContext";

export const CompanyMarquee = () => {
  const { t } = useLanguage();

  const companies = [
    { name: "Deloitte", logo: "🔷" },
    { name: "Accenture", logo: "💠" },
    { name: "Amazon", logo: "📦" },
    { name: "Nykaa", logo: "💄" },
    { name: "Boat", logo: "🎧" },
    { name: "Lenskart", logo: "👓" },
    { name: "Flipkart", logo: "🛍️" },
    { name: "Infosys", logo: "💻" },
    { name: "TCS", logo: "🏢" },
    { name: "Wipro", logo: "⚡" },
    { name: "HCL", logo: "🌐" },
    { name: "Tech Mahindra", logo: "🔧" },
  ];

  // Duplicate for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-border">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
          {t("marquee.heading")}
        </h3>
        
        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white/50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/50 to-transparent z-10"></div>
          
          {/* Marquee */}
          <div className="flex gap-8 animate-marquee">
            {duplicatedCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 group"
              >
                <div className="flex flex-col items-center justify-center w-32 h-24 rounded-lg bg-white shadow-soft hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">
                    {company.logo}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
