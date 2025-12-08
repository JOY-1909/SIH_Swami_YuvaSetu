import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages, LanguageCode } from "@/data/languages";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as LanguageCode);
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[220px] gap-2 text-left">
        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
        <SelectValue placeholder={t("common.selectLanguage")} aria-label={language}>
          {languages.find((lang) => lang.code === language)?.name ?? t("common.selectLanguage")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {`${lang.name} / ${lang.nativeName}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
