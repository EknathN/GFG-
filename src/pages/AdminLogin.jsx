import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 30 * 60 * 1000; // 30 minutes

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || '/admin-dashboard';

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
        throw new Error("Access Denied: Terminal clearance required.");
      }
      // Successful login animation delay
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 800);
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      sessionStorage.setItem('gfg_admin_attempts', newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockedUntil(until);
        sessionStorage.setItem('gfg_admin_locked_until', until);
        setServerError(`Terminal locked. Try again in 30 minutes.`);
      } else {
        setServerError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
      setLoading(false);
    } 
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 font-sans selection:bg-gfg-green selection:text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gfg-green/20 blur-[150px] rounded-full" 
        />
        <motion.div 
            animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, -90, 0],
                opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10 relative"
      >
        {/* Terminal Header Decor */}
        <div className="absolute -top-4 left-6 px-3 py-1 bg-[#111] border border-white/10 rounded-md flex items-center gap-2 z-20 shadow-xl">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">System Override</span>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-10 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Internal gradient shine */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gfg-green/50 to-transparent" />
          
          <div className="text-center mb-12">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-b from-white/10 to-white/5 rounded-3xl mb-6 shadow-[0_0_40px_rgba(47,133,90,0.15)] border border-white/10 relative"
            >
              <div className="absolute inset-0 bg-gfg-green/20 blur-xl rounded-full" />
              <span className="text-4xl relative z-10 filter drop-shadow-md">🛡️</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Admin Terminal</h1>
            <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Enter Credentials</p>
          </div>

          <AnimatePresence>
            {isLocked && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center backdrop-blur-md">
                  <p className="text-red-400 font-bold mb-1 flex items-center justify-center gap-2">
                    <span className="animate-spin">⛔</span> System Locked
                  </p>
                  <p className="text-red-400/80 font-mono text-sm">
                    {Math.floor(remaining/60).toString().padStart(2, '0')}:{remaining%60.toString().padStart(2, '0')} remaining
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#0a0a0a] text-[10px] font-bold text-gfg-green uppercase tracking-widest z-10 transition-colors group-focus-within:text-white">Admin ID</label>
              <input 
                {...register('regNo', { required: 'Admin ID is required' })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gfg-green focus:bg-white/[0.05] transition-all font-mono uppercase tracking-wider relative z-0"
                placeholder="e.g. 2117250040059" 
                disabled={isLocked || loading} 
              />
              {errors.regNo && <p className="text-red-400 text-xs font-mono mt-2 ml-2">{errors.regNo.message}</p>}
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#0a0a0a] text-[10px] font-bold text-gfg-green uppercase tracking-widest z-10 transition-colors group-focus-within:text-white">Secret Key</label>
              <div className="relative">
                <input 
                  type={showPass ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 pr-14 text-white placeholder-gray-600 focus:outline-none focus:border-gfg-green focus:bg-white/[0.05] transition-all font-mono tracking-wider relative z-0"
                  placeholder="••••••••" 
                  disabled={isLocked || loading} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  tabIndex="-1"
                >
                  {showPass ? '🙉' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs font-mono mt-2 ml-2">{errors.password.message}</p>}
            </div>

            <AnimatePresence>
                {serverError && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm font-mono flex items-center gap-3 backdrop-blur-md"
                >
                    <span className="text-lg">⚠️</span> {serverError}
                </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
              type="submit" 
              disabled={loading || isLocked}
              className={`w-full py-4 rounded-xl font-black tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg relative overflow-hidden group ${
                  isLocked ? 'bg-white/5 text-gray-500 pointer-events-none' : 'bg-white text-black hover:bg-gfg-green hover:text-white hover:shadow-gfg-green/25'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-gfg-green border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-sm">AUTHENTICATING...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">INITIALIZE</span>
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-500 hover:text-white text-sm font-mono uppercase tracking-widest transition-colors inline-block pb-1 border-b border-transparent hover:border-white/20"
            >
              Cancel & Return
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
