import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import InternshipDetailDialog from '@/components/admin/InternshipDetailDialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { fetchInternships, updateInternshipStatus } from '@/services/api';

type InternshipStatus = 'pending' | 'approved' | 'rejected' | 'closed' | 'active';

const AdminInternships = () => {
  const [filter, setFilter] = useState<'all' | InternshipStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [internships, setInternships] = useState<any[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const data = await fetchInternships();
      setInternships(data);
    } catch (error) {
      toast.error('Failed to load internships');
    }
  };

  const filteredInternships = internships.filter((i) => {
    const matchesStatus = filter === 'all' ? true : (i.status || 'active') === filter;
    const matchesSearch = 
      (i.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (i.organisation_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    return matchesStatus && matchesSearch;
  });

  const handleViewInternship = (internship: any) => {
    setSelectedInternship(internship);
    setDialogOpen(true);
  };

  const handleReject = async (id: string) => {
    try {
        await updateInternshipStatus(id, 'rejected');
        toast.error('Internship rejected');
        loadInternships(); // Refresh
    } catch (e) {
        toast.error('Failed to reject internship');
    }
  };

  const handleClose = async (id: string) => {
    try {
        await updateInternshipStatus(id, 'closed');
        toast.success('Internship closed');
        loadInternships(); // Refresh
    } catch (e) {
        toast.error('Failed to close internship');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Internships</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and manage internship postings
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'active', 'rejected', 'closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium border transition-colors
                    ${
                      filter === status
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
                <input
                    type="text"
                    placeholder="Search internships..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>
        </div>

        {/* Table */}
        {/* Mobile View - Cards */}
        <div className="grid gap-4 md:hidden">
          {filteredInternships.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-sm text-muted-foreground">No internships found with {filter} status.</p>
            </div>
          ) : (
            filteredInternships.map((internship) => (
              <div 
                key={internship.id || internship._id} 
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4 transition-all duration-200 active:scale-[0.99] active:shadow-none"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 leading-tight truncate pr-2">{internship.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium truncate">{internship.organisation_name}</p>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={internship.status || 'active'} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 font-medium text-gray-600">
                    {internship.sector}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 font-medium text-gray-600">
                    {internship.city}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 font-medium text-gray-600">
                    {internship.mode || 'Remote'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-50 gap-3">
                  <span className="text-xs text-muted-foreground font-medium">{new Date(internship.created_at).toLocaleDateString()}</span>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 text-xs font-medium text-primary hover:bg-blue-50"
                      onClick={() => handleViewInternship(internship)}
                    >
                      View
                    </Button>
                    {(internship.status === 'approved' || internship.status === 'pending') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-medium text-gray-600"
                        onClick={() => handleClose(internship.id || internship._id)}
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {filteredInternships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No internships found with {filter} status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInternships.map((internship) => (
                    <TableRow key={internship.id || internship._id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          {internship.title}
                        </div>
                      </TableCell>
                      <TableCell>{internship.organisation_name}</TableCell>
                      <TableCell>{internship.sector}</TableCell>
                      <TableCell>{internship.city}</TableCell>
                      <TableCell>{internship.mode || 'Remote'}</TableCell>
                      <TableCell>
                        <StatusBadge status={internship.status || 'active'} />
                      </TableCell>
                      <TableCell>{new Date(internship.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 text-xs text-primary"
                            onClick={() => handleViewInternship(internship)}
                          >
                            View
                          </Button>
                          {(internship.status === 'approved' || internship.status === 'pending') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => handleClose(internship.id || internship._id)}
                            >
                              Close
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <InternshipDetailDialog
        internship={selectedInternship}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onReject={handleReject}
      />
    </AdminLayout>
  );
};

export default AdminInternships;
