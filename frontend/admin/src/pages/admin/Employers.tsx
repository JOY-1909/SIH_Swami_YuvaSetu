import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Check, X, Mail } from 'lucide-react';

const ADMIN_API_BASE = '/api/admin';

interface Employer {
  employer_uid: string;
  organisation_name: string;
  contact_email: string;
  contact_person?: string;
  industry?: string;
  is_verified: boolean;
  created_at: string;
}

type FilterStatus = 'all' | 'verified' | 'pending';

const AdminEmployers = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Fetch Employers from Backend
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${ADMIN_API_BASE}/employers`);
      const data = await res.json();
      setEmployers(data);
    } catch (error) {
      console.error('Failed to fetch employers:', error);
      toast.error('Failed to load employers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  // ✅ Filter Logic
  const filteredEmployers = employers.filter((emp) => {
    const matchesStatus = filter === 'all' ? true : (filter === 'verified' ? emp.is_verified : !emp.is_verified);
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
        (emp.organisation_name?.toLowerCase().includes(query) || false) ||
        (emp.contact_email?.toLowerCase().includes(query) || false) ||
        (emp.contact_person?.toLowerCase().includes(query) || false);
    return matchesStatus && matchesSearch;
  });

  // ✅ Verify Employer
  const handleApprove = async (uid: string) => {
    try {
      const res = await fetch(`${ADMIN_API_BASE}/employers/${uid}/verify`, {
        method: 'PUT',
      });
      if (res.ok) {
        toast.success('Employer verified successfully');
        fetchEmployers(); // Refresh list
      }
    } catch (error) {
      toast.error('Failed to verify employer');
    }
  };

  // ✅ Reject/Block Employer
  const handleBlock = async (uid: string) => {
    try {
      const res = await fetch(`${ADMIN_API_BASE}/employers/${uid}/reject`, {
        method: 'PUT',
      });
      if (res.ok) {
        toast.error('Employer verification revoked');
        fetchEmployers(); // Refresh list
      }
    } catch (error) {
      toast.error('Failed to block employer');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employers</h1>
          <p className="text-slate-600 mt-1">Approve and manage organisations posting internships</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'pending', 'verified'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                    ${
                      filter === status
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
                    placeholder="Search employers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading employers...</div>
          ) : filteredEmployers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No employers found with {filter} status.
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="md:hidden divide-y">
                {filteredEmployers.map((employer) => (
                  <div key={employer.employer_uid} className="p-4 space-y-3">
                    <div className="font-semibold text-slate-900">{employer.organisation_name}</div>
                    <div className="text-sm text-slate-600">{employer.contact_person || 'N/A'}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {employer.contact_email}
                    </div>
                    <div className="text-xs text-slate-400">
                      Joined: {new Date(employer.created_at).toLocaleDateString()}
                    </div>
                    {employer.is_verified ? (
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Verified
                      </div>
                    ) : (
                      <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      {!employer.is_verified ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(employer.employer_uid)}
                        >
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleBlock(employer.employer_uid)}
                        >
                          <X className="w-4 h-4 mr-1" /> Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployers.map((employer) => (
                      <TableRow key={employer.employer_uid}>
                        <TableCell className="font-medium">{employer.organisation_name}</TableCell>
                        <TableCell>{employer.contact_person || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-slate-600">{employer.contact_email}</TableCell>
                        <TableCell>
                          {employer.is_verified ? (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(employer.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {!employer.is_verified ? (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(employer.employer_uid)}
                            >
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleBlock(employer.employer_uid)}
                            >
                              <X className="w-4 h-4 mr-1" /> Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmployers;
