import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
                <span className="text-primary font-bold text-lg">YS</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">PM YUVA SETU</h3>
                <p className="text-xs font-medium text-primary uppercase tracking-wider">Admin Portal</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Empowering India's youth with meaningful internship opportunities and bridging the gap between education and industry.
            </p>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 tracking-tight">Support & Legal</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 tracking-tight">Contact Us</h4>
            <div className="space-y-4 text-sm text-gray-500">
              <p className="flex flex-col gap-1">
                <span className="font-medium text-gray-900">Email</span>
                <span className="hover:text-primary cursor-pointer transition-colors">support@yuvasetu.gov.in</span>
              </p>
              <p className="flex flex-col gap-1">
                <span className="font-medium text-gray-900">Office</span>
                <span>Ministry of Youth Affairs & Sports,<br />Shastri Bhawan, New Delhi</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2025 PM Yuva Setu. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>v1.0.0</span>
            <span>Secure Admin Console</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
