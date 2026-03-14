import { motion } from 'framer-motion';

export default function EventCard({ event, onRegister }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card flex flex-col"
    >
      {/* Top strip */}
      <div className="h-1.5 bg-gfg-green rounded-t-2xl" />
      <div className="p-6 flex flex-col flex-1">
        {/* Tag + Mode */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${event.color}`}>
            {event.tag}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            event.mode === 'Online'
              ? 'bg-sky-100 text-sky-600'
              : 'bg-orange-100 text-orange-600'
          }`}>
            {event.mode === 'Online' ? '🌐' : '📍'} {event.mode}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug">{event.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{event.description}</p>

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-gray-500 mb-5">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏛️</span>
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>{event.seats} seats available</span>
          </div>
        </div>

        <button
          onClick={() => onRegister(event)}
          className="btn-primary text-sm w-full text-center"
        >
          Register Now →
        </button>
      </div>
    </motion.div>
  );
}
