import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'blocked' | 'closed';
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    blocked: 'bg-red-50 text-red-700 border-red-200',
    closed: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    blocked: 'Blocked',
    closed: 'Closed',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
