import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import LeaderboardRow from '../components/LeaderboardRow';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api';
const tabs = ['Leaderboard', 'Blog Updates'];

export default function Community() {
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [blogs, setBlogs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, lbRes] = await Promise.all([
          fetch(`${API_BASE}/blogs`),
          fetch(`${API_BASE}/leaderboard`)
        ]);
        setBlogs(await blogRes.json());
        setLeaderboard(await lbRes.json());
      } catch (err) {
        console.error('Failed to fetch community data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dynamically calculate leaderboard based on API data + current user's progress
  const displayLeaderboard = useMemo(() => {
    let combined = [...leaderboard];

    if (currentUser) {
      const userIdx = combined.findIndex(m => m.name === currentUser.name || m.regNo === currentUser.regNo);
      const userPoints = currentUser.points || 0;

      if (userIdx !== -1) {
        // User already in leaderboard API data, points might be different than current session
        // For consistency, we'll use the API data but ensure it's up to date
      } else if (userPoints > 0) {
        combined.push({
          name: currentUser.name,
          branch: currentUser.dept,
          year: currentUser.year,
          points: userPoints,
          solved: Math.floor(userPoints / 50),
          streak: 1,
          badge: "⭐"
        });
      }
    }

    return combined
      .sort((a, b) => b.points - a.points)
      .map((m, i) => ({ 
        ...m, 
        rank: i + 1, 
        badge: i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "⭐" 
      }));
  }, [leaderboard, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">Your Peers</span>
          <h1 className="section-title mt-2">Community Hub</h1>
          <p className="section-subtitle">Compete, share, and learn with fellow RIT coders.</p>
        </motion.div>

        {/* Tab Switch */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 gap-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-gfg-green text-white shadow-md'
                    : 'text-gray-500 hover:text-gfg-green'
                }`}
              >
                {tab === 'Leaderboard' ? '🏆 ' : '📝 '}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        {activeTab === 'Leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Banner */}
            <div className="bg-gradient-to-r from-gfg-green to-gfg-green-dark p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-white font-bold text-xl">March 2026 Rankings</h2>
                <p className="text-gfg-green-pale text-sm">Updated weekly based on problems solved & streak</p>
              </div>
              <div className="flex gap-6 text-center">
                {[
                  { label: 'Total Members', val: '200+' },
                  { label: 'Problems Solved', val: '10K+' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-white font-black text-2xl">{s.val}</p>
                    <p className="text-gfg-green-pale text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4 text-left">Rank</th>
                    <th className="py-3 px-4 text-left">Member</th>
                    <th className="py-3 px-4 text-center">Points</th>
                    <th className="py-3 px-4 text-center">Problems</th>
                    <th className="py-3 px-4 text-center">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {displayLeaderboard.map((member, i) => (
                    <LeaderboardRow key={member.rank || member.name} member={member} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Blog */}
        {activeTab === 'Blog Updates' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {blogs.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-center"
            >
              <p className="text-gray-500 text-sm mb-4">Are you a GFG member? Share your journey with the community.</p>
              <button className="btn-primary text-sm">Submit Your Blog Post →</button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
