import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl">
              <span className="text-white font-bold text-2xl">PY</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">PM YUVA SETU</h1>
              <p className="text-sm text-muted-foreground">Connecting Youth with Opportunities</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-gray-900">
              Welcome to PM Yuva Setu
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              India's premier platform connecting students with quality internship opportunities
              across the nation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/admin/login">
              <Button className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg rounded-lg">
                Admin Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="pt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">For Students</h3>
              <p className="text-sm text-muted-foreground">
                Discover internships matched to your skills and location preferences
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">For Employers</h3>
              <p className="text-sm text-muted-foreground">
                Post internships and connect with talented students nationwide
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Smart recommendations powered by advanced matching algorithms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
