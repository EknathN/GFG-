import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { BrowserMultiFormatReader } from '@zxing/library';
import { registerUser } from '../utils/crypto';

const DEPTS = ['CSE','ECE','EEE','IT','MECH','CIVIL','AIDS','AIML','CSD','IoT'];
const SECTIONS = ['A','B','C','D','E'];
const YEARS = ['1st Year','2nd Year','3rd Year','4th Year'];
const SEMS = ['1st Sem','2nd Sem','3rd Sem','4th Sem','5th Sem','6th Sem','7th Sem','8th Sem'];

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoB64, setPhotoB64] = useState('');
  const [qrData, setQrData] = useState(null);
  const [qrError, setQrError] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState(['','','','','','']);
  const [actualOtp, setActualOtp] = useState('');
  const [cachedData, setCachedData] = useState(null);
  const fileRef = useRef();

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
      setServerError('ID card must be JPG, PNG, or WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setServerError('ID card image must be under 2 MB.');
      return;
    }
    setServerError('');
    setQrError('Scanning for QR Code...');
    setQrData(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhotoPreview(dataUrl);
      setPhotoB64(dataUrl);

      // Scan QR Code with zxing
      const codeReader = new BrowserMultiFormatReader();
      const img = new Image();
      img.onload = async () => {
        try {
          const result = await codeReader.decodeFromImageElement(img);
          if (result && result.getText()) {
            setQrData(result.getText());
            setQrError('');
          } else {
            setQrError('No QR Code detected. Try ensuring the QR code is well-lit and clearly visible.');
          }
        } catch (err) {
          // If the first simple pass fails, try to apply some contrast via canvas to help it
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.filter = 'contrast(200%) grayscale(100%)';
          ctx.drawImage(img, 0, 0, img.width, img.height);
          
          try {
             // Pass the canvas image data to zxing via a new image element
             const enhancedImg = new Image();
             enhancedImg.onload = async () => {
               try {
                 const res2 = await codeReader.decodeFromImageElement(enhancedImg);
                 if (res2 && res2.getText()) {
                   setQrData(res2.getText());
                   setQrError('');
                 } else {
                   setQrError('No QR Code detected. Please upload a clear photo of your ID card.');
                 }
               } catch (e2) {
                 setQrError('Failed to read QR. Ensure the entire QR block is visible and unblurred.');
               }
             };
             enhancedImg.src = canvas.toDataURL();
          } catch (e) {
             setQrError('Failed to read QR. Ensure the entire QR block is visible and unblurred.');
          }
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    if (!photoB64) { setServerError('Please upload your ID card photo.'); return; }
    if (!qrData) { setServerError('Registration blocked: Cannot read QR Code from ID card. Please upload a better photo.'); return; }

    // Security check: Match form inputs against parsed QR data
    const codeStr = qrData.toLowerCase();
    
    // Check if the QR code is an RIT ID Verification URL
    const isRitUrl = codeStr.includes('ims.ritchennai.edu.in/id-card/qr-verification');

    if (isRitUrl) {
      setLoading(true);
      setServerError('');
      try {
        const urlToFetch = qrData.trim();
        
        // Multi-proxy fallback system to prevent Network Errors
        const proxies = [
          `https://api.allorigins.win/raw?url=${encodeURIComponent(urlToFetch)}`,
          `https://corsproxy.io/?url=${encodeURIComponent(urlToFetch)}`,
          `https://api.codetabs.com/v1/proxy?quest=${urlToFetch}`
        ];

        let html = null;
        for (const proxy of proxies) {
          try {
            const res = await fetch(proxy);
            if (res.ok) {
              html = await res.text();
              if (html && html.includes('Student Name')) break; // Successfully fetched the RIT page
            }
          } catch (e) {
            console.warn("Proxy failed, trying next...", proxy);
          }
        }

        if (!html) {
          throw new Error("All proxies failed to load ID card details from RIT servers.");
        }
        
        html = html.toLowerCase();
        
        // Ensure the inputted registration number actually exists on the official RIT verification page
        const inputReg = data.regNo.toLowerCase().replace(/\s+/g, '');
        if (!html.includes(inputReg)) {
           setServerError(`Identity Verification Failed: The scanned ID card does not belong to Reg No ${data.regNo}.`);
           setLoading(false);
           return;
        }
      } catch (err) {
        console.error(err);
        setServerError('Network error while verifying ID card with RIT servers. The RIT server might be blocking external connections temporarily.');
        setLoading(false);
        return;
      }
      setLoading(false);
    } else {
      // Fallback: If it's not the URL, try the text match (in case some IDs have raw text)
      const cleanCodeStr = codeStr.replace(/\s+/g, '');
      const inputReg = data.regNo.toLowerCase().replace(/\s+/g, '');
      const inputNameParts = data.name.toLowerCase().split(/\s+/).filter(Boolean);

      if (!cleanCodeStr.includes(inputReg)) {
        setServerError(`Verification failed: QR does not match Reg No ${data.regNo}. (Scanned: "${qrData.substring(0, 60)}...")`);
        return;
      }

      const nameMatch = inputNameParts.some(part => part.length >= 3 && codeStr.includes(part));
      if (!nameMatch) {
        setServerError(`Verification failed: QR does not match Name "${data.name}". (Scanned: "${qrData.substring(0, 60)}...")`);
        return;
      }
    }

    // Email Domain verification
    if (!data.email.toLowerCase().endsWith('ritchennai.edu.in')) {
      setServerError('Access Denied: You must register with an @ritchennai.edu.in or department email address.');
      return;
    }

    setLoading(true); setServerError('');

    try {
      await registerUser({ ...data, idCardPhoto: photoB64 });
      setSuccess(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gfg-green-dark to-gfg-green flex items-center justify-center px-4 pt-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome to GFG Club!</h2>
          <p className="text-gray-500 mb-6">Your account has been created successfully. You can now log in.</p>
          <Link to="/login" className="btn-primary w-full block text-center">Go to Login →</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-gfg-green-dark to-gfg-green py-12 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
            <img src="/gfg-logo.png" alt="GFG" className="h-10 w-auto bg-white rounded-xl px-2 py-1" />
            <div className="h-8 w-px bg-white/30" />
            <img src="/rit-logo.png" alt="RIT" className="h-9 w-auto bg-white rounded-xl px-2 py-1" />
          </div>
          <h1 className="text-3xl font-black text-white">Join GFG Campus Club</h1>
          <p className="text-gfg-green-pale mt-2">Fill in your details to become a member</p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Security badge */}
          <div className="bg-green-50 border-b border-green-100 px-6 py-3 flex items-center gap-2 text-sm text-green-700">
            <span>🔒</span>
            <span className="font-semibold">Secured with AES-256 encryption & PBKDF2 password hashing</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input {...register('name', { required: 'Full name is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                className="input-field w-full" placeholder="e.g. Arjun Sharma" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* College Reg No. */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">College Reg. Number *</label>
              <input {...register('regNo', { required: 'Reg number required', pattern: { value: /^[A-Z0-9]{6,20}$/i, message: 'Invalid reg number format' } })}
                className="input-field w-full uppercase" placeholder="e.g. 211EC030" />
              {errors.regNo && <p className="text-red-500 text-xs mt-1">{errors.regNo.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">College Email *</label>
              <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                className="input-field w-full" placeholder="you@rit.edu.in" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Dept + Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department *</label>
                <select {...register('dept', { required: 'Select department' })} className="input-field w-full">
                  <option value="">– Select –</option>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.dept && <p className="text-red-500 text-xs mt-1">{errors.dept.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section *</label>
                <select {...register('section', { required: 'Select section' })} className="input-field w-full">
                  <option value="">– Select –</option>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>}
              </div>
            </div>

            {/* Year + Semester */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year *</label>
                <select {...register('year', { required: 'Select year' })} className="input-field w-full">
                  <option value="">– Select –</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Semester *</label>
                <select {...register('sem', { required: 'Select semester' })} className="input-field w-full">
                  <option value="">– Select –</option>
                  {SEMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.sem && <p className="text-red-500 text-xs mt-1">{errors.sem.message}</p>}
              </div>
            </div>

            {/* ID Card Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">College ID Card Photo *</label>
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gfg-green hover:bg-gfg-green-pale transition-all">
                {photoPreview ? (
                  <div>
                    <img src={photoPreview} alt="ID Preview" className="max-h-40 mx-auto rounded-lg object-contain border border-gray-200" />
                    {qrData && <p className="text-green-600 font-bold text-xs mt-3 flex items-center justify-center gap-1">✅ QR Code Verified</p>}
                    {qrError && <p className="text-red-500 font-bold text-xs mt-3">{qrError}</p>}
                    <p className="text-gray-400 text-xs mt-2 underline">Click to change photo</p>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-500 text-sm font-semibold">Click to upload your ID card</p>
                    <p className="text-gray-400 text-xs mt-1">Must contain clear, scannable QR Code</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="hidden" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Create Password *</label>
              <input type="password" {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Minimum 8 characters' }, pattern: { value: /^(?=.*[A-Z])(?=.*\d)/, message: 'Must contain uppercase letter and number' } })}
                className="input-field w-full" placeholder="Min 8 chars, 1 uppercase, 1 number" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
              <input type="password" {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === watch('password') || 'Passwords do not match' })}
                className="input-field w-full" placeholder="Re-enter password" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
                ⚠️ {serverError}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full text-base py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Encrypting & Saving…</>
                : '🚀 Join GFG Club'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already a member?{' '}
              <Link to="/login" className="text-gfg-green font-semibold hover:underline">Log in here →</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
