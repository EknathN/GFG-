import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

const TABS = [
  { id: 'overview', title: 'Stats', icon: '📊' },
  { id: 'users', title: 'Users', icon: '👥' },
  { id: 'blogs', title: 'Blogs', icon: '✍️' },
  { id: 'events', title: 'Events', icon: '📅' },
  { id: 'resources', title: 'Resources', icon: '📚' },
  { id: 'lessons', title: 'Lessons', icon: '🎓' },
  { id: 'practice', title: 'Practice', icon: '🎯' },
];

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab ] = useState('overview');
  const [data, setData] = useState({
    users: [], blogs: [], events: [], resources: [], leaderboard: [], lessons: [], practice: []
  });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [entityType, setEntityType] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const entities = ['users', 'blogs', 'events', 'resources', 'leaderboard', 'lessons', 'practice'];
      const results = await Promise.all(entities.map(e => fetch(`${API_BASE}/${e}`).then(r => r.json())));
      const newData = {};
      entities.forEach((e, i) => newData[e] = results[i]);
      setData(newData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entity, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await fetch(`${API_BASE}/${entity}/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
        await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        fetchAllData();
    } catch (err) {
        alert('Update failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-12 h-12 border-4 border-gfg-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black mb-2">Admin Command Center</h1>
            <p className="text-gray-400">Welcome back, {currentUser?.name}. Manage every corner of the club.</p>
          </div>
          <div className="bg-gfg-green/10 border border-gfg-green/20 rounded-2xl px-4 py-2 text-gfg-green text-sm font-bold">
            Live Synchronization Active
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-gfg-green text-white shadow-lg shadow-gfg-green/30' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{tab.icon}</span>
              {tab.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Members" value={data.users.length} icon="👥" color="bg-blue-500" />
                <StatCard title="Active Events" value={data.events.length} icon="📅" color="bg-orange-500" />
                <StatCard title="Resources" value={data.resources.length} icon="📚" color="bg-purple-500" />
                <StatCard title="Blog Posts" value={data.blogs.length} icon="✍️" color="bg-pink-500" />
                <StatCard title="Average Points" value={Math.round(data.users.reduce((s,u)=>s+(u.points||0),0)/data.users.length || 0)} icon="⭐" color="bg-yellow-500" />
                <StatCard title="Lessons" value={data.lessons.length} icon="🎓" color="bg-green-500" />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="users">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b border-white/10">
                                <th className="pb-4 font-semibold">User</th>
                                <th className="pb-4 font-semibold">Reg No</th>
                                <th className="pb-4 font-semibold">Role</th>
                                <th className="pb-4 font-semibold">Points</th>
                                <th className="pb-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.users.map(user => (
                                <tr key={user.id} className="group hover:bg-white/5">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gfg-green to-blue-500 flex items-center justify-center font-bold">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 font-mono text-sm text-gray-400">{user.regNo}</td>
                                    <td className="py-4">
                                        <select value={user.role} onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                            className="bg-white/10 border-none rounded-lg px-2 py-1 text-xs font-bold text-gray-300 focus:ring-1 focus:ring-gfg-green">
                                            <option value="member">Member</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-4 font-bold text-gfg-green">{user.points || 0}</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => handleDelete('users', user.id)} className="text-gray-500 hover:text-red-400 p-2 transition-colors">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </motion.div>
            )}

            {['blogs', 'events', 'resources', 'lessons', 'practice'].includes(activeTab) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={activeTab}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold capitalize">{activeTab} Management</h2>
                        <button className="bg-gfg-green px-4 py-2 rounded-xl text-sm font-bold">+ Add New</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {data[activeTab].map(item => (
                            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{item.title || item.category || item.name}</h3>
                                    <p className="text-sm text-gray-400 truncate max-w-md">{item.excerpt || item.description || (item.items && item.items.length + ' items')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10">✏️</button>
                                    <button onClick={() => handleDelete(activeTab, item.id)} className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 hover:text-red-400">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:border-white/20">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-2xl mb-4 text-white shadow-lg`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-black">{value}</h3>
    </div>
  );
}
