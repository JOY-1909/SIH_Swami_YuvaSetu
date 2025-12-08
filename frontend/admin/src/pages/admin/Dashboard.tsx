import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import InternshipDetailDialog from '@/components/admin/InternshipDetailDialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Users, Briefcase, CheckCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { fetchAdminStats, fetchInternships, updateInternshipStatus } from '@/services/api';

const ADMIN_API_BASE = '/api/admin';

// API Response Type
interface AdminStats {
  total_employers: number;
  verified_employers: number;
  active_internships: number;
  total_applications: number;
}

const AdminDashboard = () => {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [recentInternships, setRecentInternships] = useState<any[]>([]);

  // ✅ Real API Data
  const [stats, setStats] = useState<AdminStats>({
    total_employers: 0,
    verified_employers: 0,
    active_internships: 0,
    total_applications: 0,
  });

  // ✅ Fetch Stats and Internships from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, internshipsData] = await Promise.all([
          fetchAdminStats(),
          fetchInternships()
        ]);
        setStats(statsData);
        setRecentInternships(internshipsData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  const handleViewInternship = (internship: typeof recentInternships[0]) => {
    setSelectedInternship(internship);
    setDialogOpen(true);
  };

  const handleReject = async (id: string) => {
    try {
        await updateInternshipStatus(id, 'rejected');
        toast.error('Internship rejected');
        // Refresh data
        const data = await fetchInternships();
        setRecentInternships(data.slice(0, 5));
    } catch (e) {
        toast.error('Failed to reject internship');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-600 mt-1">Monitor platform activity and manage internships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Total Employers</div>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.total_employers}</div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Verified</div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.verified_employers}</div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Active Internships</div>
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.active_internships}</div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Total Applications</div>
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.total_applications}</div>
          </div>
        </div>

        {/* Recent Internships Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-slate-900">Recent Internships</h2>
            <p className="text-sm text-slate-600 mt-1">Latest internship postings requiring review</p>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden divide-y">
            {recentInternships.map((internship) => (
              <div key={internship.id || internship._id} className="p-4 space-y-2">
                <div className="font-medium text-slate-900">{internship.title}</div>
                <div className="text-sm text-slate-600">{internship.organisation_name}</div>
                <div className="text-sm text-slate-500">{internship.sector}</div>
                <div className="text-xs text-slate-400">{new Date(internship.created_at).toLocaleDateString()}</div>
                <StatusBadge status={internship.status || 'active'} />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleViewInternship(internship)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInternships.map((internship) => (
                  <TableRow key={internship.id || internship._id}>
                    <TableCell className="font-medium">{internship.title}</TableCell>
                    <TableCell>{internship.organisation_name}</TableCell>
                    <TableCell>{internship.sector}</TableCell>
                    <TableCell>
                      <StatusBadge status={internship.status || 'active'} />
                    </TableCell>
                    <TableCell>{new Date(internship.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInternship(internship)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

export default AdminDashboard;
