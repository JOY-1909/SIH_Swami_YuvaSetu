import { auth } from "../lib/firebase";

const ADMIN_API_BASE = '/api/admin';

const getAuthHeader = async () => {
    const user = auth.currentUser;
    if (!user) {
        // Wait a bit for auth to initialize if it's loading?
        // For now, assume auth is handled by layout/router protection
        throw new Error("Not authenticated");
    }
    const token = await user.getIdToken();
    return { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const fetchAdminStats = async () => {
    const headers = await getAuthHeader();
    const res = await fetch(`${ADMIN_API_BASE}/stats`, { headers });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
};

export const fetchInternships = async () => {
    const headers = await getAuthHeader();
    const res = await fetch(`${ADMIN_API_BASE}/internships`, { headers });
    if (!res.ok) throw new Error("Failed to fetch internships");
    return res.json();
};

export const updateInternshipStatus = async (id: string, status: 'active' | 'closed' | 'rejected') => {
    const headers = await getAuthHeader();
    const res = await fetch(`${ADMIN_API_BASE}/internships/${id}/status`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
};

export const fetchStudents = async () => {
    const headers = await getAuthHeader();
    const res = await fetch(`${ADMIN_API_BASE}/students`, { headers });
    if (!res.ok) throw new Error("Failed to fetch students");
    return res.json();
};
