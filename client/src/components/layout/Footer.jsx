import { HiAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <HiAcademicCap className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">SmartLMS</span>
            </div>
            <p className="text-gray-400 max-w-md">
              AI-powered learning platform delivering adaptive learning experiences, 
              intelligent quiz generation, and real-time analytics.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Become an Instructor</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartLMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
