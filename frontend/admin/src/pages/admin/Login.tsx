import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveAdminAuth } from '@/lib/auth';
import { CheckCircle, Shield, TrendingUp, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_API_BASE = '/api/admin';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const token = await user.getIdToken();
      const response = await fetch(`${ADMIN_API_BASE}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Backend verification failed');
      }

      const adminData = await response.json();

      saveAdminAuth({
        email: adminData.email,
        name: adminData.name,
        role: 'admin',
      });

      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Authentication failed:', error);

      switch (error.code) {
        case 'auth/user-not-found':
          setError('No user found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials. Please check your email and password.');
          break;
        default:
          setError(`Login failed: ${error.message || 'Please check your credentials and try again.'}`);
      }
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    let tempUser: any = null;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      tempUser = user;

      const creationTime = new Date(user.metadata.creationTime!).getTime();
      const lastSignInTime = new Date(user.metadata.lastSignInTime!).getTime();

      if (Math.abs(lastSignInTime - creationTime) < 2000) {
        await signOut(auth);
        setError('User not authorized. Only pre-registered admins can sign in.');
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`${ADMIN_API_BASE}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Backend verification failed');
      }

      const adminData = await response.json();

      saveAdminAuth({
        email: adminData.email,
        name: adminData.name,
        role: 'admin',
      });

      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Google authentication failed:', error);

      if (tempUser) {
        try {
          await signOut(auth);
        } catch (signOutError) {
          console.error('Failed to sign out temp user:', signOutError);
        }
      }

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in popup was closed. Please try again.');
          break;
        case 'auth/popup-blocked':
          setError('Popup was blocked by your browser.');
          break;
        case 'auth/cancelled-popup-request':
          setError('Another popup is already open.');
          break;
        default:
          setError(error.message || 'Google sign-in failed. Please try again.');
      }
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-10 h-10" />
            <h1 className="text-3xl font-bold">YuvaSetu Admin</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Manage internships, monitor applications, and help connect students with quality opportunities across India.
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Verify Employers</h3>
              <p className="text-blue-100">Review and approve internship postings from verified employers</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Monitor Applications</h3>
              <p className="text-blue-100">Track student applications and internship outcomes in real-time</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">AI Configuration</h3>
              <p className="text-blue-100">Configure the AI recommendation engine for better student matches</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Admin Sign In</h2>
              <p className="text-slate-600">Sign in to access the admin dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yuvasetu.gov.in"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
              Only authorized administrators can access this portal.
            </p>

            <p className="text-center text-sm text-slate-600 mt-4">
              Need help?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
