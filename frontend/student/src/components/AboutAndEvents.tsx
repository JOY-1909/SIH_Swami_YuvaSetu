import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const events: {
  id: number;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  date: string;
  image: string;
}[] = [
  {
    id: 1,
    titleKey: "about.events.launch.title",
    descriptionKey: "about.events.launch.description",
    date: "2024-03-15",
    image: "🎉",
  },
  {
    id: 2,
    titleKey: "about.events.fair.title",
    descriptionKey: "about.events.fair.description",
    date: "2024-02-28",
    image: "🤝",
  },
  {
    id: 3,
    titleKey: "about.events.workshop.title",
    descriptionKey: "about.events.workshop.description",
    date: "2024-02-10",
    image: "📚",
  },
  {
    id: 4,
    titleKey: "about.events.industry.title",
    descriptionKey: "about.events.industry.description",
    date: "2024-01-25",
    image: "💼",
  },
];

export const AboutAndEvents = () => {
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const { t } = useLanguage();

  return (
    <section id="about-us" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* About Us */}
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {t("about.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t("about.body1")}
              </p>
              
              {expandedAbout && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.body2")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.body3")}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-3xl font-bold text-primary">10,000+</div>
                      <div className="text-sm text-muted-foreground">
                        {t("about.stats.interns")}
                      </div>
                    </div>
                    <div className="p-4 bg-success/5 rounded-lg">
                      <div className="text-3xl font-bold text-success">500+</div>
                      <div className="text-sm text-muted-foreground">
                        {t("about.stats.companies")}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                className="gap-2 text-primary hover:text-primary-hover"
                onClick={() => setExpandedAbout(!expandedAbout)}
              >
                {expandedAbout ? (
                  <>
                    {t("about.readLess")} <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t("about.readMore")} <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Event Record */}
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                {t("about.events.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary cursor-pointer transition-colors group"
                  >
                    <div className="text-4xl">{event.image}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {t(event.titleKey)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedEvent && t(selectedEvent.titleKey)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-6xl text-center py-8 bg-secondary/50 rounded-lg">
              {selectedEvent?.image}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {selectedEvent?.date && new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {selectedEvent && t(selectedEvent.descriptionKey)}
            </p>
            <Button className="w-full btn-3d">
              {t("about.events.viewDetails")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
