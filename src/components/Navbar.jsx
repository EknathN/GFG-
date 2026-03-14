import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home',      to: '/' },
  { label: 'Events',    to: '/events',    protected: true },
  { label: 'Resources', to: '/resources', protected: true },
  { label: 'Community', to: '/community', protected: true },
  { label: '🎯 Practice', to: '/practice', protected: true },
  { label: '🎓 Learn',  to: '/learn',     protected: true, highlight: true },
  { label: 'Contact',   to: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();
  const { isAuthenticated, currentUser, logout, deleteAccount } = useAuth();
  const dropRef    = useRef(null);

  useEffect(() => { setIsOpen(false); }, [location]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleProtectedClick = (e, link) => {
    if (link.protected && !isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: link.to } });
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete your GFG Club account and all your data. Are you absolutely sure?")) {
      try {
        await deleteAccount();
        setShowDropdown(false);
        navigate('/');
      } catch (err) {
        alert("Failed to delete account.");
      }
    }
  };

  const initials = currentUser?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logos */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 shadow-sm border border-gray-100">
              <img src="/gfg-logo.png" alt="GeeksforGeeks" className="h-7 w-auto object-contain" />
              <div className="h-5 w-px bg-gray-200" />
              <img src="/rit-logo.png" alt="RIT" className="h-6 w-auto object-contain" />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}
                  onClick={(e) => handleProtectedClick(e, link)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    link.highlight
                      ? 'bg-gfg-green text-white hover:bg-gfg-green-dark shadow-sm'
                      : active
                        ? 'bg-gfg-green-pale text-gfg-green'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gfg-green'
                  }`}>
                  {link.label}
                  {link.protected && !isAuthenticated && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full text-[7px] flex items-center justify-center text-white">🔒</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side: auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropRef}>
                <button onClick={() => setShowDropdown(d => !d)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 transition-all">
                  <div className="w-7 h-7 bg-gfg-green rounded-full flex items-center justify-center text-white text-xs font-black">
                    {initials}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800 leading-tight">{currentUser?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-gray-400">{currentUser?.dept} · {currentUser?.year}</p>
                  </div>
                  <span className="text-gray-400 text-xs">{showDropdown ? '▲' : '▼'}</span>
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-50 bg-gray-50">
                        <p className="font-bold text-sm text-gray-800">{currentUser?.name}</p>
                        <p className="text-xs text-gray-400">{currentUser?.regNo}</p>
                        <p className="text-xs text-gray-400">{currentUser?.dept} · {currentUser?.section} · {currentUser?.year}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={handleLogout}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black rounded-xl transition-all font-semibold">
                          <span>🚪 Sign Out</span>
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button onClick={handleDeleteAccount}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all font-semibold">
                          <span>🗑️ Delete Account</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-gfg-green px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-5">Join Club</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsOpen(o => !o)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" aria-label="Menu">
            <div className="space-y-1.5">
              {[0,1,2].map(i => (
                <motion.div key={i} animate={ isOpen
                    ? i === 1 ? { opacity: 0, x: -10 } : { rotate: i === 0 ? 45 : -45, y: i === 0 ? 8 : -8 }
                    : { rotate: 0, y: 0, opacity: 1 }}
                  className="w-6 h-0.5 bg-gray-700 rounded-full" />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  onClick={(e) => handleProtectedClick(e, link)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === link.to
                      ? 'bg-gfg-green-pale text-gfg-green'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  {link.label}
                  {link.protected && !isAuthenticated && <span className="text-amber-400">🔒</span>}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <div>
                    <p className="px-4 py-2 text-sm font-bold text-gray-700">{currentUser?.name}</p>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold">
                      🚪 Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-center">Login</Link>
                    <Link to="/register" className="btn-primary w-full text-center block">Join Club</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
