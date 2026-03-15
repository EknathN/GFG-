import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        bio: currentUser.bio || '',
        experience: currentUser.experience || '',
        certifications: currentUser.certifications || '',
        github: currentUser.github || '',
        linkedin: currentUser.linkedin || '',
        skills: currentUser.skills || '',
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await updateUser(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-gfg-green">Home</button>
          <span>/</span>
          <span className="text-gray-900 font-bold">Profile Settings</span>
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-gfg-green-dark to-gfg-green p-10 text-white relative">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-black border-4 border-white/30">
                {currentUser?.name ? currentUser.name[0].toUpperCase() : '?'}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black">{currentUser?.name || 'User'}</h1>
                <p className="text-gfg-green-pale font-medium mt-1">{currentUser?.regNo} • {currentUser?.dept}</p>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 transform translate-x-20 pointer-events-none" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            {/* Identity Group (Read Only) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gfg-green rounded-full" />
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">University Identity</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-gray-100/50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Institutional Email</label>
                  <p className="font-bold text-gray-700">{currentUser?.email}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-gray-100/50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Campus Status</label>
                  <p className="font-bold text-gray-700">{currentUser?.role?.toUpperCase()} • {currentUser?.year || '1st Year'}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic">Core academic details are managed by the club administration and cannot be changed here.</p>
            </section>

            <div className="h-px bg-gray-100 w-full" />

            {/* Editable Profile Details */}
            <section className="space-y-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gfg-green rounded-full" />
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Professional Profile</h2>
              </div>

              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell the club about your interests and goals..."
                    className="input-field w-full h-28 resize-none py-4"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Key Skills</label>
                  <input 
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. JavaScript, Python, Web Design, Data Structures"
                    className="input-field w-full py-4 text-base"
                  />
                </div>

                {/* Experience & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Projects & Experience</label>
                    <textarea 
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="List your internships or club projects..."
                      className="input-field w-full h-44 resize-none py-4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Certifications & Achievements</label>
                    <textarea 
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      placeholder="Courses completed, competitions won, etc."
                      className="input-field w-full h-44 resize-none py-4"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">GitHub Profile</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">github.com/</span>
                      <input 
                        name="github"
                        value={(formData.github || '').replace('https://github.com/', '')}
                        onChange={handleChange}
                        placeholder="yourusername"
                        className="input-field w-full py-4 pl-[110px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn Profile</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">linkedin.com/in/</span>
                      <input 
                        name="linkedin"
                        value={(formData.linkedin || '').replace('https://linkedin.com/in/', '')}
                        onChange={handleChange}
                        placeholder="yourprofile"
                        className="input-field w-full py-4 pl-[125px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Error/Success Feedbacks */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold">
                  <span>⚠️</span> {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-700 font-bold">
                  <span>✅</span> Profile updated successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 font-black hover:border-gray-200 hover:text-gray-600 transition-all uppercase tracking-widest text-xs"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] px-12 py-4 rounded-2xl bg-gfg-green text-white font-black hover:bg-gfg-green-dark shadow-xl shadow-gfg-green/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Update My Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
