import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api';

function MentorCard({ mentor, onBook }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {mentor.image ? (
             <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full object-cover border-2 border-gfg-green/20" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gfg-green-pale flex items-center justify-center text-gfg-green font-bold text-xl border-2 border-gfg-green/20">
              {mentor.name?.charAt(0) || 'M'}
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
            <p className="text-sm font-medium text-gfg-green">{mentor.expertise || 'General Tech'}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6 line-clamp-3">
          {mentor.bio || 'Experienced mentor ready to guide you on your tech journey.'}
        </p>
        <button
          onClick={() => onBook(mentor)}
          className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <span>📅</span> Book a Session
        </button>
      </div>
    </div>
  );
}

export default function Mentors() {
  const { currentUser } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Modal State
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/mentors`)
      .then(res => res.json())
      .then(data => setMentors(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
    }
  });

  const openBooking = (mentor) => {
    setSelectedMentor(mentor);
    setSubmitted(false);
    setShowModal(true);
    reset();
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedMentor(null);
      setSubmitted(false);
    }, 200);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        studentName: data.name,
        studentEmail: data.email,
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        mentorEmail: selectedMentor.email || 'mentor@example.com',
        date: data.date,
        time: data.time,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/xyz-abcd-efg' // Dummy link for MVP
      };

      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to book session');
      
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong while booking. Please try again.");
    }
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
          <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">Connect & Grow</span>
          <h1 className="section-title mt-2">Find a Mentor</h1>
          <p className="section-subtitle">Book a 1-on-1 session with our experienced members and alumni.</p>
        </motion.div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gfg-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-4xl block mb-4">👥</span>
            <h3 className="text-lg font-bold text-gray-800">No Mentors Available Yet</h3>
            <p className="text-gray-500">Mentors will appear here once they are added by the admin.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentors.map((mentor, i) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <MentorCard mentor={mentor} onBook={openBooking} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && selectedMentor && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
             onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
             <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 10 }}
               className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
             >
               <div className="bg-gfg-green p-6 rounded-t-2xl relative">
                  <h2 className="text-white font-bold text-xl pr-8">Book with {selectedMentor.name}</h2>
                  <p className="text-gfg-green-pale text-sm mt-1">1-on-1 Mentorship Session (30 mins)</p>
                  <button
                    onClick={closeModal}
                    className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
               </div>

               <div className="p-6">
                 {submitted ? (
                   <div className="text-center py-8">
                     <div className="text-5xl mb-4">✅</div>
                     <h3 className="font-bold text-xl text-gray-900 mb-2">Session Booked!</h3>
                     <p className="text-gray-500 text-sm mb-6">
                       Your meeting is confirmed. We will email you a reminder and the Google Meet link 30 minutes before it starts.
                     </p>
                     <button onClick={closeModal} className="btn-primary w-full text-sm">Return to Mentors</button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                       <input
                         className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                         {...register('name', { required: 'Name is required' })}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                       <input
                         type="email"
                         className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                         {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4 mt-2">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                         <input
                           type="date"
                           className={`input-field ${errors.date ? 'border-red-400' : ''}`}
                           min={new Date().toISOString().split('T')[0]} // Cannot book in the past
                           {...register('date', { required: 'Date is required' })}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                         <input
                           type="time"
                           className={`input-field ${errors.time ? 'border-red-400' : ''}`}
                           {...register('time', { required: 'Time is required' })}
                         />
                       </div>
                     </div>
                     <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs mt-2 border border-blue-100 flex gap-2">
                       <span>ℹ️</span> 
                       <span>You will receive an automated email reminder 30 minutes before your scheduled time.</span>
                     </div>
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
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
