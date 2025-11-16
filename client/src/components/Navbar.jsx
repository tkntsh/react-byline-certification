// Navigation bar component - displays main navigation and user menu
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle logout and redirect
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-lg sm:text-xl md:text-2xl font-bold">Byline Certification</span>
          </Link>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <span className="text-xs lg:text-sm hidden lg:inline">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 lg:px-4 py-2 rounded transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link
                  to="/login"
                  className="hover:text-gray-300 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-3 lg:px-4 py-2 rounded transition text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="px-4 py-2 hover:bg-gray-800 rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 hover:bg-gray-800 rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/submissions"
                    className="px-4 py-2 hover:bg-gray-800 rounded transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Submissions
                  </Link>
                  <Link
                    to="/submit"
                    className="px-4 py-2 hover:bg-gray-800 rounded transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Submit Report
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 hover:bg-gray-800 rounded transition text-yellow-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="px-4 py-2 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Welcome, {user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 hover:bg-gray-800 rounded transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

