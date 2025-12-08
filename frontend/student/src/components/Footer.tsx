import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PM</span>
              </div>
              <h3 className="text-lg font-bold">{t("footer.brand.title")}</h3>
            </div>
            <p className="text-sm text-gray-400 font-hindi">
              {t("footer.brand.hindi")}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {t("footer.brand.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  {t("footer.quickLinks.home")}
                </Link>
              </li>
              <li>
                <a href="#about-us" className="hover:text-primary transition-colors">
                  {t("footer.quickLinks.about")}
                </a>
              </li>
              <li>
                <a
                  href="#available-sections"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.quickLinks.opportunities")}
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {t("footer.quickLinks.login")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.resources.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/api/v1/guidelines/download" target="_blank" className="hover:text-primary transition-colors">
                  {t("footer.resources.guidelines")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.resources.faqs")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.resources.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.resources.terms")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.contact.title")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("footer.contact.phone")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("footer.contact.email")}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("footer.contact.address")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>{t("footer.copy")}</p>
        </div>
      </div>
    </footer>
  );
};
