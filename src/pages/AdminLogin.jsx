import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 30 * 60 * 1000;

/* ─── Animated Particle Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(47,170,90,${d.opacity})`;
        ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i+1).forEach(b => {
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(47,170,90,${0.12*(1-dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      regNo: '2117250040059'
    }
  });
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from || '/admin-dashboard';

  const [loading, setLoading]          = useState(false);
  const [serverError, setServerError]  = useState('');
  const [showPass, setShowPass]        = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [attempts, setAttempts] = useState(() => {
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
      } else setRemaining(rem);
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
      if (user.role !== 'admin') throw new Error('Access denied. Not an admin account.');
      setLoginSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 1200);
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      sessionStorage.setItem('gfg_admin_attempts', newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockedUntil(until);
        sessionStorage.setItem('gfg_admin_locked_until', until);
        setServerError('Account locked for 30 minutes due to too many failed attempts.');
      } else {
        setServerError(`${err.message} (${MAX_ATTEMPTS - newAttempts} attempts left)`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at 20% 50%, #0a1628 0%, #050505 50%, #020c16 100%)' }}>
      
      <ParticleCanvas />

      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #2faa5a 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #1a56db 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#2faa5a 1px, transparent 1px), linear-gradient(90deg, #2faa5a 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md z-10 relative"
      >
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden"
             style={{ background: 'rgba(10,15,25,0.85)', backdropFilter: 'blur(30px)', border: '1px solid rgba(47,170,90,0.15)', boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 1px 0 rgba(47,170,90,0.3) inset' }}>
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #2faa5a, transparent)' }} />
          
          {/* Header strip */}
          <div className="px-8 py-4 flex items-center justify-between border-b border-white/5"
               style={{ background: 'rgba(47,170,90,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono text-green-400/60 tracking-[0.2em] uppercase">GFG Admin Portal v2.0</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-400/60 font-mono">SECURE</span>
            </div>
          </div>

          <div className="p-8 pb-10">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-4 bg-white rounded-2xl px-5 py-3 border border-gray-100 mb-6 shadow-xl"
              >
                <img src="/gfg-logo.png" alt="GeeksforGeeks" className="h-10 w-auto object-contain" />
                <div className="h-8 w-px bg-gray-200" />
                <img src="/rit-logo.png" alt="RIT" className="h-9 w-auto object-contain" />
              </motion.div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.3 }}
                className="hidden items-center justify-center w-20 h-20 rounded-2xl mb-5 relative mx-auto"
                style={{ background: 'linear-gradient(135deg, rgba(47,170,90,0.2), rgba(47,170,90,0.05))', border: '1px solid rgba(47,170,90,0.3)', boxShadow: '0 0 40px rgba(47,170,90,0.2)' }}
              >
                {/* Shield Icon remains as decorative or backup */}
                <div className="absolute inset-0 rounded-2xl"
                     style={{ background: 'conic-gradient(from 0deg, transparent, rgba(47,170,90,0.3), transparent)', animation: 'spin 4s linear infinite', opacity: 0.5 }} />
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="rgba(47,170,90,0.3)" stroke="#2faa5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#2faa5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h1 className="text-2xl font-black text-white tracking-tight">Administrator Access</h1>
                <p className="text-green-400/60 text-xs font-mono mt-1 tracking-widest uppercase">GFG Campus Club — RIT Chennai</p>
              </motion.div>
            </div>

            {/* Lockout banner */}
            <AnimatePresence>
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <p className="text-red-400 font-bold text-sm mb-1">🔒 Account Temporarily Locked</p>
                    <p className="font-mono text-red-400/70 text-2xl font-bold">
                      {Math.floor(remaining/60).toString().padStart(2,'0')}:{(remaining%60).toString().padStart(2,'0')}
                    </p>
                    <p className="text-red-400/50 text-xs mt-1">Time remaining until unlock</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success animation */}
            <AnimatePresence>
              {loginSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-6"
                >
                  <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(47,170,90,0.1)', border: '1px solid rgba(47,170,90,0.3)' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                                className="text-4xl mb-2">✅</motion.div>
                    <p className="text-green-400 font-bold">Access Granted! Redirecting...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!loginSuccess && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Admin Role Identifier (Pre-filled & Read-only) */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <label className="block text-xs font-bold text-green-400/80 mb-2 font-mono uppercase tracking-wider">
                    Portal Identity
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400/60">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <input
                      {...register('regNo')}
                      type="hidden"
                    />
                    <div
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white/50 font-mono text-sm border border-white/5 flex items-center cursor-not-allowed"
                      style={{ background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(10px)' }}
                    >
                      ADMIN
                    </div>
                  </div>
                </motion.div>

                {/* Secret Key */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <label className="block text-xs font-bold text-green-400/80 mb-2 font-mono uppercase tracking-wider">
                    Secret Key
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400/40">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoFocus
                      {...register('password', { required: 'Secret key is required' })}
                      className="w-full pl-12 pr-14 py-3.5 rounded-xl text-white placeholder-gray-600 font-mono text-sm transition-all outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(47,170,90,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(47,170,90,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                      placeholder="••••••••"
                      disabled={isLocked || loading}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} tabIndex="-1"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-400 transition-colors">
                      {showPass ? (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-red-400 text-xs font-mono">{errors.password.message}</p>}
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-start gap-3 p-4 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      <span className="text-red-400 mt-0.5">⚠</span>
                      <p className="text-red-400 text-sm font-mono">{serverError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Attempts bar */}
                {attempts > 0 && !isLocked && (
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-500">Security attempts</span>
                      <span className="text-red-400">{attempts}/{MAX_ATTEMPTS}</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(attempts/MAX_ATTEMPTS)*100}%` }}
                                  className="h-full rounded-full transition-all"
                                  style={{ background: attempts >= 3 ? '#ef4444' : '#f59e0b' }} />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading || isLocked}
                  whileHover={!isLocked && !loading ? { scale: 1.02 } : {}}
                  whileTap={!isLocked && !loading ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                  className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all relative overflow-hidden outline-none"
                  style={{
                    background: isLocked ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #2faa5a, #1e7a40)',
                    color: isLocked ? 'rgba(255,255,255,0.3)' : 'white',
                    boxShadow: isLocked ? 'none' : '0 4px 24px rgba(47,170,90,0.4)',
                  }}
                >
                  {!isLocked && !loading && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                         style={{ background: 'linear-gradient(135deg, #35c466, #22904a)' }} />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Authenticating...
                      </>
                    ) : isLocked ? 'Access Locked' : (
                      <>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        Access Admin Portal
                      </>
                    )}
                  </span>
                </motion.button>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                            className="text-center">
                  <button type="button" onClick={() => navigate('/')}
                          className="text-gray-600 hover:text-green-400 text-xs font-mono uppercase tracking-wider transition-colors">
                    ← Return to Home
                  </button>
                </motion.div>
              </form>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-700 text-xs font-mono mt-4 tracking-wider">
          Unauthorized access is strictly prohibited
        </p>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
