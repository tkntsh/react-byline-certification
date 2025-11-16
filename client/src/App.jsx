// Main App component - sets up routing and authentication context
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page components
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Submit from './pages/Submit';
import Submissions from './pages/Submissions';
import SubmissionDetail from './pages/SubmissionDetail';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation bar - visible on all pages */}
          <Navbar />
          
          {/* Route configuration */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes - require authentication */}
            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <Submit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <Submissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions/:id"
              element={
                <ProtectedRoute>
                  <SubmissionDetail />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes - require admin privileges */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

