import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Code, 
  Building, 
  Heart, 
  Leaf, 
  TrendingUp, 
  GraduationCap, 
  FlaskConical, 
  Newspaper,
  Briefcase,
  MapPin,
  Clock,
  IndianRupee
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const sectors: {
  id: number;
  nameKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  openPositions: number;
}[] = [
  {
    id: 1,
    nameKey: "sections.sector.technology",
    descriptionKey: "sections.sector.technology.desc",
    icon: Code,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    openPositions: 245,
  },
  {
    id: 2,
    nameKey: "sections.sector.publicPolicy",
    descriptionKey: "sections.sector.publicPolicy.desc",
    icon: Building,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    openPositions: 89,
  },
  {
    id: 3,
    nameKey: "sections.sector.healthcare",
    descriptionKey: "sections.sector.healthcare.desc",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-50",
    openPositions: 156,
  },
  {
    id: 4,
    nameKey: "sections.sector.environment",
    descriptionKey: "sections.sector.environment.desc",
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-50",
    openPositions: 67,
  },
  {
    id: 5,
    nameKey: "sections.sector.finance",
    descriptionKey: "sections.sector.finance.desc",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    openPositions: 198,
  },
  {
    id: 6,
    nameKey: "sections.sector.education",
    descriptionKey: "sections.sector.education.desc",
    icon: GraduationCap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    openPositions: 134,
  },
  {
    id: 7,
    nameKey: "sections.sector.research",
    descriptionKey: "sections.sector.research.desc",
    icon: FlaskConical,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    openPositions: 92,
  },
  {
    id: 8,
    nameKey: "sections.sector.media",
    descriptionKey: "sections.sector.media.desc",
    icon: Newspaper,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    openPositions: 78,
  },
];

const mockInternships: {
  id: number;
  titleKey: TranslationKey;
  companyKey: TranslationKey;
  locationKey: TranslationKey;
  durationKey: TranslationKey;
  stipendKey: TranslationKey;
  typeKey: TranslationKey;
}[] = [
  {
    id: 1,
    titleKey: "sections.mock.fullStack.title",
    companyKey: "sections.mock.fullStack.company",
    locationKey: "sections.mock.fullStack.location",
    durationKey: "sections.mock.fullStack.duration",
    stipendKey: "sections.mock.fullStack.stipend",
    typeKey: "sections.mock.fullStack.type",
  },
  {
    id: 2,
    titleKey: "sections.mock.dataScience.title",
    companyKey: "sections.mock.dataScience.company",
    locationKey: "sections.mock.dataScience.location",
    durationKey: "sections.mock.dataScience.duration",
    stipendKey: "sections.mock.dataScience.stipend",
    typeKey: "sections.mock.dataScience.type",
  },
  {
    id: 3,
    titleKey: "sections.mock.uiux.title",
    companyKey: "sections.mock.uiux.company",
    locationKey: "sections.mock.uiux.location",
    durationKey: "sections.mock.uiux.duration",
    stipendKey: "sections.mock.uiux.stipend",
    typeKey: "sections.mock.uiux.type",
  },
];

export const AvailableSections = () => {
  const [selectedSector, setSelectedSector] = useState<typeof sectors[0] | null>(null);
  const { t } = useLanguage();

  return (
    <>
      <section id="available-sections" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("sections.heading")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("sections.subheading")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <Card
                  key={sector.id}
                  className="card-interactive cursor-pointer"
                  onClick={() => setSelectedSector(sector)}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${sector.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`h-7 w-7 ${sector.color}`} />
                    </div>
                    <CardTitle className="text-xl">
                      {t(sector.nameKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t(sector.descriptionKey)}
                    </p>
                    <Badge variant="secondary" className="font-semibold">
                      {t("sections.openPositions", { count: sector.openPositions })}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internship Listings Modal */}
      <Dialog open={!!selectedSector} onOpenChange={() => setSelectedSector(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              {selectedSector && (
                <>
                  <div className={`w-12 h-12 rounded-xl ${selectedSector.bgColor} flex items-center justify-center`}>
                    <selectedSector.icon className={`h-6 w-6 ${selectedSector.color}`} />
                  </div>
                  {t(selectedSector.nameKey)} {t("sections.modalTitleSuffix")}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {mockInternships.map((internship) => (
              <Card key={internship.id} className="hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {t(internship.titleKey)}
                        </h3>
                        <p className="text-muted-foreground">
                          {t(internship.companyKey)}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {t(internship.locationKey)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {t(internship.durationKey)}
                        </div>
                        <div className="flex items-center gap-2 text-success font-medium">
                          <IndianRupee className="h-4 w-4" />
                          {t(internship.stipendKey)}
                        </div>
                      </div>
                      
                      <div>
                        <Badge>{t(internship.typeKey)}</Badge>
                      </div>
                    </div>
                    
                    <Button className="btn-3d">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {t("sections.applyNow")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
