import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Learn from './pages/Learn';
import Login from './pages/Login';
import Register from './pages/Register';
import Practice from './pages/Practice';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/"         element={<Home />} />
              <Route path="/contact"  element={<Contact />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes — require login */}
              <Route path="/events"    element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/practice"  element={<ProtectedRoute><Practice /></ProtectedRoute>} />
              <Route path="/learn"     element={<ProtectedRoute><Learn /></ProtectedRoute>} />
              
              {/* Admin only */}
              <Route path="/admin"     element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
