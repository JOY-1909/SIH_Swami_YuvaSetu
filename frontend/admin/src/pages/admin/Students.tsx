import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { fetchStudents } from '@/services/api';

const AdminStudents = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const data = await fetchStudents();
                setStudents(data);
            } catch (error) {
                toast.error('Failed to load students');
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View registered student accounts
          </p>
        </div>

        {/* Table */}
        {/* Mobile View - Cards */}
        <div className="grid gap-4 md:hidden">
            {loading ? (
                <p>Loading...</p>
            ) : students.length === 0 ? (
                <p>No students found.</p>
            ) : (
          students.map((student) => (
            <div 
              key={student._id || student.id} 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4 transition-all duration-200 active:scale-[0.99] active:shadow-none"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate pr-2">{student.full_name || student.username || 'N/A'}</h3>
                  <p className="text-sm text-muted-foreground font-medium truncate">{student.email}</p>
                </div>
                <span className="shrink-0 text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                  {student.location_query || 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50">
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Phone</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{student.phone || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Last Active</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{student.last_login ? new Date(student.last_login).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                ) : students.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">No students found.</TableCell>
                    </TableRow>
                ) : (
                students.map((student) => (
                  <TableRow key={student._id || student.id}>
                    <TableCell className="font-medium">{student.full_name || student.username || 'N/A'}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.location_query || 'N/A'}</TableCell>
                    <TableCell>{student.phone || 'N/A'}</TableCell>
                    <TableCell>{student.last_login ? new Date(student.last_login).toLocaleDateString() : 'Never'}</TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStudents;
