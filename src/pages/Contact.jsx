import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const socialLinks = [
  { icon: '💼', label: 'LinkedIn', sub: 'GFG Club @ RIT', href: '#', color: 'hover:border-blue-500 hover:bg-blue-50' },
  { icon: '💬', label: 'WhatsApp', sub: 'Join our community group', href: '#', color: 'hover:border-green-500 hover:bg-green-50' },
  { icon: '🎮', label: 'Discord', sub: 'Coding discussions & help', href: '#', color: 'hover:border-indigo-500 hover:bg-indigo-50' },
  { icon: '📸', label: 'Instagram', sub: '@gfgclub_rit', href: '#', color: 'hover:border-pink-500 hover:bg-pink-50' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          status: 'unread'
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitted(true);
      reset();
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">Reach Out</span>
          <h1 className="section-title mt-2">Get In Touch</h1>
          <p className="section-subtitle">Questions, ideas, or just want to say hi? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left – Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-bold text-xl text-gray-900 mb-6">Query Support Form</h2>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Thanks for reaching out. We'll get back to you within 24–48 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline text-sm">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                        placeholder="Your name"
                        {...register('name', {
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'At least 2 characters' },
                        })}
                      />
                      {errors.name && <p className="error-msg">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                        placeholder="you@email.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                        })}
                      />
                      {errors.email && <p className="error-msg">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      className={`input-field ${errors.subject ? 'border-red-400' : ''}`}
                      {...register('subject', { required: 'Please select a subject' })}
                    >
                      <option value="">Select a topic</option>
                      {[
                        'Membership & Joining',
                        'Event Registration',
                        'Technical Support',
                        'Sponsorship & Collaboration',
                        'Blog Submission',
                        'Other',
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    {errors.subject && <p className="error-msg">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      rows={5}
                      className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`}
                      placeholder="Write your message here…"
                      {...register('message', {
                        required: 'Message cannot be empty',
                        minLength: { value: 20, message: 'Please write at least 20 characters' },
                      })}
                    />
                    {errors.message && <p className="error-msg">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send Message →'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right – Info + Social */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info Card */}
            <div className="bg-gfg-green rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Club Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">📧</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gfg-green-pale">gfgclub@rit.edu.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">📍</span>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gfg-green-pale">CLT 2108, RIT Campus, Bangalore</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">🕐</span>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-gfg-green-pale">Within 24–48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Community Groups</h3>
              <div className="space-y-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className={`flex items-center gap-3 p-3 rounded-xl border border-gray-100 transition-all duration-200 ${s.color} group`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{s.label}</p>
                      <p className="text-xs text-gray-400">{s.sub}</p>
                    </div>
                    <span className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
