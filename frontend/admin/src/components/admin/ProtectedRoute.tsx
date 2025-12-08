import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminAuthenticated } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  if (!isAdminAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
