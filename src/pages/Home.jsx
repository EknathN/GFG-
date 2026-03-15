import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroBackground3D from '../components/HeroBackground3D';

const stats = [
  { label: 'Active Members', value: '200+', icon: '👥' },
  { label: 'Events Hosted', value: '45+', icon: '🎉' },
  { label: 'Problems Solved', value: '10K+', icon: '💻' },
  { label: 'Placements', value: '80+', icon: '🚀' },
];

const values = [
  { icon: '💻', title: 'Code Together', desc: 'Weekly DSA sessions, pair programming, and collaborative problem solving.' },
  { icon: '🚀', title: 'Grow Together', desc: 'Resume reviews, mock interviews, and mentorship from seniors and alumni.' },
  { icon: '🏆', title: 'Compete Together', desc: 'Team up for hackathons, coding contests, and inter-college competitions.' },
];

const timeline = [
  { year: '2022', title: 'Club Founded', desc: 'GFG Campus Club launched at RIT with 30 founding members.' },
  { year: '2023', title: 'First Hackathon', desc: 'Club team reached national finals in Smart India Hackathon.' },
  { year: '2024', title: '10,000 Problems Solved', desc: 'Milestone reached collectively. Hosted first inter-college DSA contest.' },
  { year: '2025', title: '80+ Placements', desc: 'Members placed at Google, Amazon, Microsoft, and top startups.' },
  { year: '2026', title: 'Now Recruiting!', desc: 'Batch 2026 registration open. Join 200+ members transforming their careers.' },
];

const team = [
  { name: 'Arjun Sharma', role: 'President', dept: 'CSE 4th Year', emoji: '👨‍💻' },
  { name: 'Priya Nair', role: 'Vice President', dept: 'ECE 4th Year', emoji: '👩‍💻' },
  { name: 'Rohan Kulkarni', role: 'DSA Lead', dept: 'CSE 3rd Year', emoji: '🧑‍💻' },
  { name: 'Ananya Desai', role: 'Events Coordinator', dept: 'IT 3rd Year', emoji: '👩‍💼' },
  { name: 'Karthik Rao', role: 'Tech Lead', dept: 'CSE 3rd Year', emoji: '👨‍🔬' },
  { name: 'Sneha Patel', role: 'Content Lead', dept: 'AIDS 2nd Year', emoji: '👩‍🎨' },
];

const faqs = [
  { q: 'Who can join the GFG Campus Club?', a: 'Any student of RIT, regardless of branch or year. We welcome beginners and experienced coders.' },
  { q: 'Is there any membership fee?', a: 'No! Joining the GFG Campus Club is completely free.' },
  { q: 'How many hours per week does it take?', a: 'As little or as much as you like. Most members spend 3-5 hours per week attending sessions.' },
  { q: 'I am a beginner. Is this club for me?', a: 'Absolutely! We have beginner tracks in the Learning Hub, and mentors to guide you from zero.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
        <HeroBackground3D />
        
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="mb-6">
              {/* Logos on white pill background so they're visible on dark hero */}
              <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-4 py-2.5 shadow-lg flex-wrap">
                <img
                  src="/gfg-logo.png"
                  alt="GeeksforGeeks"
                  className="h-8 w-auto object-contain"
                />
                <div className="h-6 w-px bg-gray-300" />
                <img
                  src="/rit-logo.png"
                  alt="Rajalakshmi Institute of Technology"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 bg-gfg-green/20 border border-gfg-green/30 text-gfg-green-light text-sm font-semibold px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-gfg-green-light animate-pulse" />
                  Now Recruiting – Batch 2026
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
            >
              Code. <span className="text-gfg-green">Learn.</span>
              <br />
              <span className="text-gfg-green">Grow.</span> Together.
            </motion.h1>

            <motion.p
              variants={item}
              className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg"
            >
              The official GeeksforGeeks Campus Club at RIT — where passionate coders become
              industry-ready engineers through community, mentorship, and real practice.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-gfg-green/30">
                Join the Club 🚀
              </Link>
              <Link to="/events" className="btn-outline border-gray-500 text-gray-300 hover:border-gfg-green hover:text-white hover:bg-gfg-green/10 text-base px-8 py-3.5">
                Upcoming Events
              </Link>
            </motion.div>
          </motion.div>

          {/* Right – Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-black text-gfg-green">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-2xl"
        >
          ↓
        </motion.div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">Our Mission</span>
            <h2 className="section-title mt-2">Why GFG Club at RIT?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We bridge the gap between classroom learning and industry expectations,
              one problem at a time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gfg-green-pale border border-transparent hover:border-gfg-green/20 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">Our Journey</span>
            <h2 className="section-title mt-2">Club History</h2>
          </motion.div>
          <div className="space-y-8 relative">
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-1/2" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} pl-[72px] md:pl-0`}
              >
                <div className="absolute left-[18px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-gfg-green border-4 border-white shadow-sm z-10" />
                <div className={`w-full md:w-[45%] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-gfg-green font-black mb-1 block">{item.year}</span>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">Leadership</span>
            <h2 className="section-title mt-2">Meet the Team</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gfg-green/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                  {member.emoji}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{member.name}</p>
                  <p className="text-gfg-green text-sm font-semibold">{member.role}</p>
                  <p className="text-gray-400 text-xs">{member.dept}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">FAQ</span>
            <h2 className="section-title mt-2">Common Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 rounded-3xl bg-gfg-green p-10 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <h3 className="text-2xl md:text-3xl font-black mb-2 relative">Ready to level up your coding journey?</h3>
            <p className="text-gfg-green-pale mb-6 relative">Join 200+ students already in the club.</p>
            <Link to="/register" className="bg-white text-gfg-green font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 inline-block relative">
              Join Club Today →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
