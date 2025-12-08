import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { Calendar, MapPin, Briefcase, Building2, IndianRupee, Clock } from 'lucide-react';

interface InternshipDetailDialogProps {
  internship: any; // Relaxed type to prevent null/type mismatches causing render failure
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject?: (id: string) => void;
}

const InternshipDetailDialog = ({
  internship,
  open,
  onOpenChange,
  onReject,
}: InternshipDetailDialogProps) => {
  if (!internship) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {internship.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4" />
                {internship.organisation_name || internship.employer || 'Unknown Employer'}
              </DialogDescription>
            </div>
            {internship.status && <StatusBadge status={internship.status} />}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.city || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.mode || 'On-site'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.duration || '3 months'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IndianRupee className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.stipend || '₹10,000/month'}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {internship.description || 
                'This is an exciting opportunity to work with our team and gain hands-on experience in the field. You will be working on real projects and learning from experienced professionals.'}
            </p>
          </div>

          {/* Skills */}
          {internship.skills && Array.isArray(internship.skills) && internship.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {internship.requirements && Array.isArray(internship.requirements) && internship.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {internship.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Posted: {internship.created_at ? new Date(internship.created_at).toLocaleDateString() : (internship.created || 'N/A')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">{internship.sector}</Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-gray-200 gap-3">
             {onReject && (internship.status === 'pending' || internship.status === 'active') && (
              <Button 
                variant="destructive" 
                size="sm"
                className="bg-red-50 text-red-600 hover:bg-red-100 border-none"
                onClick={() => {
                  if (confirm('Are you sure you want to reject this internship?')) {
                    onReject(internship.id || internship._id);
                    onOpenChange(false);
                  }
                }}
              >
                Reject Internship
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternshipDetailDialog;
