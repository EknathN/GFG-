import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || '/';

  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [attempts, setAttempts]     = useState(() => {
    const v = sessionStorage.getItem('gfg_login_attempts');
    return v ? parseInt(v, 10) : 0;
  });
  const [lockedUntil, setLockedUntil] = useState(() => {
    const v = sessionStorage.getItem('gfg_locked_until');
    return v ? parseInt(v, 10) : 0;
  });

  // Live lockout timer
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const rem = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (rem <= 0) {
        setLockedUntil(0); setAttempts(0);
        sessionStorage.removeItem('gfg_login_attempts');
        sessionStorage.removeItem('gfg_locked_until');
        setRemaining(0);
      } else {
        setRemaining(rem);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = lockedUntil > Date.now();

  const onSubmit = async (data) => {
    if (isLocked) return;
    setLoading(true); setServerError('');
    try {
      await login(data.regNo, data.password, data.rememberMe);
      // Reset attempts on success
      sessionStorage.removeItem('gfg_login_attempts');
      sessionStorage.removeItem('gfg_locked_until');
      navigate(from, { replace: true });
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      sessionStorage.setItem('gfg_login_attempts', newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockedUntil(until);
        sessionStorage.setItem('gfg_locked_until', until);
        setServerError(`Too many failed attempts. Account locked for 15 minutes.`);
      } else {
        setServerError(`${err.message} (${MAX_ATTEMPTS - newAttempts} attempts remaining)`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center px-4 pt-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-4 justify-center mb-8 flex-wrap">
          <div className="bg-white rounded-2xl px-3 py-2 shadow-lg">
            <img src="/gfg-logo.png" alt="GFG" className="h-9 w-auto object-contain" />
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="bg-white rounded-2xl px-3 py-2 shadow-lg">
            <img src="/rit-logo.png" alt="RIT" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white text-center mb-1">Member Login</h1>
          <p className="text-gray-400 text-sm text-center mb-8">GFG Campus Club @ RIT</p>

          {/* Security indicators */}
          <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/20 rounded-xl px-4 py-2.5 mb-6">
            <span className="text-green-400 text-sm">🔒</span>
            <span className="text-green-300 text-xs font-medium">256-bit AES encrypted · PBKDF2 hashing · Session-based auth</span>
          </div>

          {isLocked && (
            <div className="bg-red-900/40 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-center">
              <p className="text-red-300 font-bold text-sm">🔐 Account Temporarily Locked</p>
              <p className="text-red-400 text-xs mt-1">
                {Math.floor(remaining/60)}m {remaining%60}s remaining
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Reg No */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Registration Number</label>
              <input {...register('regNo', { required: 'Registration number is required' })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gfg-green focus:ring-2 focus:ring-gfg-green/30 transition-all uppercase"
                placeholder="e.g. 211EC030" disabled={isLocked} />
              {errors.regNo && <p className="text-red-400 text-xs mt-1">{errors.regNo.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-gfg-green focus:ring-2 focus:ring-gfg-green/30 transition-all"
                  placeholder="Your password" disabled={isLocked} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" {...register('rememberMe')}
                className="w-4 h-4 rounded border-gray-600 bg-white/10 text-gfg-green focus:ring-gfg-green/30" />
              <label htmlFor="rememberMe" className="text-gray-300 text-sm select-none">
                Remember me <span className="text-gray-500">(30 days)</span>
              </label>
            </div>

            {/* Attempt indicator */}
            {attempts > 0 && !isLocked && (
              <div className="flex gap-1 items-center">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full ${i < attempts ? 'bg-red-500' : 'bg-white/20'}`} />
                ))}
              </div>
            )}

            {serverError && (
              <div className="bg-red-900/40 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm font-medium">
                ⚠️ {serverError}
              </div>
            )}

            <button type="submit" disabled={loading || isLocked}
              className="w-full bg-gfg-green hover:bg-gfg-green-dark text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gfg-green/20">
              {loading
                ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</>
                : isLocked ? '🔐 Locked' : '🔓 Login'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Not a member yet?{' '}
              <Link to="/register" className="text-gfg-green font-semibold hover:underline">Join the Club →</Link>
            </p>
            <Link to="/" className="text-gray-600 hover:text-gray-400 text-xs block">← Back to Home</Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          🔒 Passwords are hashed with PBKDF2-SHA256 (100,000 iterations).<br />
          Data is encrypted with AES-GCM-256 before storage.
        </p>
      </motion.div>
    </div>
  );
}
