import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const TABS = [
  { id: 'overview', title: 'Overview', icon: '📊' },
  { id: 'users', title: 'Users', icon: '👥' },
  { id: 'messages', title: 'Queries & Messages', icon: '📧' },
  { id: 'events', title: 'Events', icon: '📅' },
  { id: 'blogs', title: 'Blog Posts', icon: '✍️' },
  { id: 'resources', title: 'Resources', icon: '📚' },
  { id: 'lessons', title: 'Lessons', icon: '🎓' },
  { id: 'practice', title: 'Practice Set', icon: '🎯' },
];

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab ] = useState('overview');
  const [data, setData] = useState({
    users: [], blogs: [], events: [], resources: [], leaderboard: [], lessons: [], practice: [], messages: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntity, setNewEntity] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Reset search when changing tabs
  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

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
    if (!window.confirm(`Are you sure you want to delete this item? This action cannot be undone.`)) return;
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

  const handleOpenEdit = (item) => {
      setEditingId(item.id);
      
      // Deep copy to avoid mutating state directly before save
      let editData = JSON.parse(JSON.stringify(item));
      
      // Format arrays/objects for textareas
      if (activeTab === 'blogs' && Array.isArray(editData.tags)) {
          editData.tags = editData.tags.join(', ');
      }
      if (activeTab === 'resources' && Array.isArray(editData.items)) {
          editData.items = JSON.stringify(editData.items, null, 2);
      }

      setNewEntity(editData);
      setShowAddModal(true);
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    try {
        const entity = activeTab;
        const body = { ...newEntity };
        
        // Processing for arrays
        if (entity === 'blogs' && typeof body.tags === 'string') {
            body.tags = body.tags.split(',').map(t => t.trim()).filter(Boolean);
        }
        if (entity === 'resources' && typeof body.items === 'string') {
            try { body.items = JSON.parse(body.items); } catch(err) { body.items = []; }
        }
        
        const url = editingId ? `${API_BASE}/${entity}/${editingId}` : `${API_BASE}/${entity}`;
        const method = editingId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        closeModal();
        fetchAllData();
    } catch (err) {
        alert(`Failed to ${editingId ? 'update' : 'add'} item`);
    }
  };

  const closeModal = () => {
      setShowAddModal(false);
      setNewEntity({});
      setEditingId(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- Search & Filtering Logic ---
  const filteredData = useMemo(() => {
      if (!data[activeTab] || !Array.isArray(data[activeTab])) return [];
      if (!searchTerm) return data[activeTab];

      const lowerSearch = searchTerm.toLowerCase();
      return data[activeTab].filter(item => {
          // Search across common naming fields
          const searchString = [
              item.name, item.email, item.regNo, // Users/Messages
              item.title, item.category, item.subject, // Blogs/Events/Resources/Messages
              item.description, item.message // Descriptions
          ].filter(Boolean).join(' ').toLowerCase();

          return searchString.includes(lowerSearch);
      });
  }, [data, activeTab, searchTerm]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-gfg-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex">
        
      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 hidden md:flex">
        <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gfg-green to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                    {currentUser?.name?.[0] || 'A'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-white font-bold text-sm truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-gfg-green uppercase tracking-widest font-mono">Terminal Active</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 no-scrollbar">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 ml-2">Modules</p>
            {TABS.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id 
                      ? 'bg-gfg-green/10 text-gfg-green border border-gfg-green/20 shadow-[0_0_15px_rgba(47,133,90,0.1)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.title}
                    {tab.id === 'messages' && data.messages.length > 0 && (
                        <span className="ml-auto bg-gfg-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {data.messages.length}
                        </span>
                    )}
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <span className="text-lg">🚪</span> Disconnect
            </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Topbar (Mobile Hamburger & Search) */}
        <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-2xl">☰</button>
                <div>
                    <h1 className="text-xl font-bold text-white capitalize flex items-center gap-2">
                        {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.title}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Search input - show on all tabs except overview */}
                {activeTab !== 'overview' && (
                    <div className="relative group hidden sm:block">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">🔍</span>
                        <input 
                            type="text" 
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#111] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-gfg-green focus:ring-1 focus:ring-gfg-green w-64 transition-all"
                        />
                    </div>
                )}
                
                {/* Action Button */}
                {!['overview', 'users', 'messages'].includes(activeTab) && (
                    <button 
                        onClick={() => { setEditingId(null); setNewEntity({}); setShowAddModal(true); }}
                        className="bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-gfg-green hover:text-white transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
                    >
                        <span>+</span> <span className="hidden sm:inline">Add New</span>
                    </button>
                )}
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    
                    {/* ── OVERVIEW TAB ── */}
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="overview" className="space-y-8">
                            
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard title="Total Users" value={data.users.length} icon="👥"  trend="+12% this month" />
                                <StatCard title="Active Events" value={data.events.filter(e => e.status !== 'Completed').length} icon="📅" trend="2 upcoming"  />
                                <StatCard title="Resources" value={data.resources.length} icon="📚" trend="Updated recently" />
                                <StatCard title="Unread Queries" value={data.messages.length} icon="📧" trend="Needs attention" alert={data.messages.length > 0} />
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Visual Chart Area (Simulated with progress bars) */}
                                <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-3xl p-6">
                                    <h3 className="font-bold text-white mb-6">System Health & Distribution</h3>
                                    
                                    <div className="space-y-6">
                                        <ProgressBar label="Member Engagement (Points Distributed)" value={75} color="bg-gfg-green" />
                                        <ProgressBar label="Lesson Completion Rate" value={42} color="bg-blue-500" />
                                        <ProgressBar label="Practice Module Usage" value={88} color="bg-purple-500" />
                                        <ProgressBar label="Storage Capacity (Mock)" value={15} color="bg-emerald-500" />
                                    </div>
                                </div>

                                {/* Recent Activity Feed */}
                                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 flex flex-col">
                                    <h3 className="font-bold text-white mb-6">Recent Activity</h3>
                                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
                                        {data.messages.slice(0, 4).map(msg => (
                                            <div key={msg.id} className="border-l-2 border-gfg-green pl-4 py-1">
                                                <p className="text-sm text-white font-medium">{msg.name} sent a message</p>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{msg.subject}</p>
                                                <p className="text-[10px] text-gray-600 mt-1">{new Date(msg.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                        {data.users.slice(-3).reverse().map(user => (
                                             <div key={user.id} className="border-l-2 border-blue-500 pl-4 py-1">
                                                <p className="text-sm text-white font-medium">New member joined</p>
                                                <p className="text-xs text-gray-500 mt-1">{user.name} ({user.regNo})</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── USERS TAB ── */}
                    {activeTab === 'users' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="users">
                            <DataTable 
                                items={filteredData} 
                                emptyText="No users found."
                                renderHeader={() => (
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-left rounded-tl-xl border-b border-white/5">Member Profile</th>
                                        <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-left border-b border-white/5">Registration No.</th>
                                        <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-left border-b border-white/5">Role Check</th>
                                        <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-left border-b border-white/5">Reputation</th>
                                        <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right rounded-tr-xl border-b border-white/5">Security Options</th>
                                    </tr>
                                )}
                                renderRow={(user) => (
                                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-400">{user.regNo}</td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={user.role} 
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                disabled={user.regNo === currentUser.regNo} // Prevent self-demotion easily
                                                className={`bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors focus:outline-none focus:border-gfg-green ${user.role === 'admin' ? 'text-gfg-green' : 'text-gray-300'}`}
                                            >
                                                <option value="member" className="bg-[#111]">Member</option>
                                                <option value="admin" className="bg-[#111]">Administrator</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-md text-xs font-bold font-mono">
                                                ⭐ {user.points || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete('users', user.id)} 
                                                disabled={user.regNo === currentUser.regNo}
                                                className="text-gray-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                                                title="Revoke Access"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            />
                        </motion.div>
                    )}

                    {/* ── MESSAGES TAB ── */}
                    {activeTab === 'messages' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="messages" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredData.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-500 font-mono text-sm border border-white/5 border-dashed rounded-3xl">
                                    No queries found. System clear.
                                </div>
                            ) : (
                                filteredData.map(msg => (
                                    <div key={msg.id} className="bg-[#111] border border-white/5 rounded-3xl p-6 flex flex-col group hover:border-gfg-green/30 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-gfg-green transition-colors">{msg.subject}</h3>
                                                <a href={`mailto:${msg.email}`} className="text-sm text-gray-400 hover:text-white underline decoration-white/20 underline-offset-4">{msg.name}</a>
                                            </div>
                                            <button onClick={() => handleDelete('messages', msg.id)} className="text-gray-600 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-all">✕</button>
                                        </div>
                                        <div className="bg-black/50 p-4 rounded-2xl flex-1 border border-white/5">
                                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-serif">{msg.message}</p>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                            <span>{new Date(msg.timestamp).toLocaleString()}</span>
                                            <span className="bg-white/5 px-2 py-1 rounded-md">ID: {msg.id.substring(0,8)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                         </motion.div>
                    )}

                    {/* ── GENERIC CONTENT TABS (Blogs, Events, Resources, Lessons, Practice) ── */}
                    {['blogs', 'events', 'resources', 'lessons', 'practice'].includes(activeTab) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={activeTab}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredData.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-gray-500 font-mono text-sm border border-white/5 border-dashed rounded-3xl">
                                        No data found. Click "Add New" to populate.
                                    </div>
                                ) : (
                                    filteredData.map(item => (
                                        <div key={item.id} className="bg-[#111] border border-white/5 rounded-3xl p-5 flex flex-col hover:border-white/20 transition-colors">
                                            
                                            {/* Header indicator (Type/Status) */}
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gfg-green bg-gfg-green/10 px-2 py-1 rounded-md">
                                                    {item.category || item.type || item.difficulty || activeTab.slice(0,-1)}
                                                </span>
                                                <span className="text-[10px] text-gray-600 font-mono block">
                                                    {(item.date && new Date(item.date).toLocaleDateString()) || item.duration || (item.points && `${item.points} pts`) || (item.items && `${item.items.length} items`) || ''}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">{item.title || item.name || item.category}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                                {item.excerpt || item.description || (item.items && JSON.stringify(item.items).substring(0,50)) || 'No description provided.'}
                                            </p>
                                            
                                            <div className="flex gap-2 pt-4 border-t border-white/5">
                                                <button onClick={() => handleOpenEdit(item)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-xl text-sm transition-colors text-center">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(activeTab, item.id)} className="w-12 bg-white/5  text-gray-500 hover:bg-red-500/10 hover:text-red-400 py-2 rounded-xl text-sm transition-colors flex items-center justify-center">
                                                    🗑️
                                                </button>
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
      </main>

      {/* ── Modal for Add/Edit ── */}
      <AnimatePresence>
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm"
                    onClick={closeModal}
                />
                <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative z-10 shadow-2xl">
                    
                    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center shrink-0">
                        <h2 className="text-2xl font-black text-white">{editingId ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}</h2>
                        <button onClick={closeModal} className="text-gray-500 hover:text-white p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">✕</button>
                    </div>
                    
                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                        <form id="entity-form" onSubmit={handleAddOrEdit} className="space-y-5">
                            {/* Dynamic Form Fields based on activeTab */}
                            {activeTab === 'blogs' && (
                                <>
                                    <Input label="Title" value={newEntity.title} onChange={v => setNewEntity({...newEntity, title: v})} required />
                                    <Input label="Excerpt" value={newEntity.excerpt} onChange={v => setNewEntity({...newEntity, excerpt: v})} required />
                                    <TextArea label="Content (Supports HTML/Markdown)" value={newEntity.content} onChange={v => setNewEntity({...newEntity, content: v})} required />
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
                                    <Input label="Event Title" value={newEntity.title} onChange={v => setNewEntity({...newEntity, title: v})} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Date (YYYY-MM-DD)" type="date" value={newEntity.date} onChange={v => setNewEntity({...newEntity, date: v})} required />
                                        <Input label="Time (e.g. 10:00 AM)" value={newEntity.time} onChange={v => setNewEntity({...newEntity, time: v})} required />
                                    </div>
                                    <Input label="Location / Venue" value={newEntity.location} onChange={v => setNewEntity({...newEntity, location: v})} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select label="Type" options={['Workshop', 'Seminar', 'Coding Contest', 'Tech Talk', 'Meetup']} value={newEntity.type} onChange={v => setNewEntity({...newEntity, type: v})} />
                                        <Select label="Status" options={['Upcoming', 'Live', 'Completed']} value={newEntity.status} onChange={v => setNewEntity({...newEntity, status: v})} />
                                    </div>
                                    <TextArea label="Description" value={newEntity.description} onChange={v => setNewEntity({...newEntity, description: v})} />
                                    <Input label="Registration Link (URL)" value={newEntity.link} onChange={v => setNewEntity({...newEntity, link: v})} />
                                </>
                            )}

                            {activeTab === 'resources' && (
                                <>
                                    <Input label="Category Name" value={newEntity.category} onChange={v => setNewEntity({...newEntity, category: v})} required />
                                    <TextArea 
                                        label="Items Array (Raw JSON)" 
                                        value={newEntity.items} 
                                        onChange={v => setNewEntity({...newEntity, items: v})} 
                                        required 
                                        placeholder={`[\n  {\n    "title": "Document Title",\n    "link": "https://...",\n    "type": "pdf"\n  }\n]`}
                                        rows={8}
                                        fontMono
                                    />
                                    <p className="text-xs text-yellow-500 font-mono mt-1">Warning: Must be valid JSON.</p>
                                </>
                            )}

                            {activeTab === 'lessons' && (
                                <>
                                    <Input label="Module Title" value={newEntity.title} onChange={v => setNewEntity({...newEntity, title: v})} required />
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input label="Total Lessons" type="number" value={newEntity.lessons} onChange={v => setNewEntity({...newEntity, lessons: v})} />
                                        <Input label="Duration (e.g. 2h 30m)" value={newEntity.duration} onChange={v => setNewEntity({...newEntity, duration: v})} />
                                        <Select label="Difficulty" options={['Beginner', 'Intermediate', 'Advanced']} value={newEntity.difficulty} onChange={v => setNewEntity({...newEntity, difficulty: v})} />
                                    </div>
                                    <TextArea label="Description" value={newEntity.description} onChange={v => setNewEntity({...newEntity, description: v})} />
                                    <Input label="Thumbnail Image URL" value={newEntity.image} onChange={v => setNewEntity({...newEntity, image: v})} />
                                </>
                            )}

                            {activeTab === 'practice' && (
                                <>
                                    <Input label="Problem Name" value={newEntity.name} onChange={v => setNewEntity({...newEntity, name: v})} required />
                                    <div className="grid grid-cols-3 gap-4">
                                        <Select label="Category" options={['Array', 'String', 'Tree', 'Graph', 'DP', 'Math', 'Sorting']} value={newEntity.category} onChange={v => setNewEntity({...newEntity, category: v})} />
                                        <Select label="Difficulty" options={['Easy', 'Medium', 'Hard']} value={newEntity.difficulty} onChange={v => setNewEntity({...newEntity, difficulty: v})} />
                                        <Input label="Reward Points" type="number" value={newEntity.points} onChange={v => setNewEntity({...newEntity, points: v})} />
                                    </div>
                                    <TextArea label="Problem Description (HTML/Markdown)" value={newEntity.description} onChange={v => setNewEntity({...newEntity, description: v})} required />
                                    <TextArea label="Starter Code Template" value={newEntity.starterCode} onChange={v => setNewEntity({...newEntity, starterCode: v})} fontMono />
                                    <TextArea label="Solution / Reference Code" value={newEntity.solution} onChange={v => setNewEntity({...newEntity, solution: v})} fontMono />
                                </>
                            )}
                        </form>
                    </div>
                    
                    <div className="p-6 border-t border-white/5 bg-[#0a0a0a] rounded-b-[2rem] flex gap-4 shrink-0">
                        <button type="button" onClick={closeModal} className="flex-1 py-4 rounded-xl text-gray-400 font-bold hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" form="entity-form" className="flex-[2] bg-white text-black font-black py-4 rounded-xl hover:bg-gfg-green hover:text-white transition-all shadow-lg hover:shadow-gfg-green/20">
                            {editingId ? 'Save Changes' : `Commint New ${activeTab.slice(0,-1)}`}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helper Components ───

function StatCard({ title, value, icon, trend, alert }) {
  return (
    <div className={`bg-[#111] border ${alert ? 'border-red-500/30' : 'border-white/5'} rounded-3xl p-6 relative overflow-hidden`}>
      {alert && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full pointer-events-none" />}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${alert ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white'}`}>
            {icon}
        </div>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${alert ? 'text-red-400' : 'text-gfg-green'}`}>{trend}</p>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-gray-400">{label}</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono">{value}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function DataTable({ items, renderHeader, renderRow, emptyText }) {
    if (!items || items.length === 0) {
        return (
             <div className="py-20 text-center text-gray-500 font-mono text-sm border border-white/5 border-dashed rounded-3xl bg-[#111]">
                {emptyText}
            </div>
        );
    }
    return (
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-black/50">
                        {renderHeader()}
                    </thead>
                    <tbody>
                        {items.map(renderRow)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Input({ label, type = "text", value = "", onChange, required = false }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">{label}</label>
            <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} required={required}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gfg-green focus:bg-[#111] transition-all" />
        </div>
    );
}

function TextArea({ label, value = "", onChange, required = false, rows = 4, fontMono = false }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">{label}</label>
            <textarea value={value || ''} onChange={e => onChange(e.target.value)} required={required} rows={rows}
                className={`w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gfg-green focus:bg-[#111] transition-all resize-none ${fontMono ? 'font-mono text-sm' : ''}`} />
        </div>
    );
}

function Select({ label, options, value = "", onChange }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">{label}</label>
            <select value={value || ''} onChange={e => onChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gfg-green transition-all appearance-none cursor-pointer">
                <option value="" disabled className="bg-[#111]">Select {label}</option>
                {options.map(opt => <option key={opt} value={opt} className="bg-[#111]">{opt}</option>)}
            </select>
        </div>
    );
}
