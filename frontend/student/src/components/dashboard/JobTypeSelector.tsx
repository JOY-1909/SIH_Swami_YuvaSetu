import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const jobTypes = [
  { id: "internship", label: "Internship", description: "Short-term learning opportunities" },
  { id: "parttime", label: "Part-time", description: "Flexible work hours" },
  { id: "hybrid", label: "Hybrid", description: "Mix of remote and office work" },
  { id: "fulltime", label: "Full-time", description: "Standard work schedule" },
];

interface JobTypeSelectorProps {
  onClose: () => void;
}

export const JobTypeSelector = ({ onClose }: JobTypeSelectorProps) => {
  const { toast } = useToast();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["internship", "hybrid"]);

  const toggleJobType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
    );
  };

  const clearAll = () => {
    setSelectedTypes([]);
  };

  const handleUpdate = () => {
    toast({
      title: "Preferences Updated! ✅",
      description: `${selectedTypes.length} job type(s) selected`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Job Types</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {jobTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-start space-x-3 p-4 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
              onClick={() => toggleJobType(type.id)}
            >
              <Checkbox
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={() => toggleJobType(type.id)}
              />
              <div className="flex-1">
                <Label
                  htmlFor={type.id}
                  className="font-medium cursor-pointer"
                >
                  {type.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={clearAll}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={handleUpdate}
            className="flex-1 btn-3d"
            disabled={selectedTypes.length === 0}
          >
            Update ({selectedTypes.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
