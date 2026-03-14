import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import EventCard from '../components/EventCard';
import { events } from '../data/events';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onRegister = (event) => {
    setSelectedEvent(event);
    setSubmitted(false);
    reset();
  };

  const onSubmit = async (data) => {
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Registration:', { event: selectedEvent.title, ...data });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">What's Happening</span>
          <h1 className="section-title mt-2">Upcoming Events</h1>
          <p className="section-subtitle">Workshops, contests, and career sessions — something for every coder.</p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <EventCard event={event} onRegister={onRegister} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Registration Modal ── */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gfg-green p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-bold text-xl leading-snug">{selectedEvent.title}</h2>
                    <p className="text-gfg-green-pale text-sm mt-1">{selectedEvent.date}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-white/70 hover:text-white ml-4 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Registration Successful!</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      You're registered for <strong>{selectedEvent.title}</strong>. Check your email for confirmation.
                    </p>
                    <button onClick={() => setSelectedEvent(null)} className="btn-primary text-sm">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                        placeholder="e.g. Arjun Sharma"
                        {...register('name', {
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        })}
                      />
                      {errors.name && <p className="error-msg">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">College Email *</label>
                      <input
                        type="email"
                        className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                        placeholder="your@rit.edu.in"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Enter a valid email address',
                          },
                        })}
                      />
                      {errors.email && <p className="error-msg">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                      <input
                        className={`input-field ${errors.roll ? 'border-red-400' : ''}`}
                        placeholder="e.g. 1RV23CS001"
                        {...register('roll', {
                          required: 'Roll number is required',
                        })}
                      />
                      {errors.roll && <p className="error-msg">{errors.roll.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                        <select
                          className={`input-field ${errors.branch ? 'border-red-400' : ''}`}
                          {...register('branch', { required: 'Select your branch' })}
                        >
                          <option value="">Select</option>
                          {['CSE', 'IT', 'ECE', 'EEE', 'ME', 'Civil', 'Other'].map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                        {errors.branch && <p className="error-msg">{errors.branch.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                        <select
                          className={`input-field ${errors.year ? 'border-red-400' : ''}`}
                          {...register('year', { required: 'Select year' })}
                        >
                          <option value="">Select</option>
                          {['1st', '2nd', '3rd', '4th'].map((y) => (
                            <option key={y}>{y}</option>
                          ))}
                        </select>
                        {errors.year && <p className="error-msg">{errors.year.message}</p>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Registering…
                        </>
                      ) : (
                        'Confirm Registration'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
