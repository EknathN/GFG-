import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 30 * 60 * 1000; // 30 minutes for admin

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || '/admin';

  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [attempts, setAttempts]     = useState(() => {
    const v = sessionStorage.getItem('gfg_admin_attempts');
    return v ? parseInt(v, 10) : 0;
  });
  const [lockedUntil, setLockedUntil] = useState(() => {
    const v = sessionStorage.getItem('gfg_admin_locked_until');
    return v ? parseInt(v, 10) : 0;
  });

  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const rem = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (rem <= 0) {
        setLockedUntil(0); setAttempts(0);
        sessionStorage.removeItem('gfg_admin_attempts');
        sessionStorage.removeItem('gfg_admin_locked_until');
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
      const user = await login(data.regNo, data.password, false);
      if (user.role !== 'admin') {
        throw new Error("Access Denied: Admin privileges required.");
      }
      navigate(from, { replace: true });
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      sessionStorage.setItem('gfg_admin_attempts', newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockedUntil(until);
        sessionStorage.setItem('gfg_admin_locked_until', until);
        setServerError(`Account locked for security. Try again in 30 minutes.`);
      } else {
        setServerError(`${err.message} (${MAX_ATTEMPTS - newAttempts} attempts remaining)`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gfg-green/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gfg-green/10 rounded-3xl mb-6 border border-gfg-green/20">
              <span className="text-4xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 mt-2 font-medium">Restricted Access Area</p>
          </div>

          {isLocked && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 text-center">
              <p className="text-red-400 font-bold">🔐 Security Lockout Active</p>
              <p className="text-red-400/60 text-sm mt-1">
                {Math.floor(remaining/60)}m {remaining%60}s remaining
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Admin ID</label>
              <input {...register('regNo', { required: 'Admin ID is required' })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gfg-green focus:ring-4 focus:ring-gfg-green/10 transition-all font-mono uppercase"
                placeholder="REGISTRATION NO" disabled={isLocked} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Secret Key</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-gray-600 focus:outline-none focus:border-gfg-green focus:ring-4 focus:ring-gfg-green/10 transition-all font-mono"
                  placeholder="••••••••" disabled={isLocked} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {serverError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-medium flex items-center gap-3">
                <span>⚠️</span> {serverError}
              </motion.div>
            )}

            <button type="submit" disabled={loading || isLocked}
              className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-gfg-green hover:text-white transition-all transform active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl shadow-white/5">
              {loading ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : 'AUTHENTICATE'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-400 text-sm font-bold transition-colors">
              Public Homepage
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
