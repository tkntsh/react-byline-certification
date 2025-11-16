// Navigation bar component - displays main navigation and user menu
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Handle logout and redirect
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Byline Certification</span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-gray-300 transition">
              About
            </Link>

            {/* Conditional rendering based on authentication status */}
            {isAuthenticated ? (
              <>
                <Link to="/submissions" className="hover:text-gray-300 transition">
                  My Submissions
                </Link>
                <Link to="/submit" className="hover:text-gray-300 transition">
                  Submit Report
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-yellow-300 transition">
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-gray-300 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

