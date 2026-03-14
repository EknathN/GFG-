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
  { id: 'messages', title: 'Messages', icon: '📧' },
];

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab ] = useState('overview');
  const [data, setData] = useState({
    users: [], blogs: [], events: [], resources: [], leaderboard: [], lessons: [], practice: [], messages: []
  });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntity, setNewEntity] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const entities = ['users', 'blogs', 'events', 'resources', 'leaderboard', 'lessons', 'practice', 'messages'];
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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
        const entity = activeTab;
        const body = { ...newEntity };
        
        // Basic processing for arrays
        if (entity === 'blogs' && typeof body.tags === 'string') {
            body.tags = body.tags.split(',').map(t => t.trim());
        }
        if (entity === 'resources' && typeof body.items === 'string') {
            try { body.items = JSON.parse(body.items); } catch(e) { body.items = []; }
        }
        
        await fetch(`${API_BASE}/${entity}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        setShowAddModal(false);
        setNewEntity({});
        fetchAllData();
    } catch (err) {
        alert('Failed to add item');
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
                        <button onClick={() => setShowAddModal(true)} className="bg-gfg-green px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-gfg-green/20 hover:scale-105 transition-transform">+ Add New {activeTab.slice(0, -1)}</button>
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

            {activeTab === 'messages' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="messages">
                    <h2 className="text-xl font-bold mb-6">Member Queries & Messages</h2>
                    <div className="space-y-4">
                        {data.messages.length === 0 ? (
                            <p className="text-gray-500 text-center py-10">No messages yet.</p>
                        ) : (
                            data.messages.map(msg => (
                                <div key={msg.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{msg.subject}</h3>
                                            <p className="text-sm text-gfg-green">From: {msg.name} ({msg.email})</p>
                                        </div>
                                        <button onClick={() => handleDelete('messages', msg.id)} className="text-gray-500 hover:text-red-400 transition-colors">🗑️</button>
                                    </div>
                                    <p className="text-gray-300 text-sm bg-white/5 p-4 rounded-xl mb-3 leading-relaxed">{msg.message}</p>
                                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                                        <span>Sent on: {new Date(msg.timestamp).toLocaleString()}</span>
                                        <span className="bg-gfg-green/20 text-gfg-green px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Query</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar relative shadow-2xl">
                    <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white text-xl">✕</button>
                    
                    <h2 className="text-2xl font-black mb-6">Add New {activeTab.slice(0, -1)}</h2>
                    
                    <form onSubmit={handleAdd} className="space-y-4">
                        {activeTab === 'blogs' && (
                            <>
                                <Input label="Title" value={newEntity.title} onChange={v => setNewEntity({...newEntity, title: v})} required />
                                <Input label="Excerpt" value={newEntity.excerpt} onChange={v => setNewEntity({...newEntity, excerpt: v})} required />
                                <TextArea label="Content" value={newEntity.content} onChange={v => setNewEntity({...newEntity, content: v})} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Author" value={newEntity.author} onChange={v => setNewEntity({...newEntity, author: v})} required />
                                    <Input label="Read Time (e.g. 5 min)" value={newEntity.readTime} onChange={v => setNewEntity({...newEntity, readTime: v})} />
                                </div>
                                <Input label="Tags (comma separated)" value={newEntity.tags} onChange={v => setNewEntity({...newEntity, tags: v})} />
                                <Input label="Image URL" value={newEntity.image} onChange={v => setNewEntity({...newEntity, image: v})} />
                            </>
                        )}

                        {activeTab === 'events' && (
                            <>
                                <Input label="Title" value={newEntity.title} onChange={v => setNewEntity({...newEntity, title: v})} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Date" type="date" value={newEntity.date} onChange={v => setNewEntity({...newEntity, date: v})} required />
                                    <Input label="Time" value={newEntity.time} onChange={v => setNewEntity({...newEntity, time: v})} required />
                                </div>
                                <Input label="Location" value={newEntity.location} onChange={v => setNewEntity({...newEntity, location: v})} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <Select label="Type" options={['Workshop', 'Seminar', 'Coding Contest', 'Tech Talk']} value={newEntity.type} onChange={v => setNewEntity({...newEntity, type: v})} />
                                    <Select label="Status" options={['Upcoming', 'Completed', 'Live']} value={newEntity.status} onChange={v => setNewEntity({...newEntity, status: v})} />
                                </div>
                                <TextArea label="Description" value={newEntity.description} onChange={v => setNewEntity({...newEntity, description: v})} />
                                <Input label="Registration Link" value={newEntity.link} onChange={v => setNewEntity({...newEntity, link: v})} />
                            </>
                        )}

                        {activeTab === 'resources' && (
                            <>
                                <Input label="Category" value={newEntity.category} onChange={v => setNewEntity({...newEntity, category: v})} required />
                                <TextArea label="Items JSON (e.g. [{'title':'Doc', 'link':'#'}])" value={newEntity.items} onChange={v => setNewEntity({...newEntity, items: v})} required />
                            </>
                        )}

                        {activeTab === 'lessons' && (
                            <>
                                <Input label="Title" value={newEntity.title} onChange={v => setNewEntity({...newEntity, title: v})} required />
                                <div className="grid grid-cols-3 gap-4">
                                    <Input label="Lessons Count" type="number" value={newEntity.lessons} onChange={v => setNewEntity({...newEntity, lessons: v})} />
                                    <Input label="Duration" value={newEntity.duration} onChange={v => setNewEntity({...newEntity, duration: v})} />
                                    <Select label="Difficulty" options={['Beginner', 'Intermediate', 'Advanced']} value={newEntity.difficulty} onChange={v => setNewEntity({...newEntity, difficulty: v})} />
                                </div>
                                <TextArea label="Description" value={newEntity.description} onChange={v => setNewEntity({...newEntity, description: v})} />
                                <Input label="Thumbnail URL" value={newEntity.image} onChange={v => setNewEntity({...newEntity, image: v})} />
                            </>
                        )}

                        {activeTab === 'practice' && (
                            <>
                                <Input label="Problem Name" value={newEntity.name} onChange={v => setNewEntity({...newEntity, name: v})} required />
                                <div className="grid grid-cols-3 gap-4">
                                    <Select label="Category" options={['Array', 'String', 'Tree', 'Graph', 'DP', 'Math']} value={newEntity.category} onChange={v => setNewEntity({...newEntity, category: v})} />
                                    <Select label="Difficulty" options={['Easy', 'Medium', 'Hard']} value={newEntity.difficulty} onChange={v => setNewEntity({...newEntity, difficulty: v})} />
                                    <Input label="Points" type="number" value={newEntity.points} onChange={v => setNewEntity({...newEntity, points: v})} />
                                </div>
                                <TextArea label="Description" value={newEntity.description} onChange={v => setNewEntity({...newEntity, description: v})} required />
                                <TextArea label="Starter Code" value={newEntity.starterCode} onChange={v => setNewEntity({...newEntity, starterCode: v})} />
                                <TextArea label="Solution Code" value={newEntity.solution} onChange={v => setNewEntity({...newEntity, solution: v})} />
                            </>
                        )}

                        <div className="pt-6">
                            <button type="submit" className="w-full bg-gfg-green text-white font-bold py-4 rounded-2xl hover:bg-gfg-green-dark transition-all">
                                Save {activeTab.slice(0, -1)}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, type = "text", value = "", onChange, required = false }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gfg-green transition-all" />
        </div>
    );
}

function TextArea({ label, value = "", onChange, required = false }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
            <textarea value={value} onChange={e => onChange(e.target.value)} required={required} rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gfg-green transition-all resize-none" />
        </div>
    );
}

function Select({ label, options, value = "", onChange }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gfg-green transition-all">
                <option value="" disabled className="bg-gray-900">Select {label}</option>
                {options.map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
            </select>
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
