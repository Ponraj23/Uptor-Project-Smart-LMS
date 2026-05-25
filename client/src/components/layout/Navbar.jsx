import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { HiMenu, HiX, HiAcademicCap } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'instructor': return '/instructor/dashboard';
      default: return '/student/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <HiAcademicCap className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SmartLMS</span>
            </Link>
            <div className="hidden md:flex ml-10 gap-6">
              <Link to="/courses" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                Courses
              </Link>
              {user && (
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.name} <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full ml-1">{user.role}</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary text-sm py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link to="/courses" className="block py-2 text-gray-600" onClick={() => setIsOpen(false)}>Courses</Link>
            {user && (
              <Link to={getDashboardLink()} className="block py-2 text-gray-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
            )}
            {user ? (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block py-2 text-red-600">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-600" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-primary-600 font-medium" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
