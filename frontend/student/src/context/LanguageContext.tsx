import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LanguageCode } from "@/data/languages";
import { TranslationMap, translations } from "@/i18n/translations";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: keyof TranslationMap, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: (key) => translations.en[key],
});

const STORAGE_KEY = "preferredLanguage";

const replacePlaceholders = (value: string, replacements?: Record<string, string | number>): string => {
  if (!replacements) return value;
  return Object.entries(replacements).reduce(
    (acc, [placeholder, replacement]) =>
      acc.replaceAll(`{{${placeholder}}}`, String(replacement)),
    value,
  );
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && translations[stored]) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
    window.dispatchEvent(new CustomEvent("language-change", { detail: language }));
  }, [language]);

  const translate = useCallback(
    (key: keyof TranslationMap, replacements?: Record<string, string | number>) => {
      const dictionary = translations[language] ?? translations.en;
      const fallback = translations.en;
      const value = dictionary[key] ?? fallback[key] ?? key;
      return replacePlaceholders(value, replacements);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translate,
    }),
    [language, translate],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

