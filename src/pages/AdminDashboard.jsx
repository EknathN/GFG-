import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API = '/api';

// ── Mini Bar Chart ──────────────────────────────────────────────────────
function BarChart({ data, color = '#2faa5a', label }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      {label && <p className="text-xs text-gray-500 font-mono mb-3 uppercase tracking-wider">{label}</p>}
      <div className="flex items-end gap-1 h-20">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }} animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="w-full rounded-t"
              style={{ background: `linear-gradient(to top, ${color}cc, ${color})`, minHeight: d.value > 0 ? 4 : 0 }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[8px] text-gray-600 truncate">{d.label}</div>
        ))}
      </div>
    </div>
  );
}

// ── Donut Chart ──────────────────────────────────────────────────────────
function DonutChart({ segments, size = 80 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let cum = 0;
  const r = 30, cx = size / 2, cy = size / 2;
  const circles = segments.map(seg => {
    const pct = seg.value / total;
    const a = cum;
    cum += pct;
    const circ = 2 * Math.PI * r;
    return { ...seg, dasharray: `${pct * circ} ${circ}`, offset: `-${a * circ}` };
  });
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {circles.map((c, i) => (
          <motion.circle key={i} cx={cx} cy={cy} r={r} fill="none" strokeWidth="12"
            stroke={c.color}
            strokeDasharray={c.dasharray}
            strokeDashoffset={c.offset}
            initial={{ strokeDasharray: `0 ${2 * Math.PI * r}` }}
            animate={{ strokeDasharray: c.dasharray }}
            transition={{ duration: 1, delay: i * 0.2 }} />
        ))}
      </svg>
      <div className="space-y-1">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span className="text-xs text-gray-400">{s.label}</span>
            <span className="text-xs font-bold text-white ml-1">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = '#2faa5a', onClick }) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
      onClick={onClick} className="rounded-2xl p-5 cursor-pointer relative overflow-hidden"
      style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 80% 20%, ${color}, transparent 60%)` }} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-black text-white">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </motion.div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#0d1420', border: '1px solid rgba(47,170,90,0.2)', boxShadow: '0 25px 80px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5"
             style={{ background: 'rgba(47,170,90,0.08)' }}>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ── InputField ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder, rows }) {
  const cls = "w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all";
  const style = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const focus = e => { e.target.style.borderColor = 'rgba(47,170,90,0.5)'; };
  const blur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; };
  return (
    <div>
      <label className="block text-xs text-green-400/70 font-mono uppercase tracking-wider mb-1.5">{label}</label>
      {rows ? (
        <textarea className={cls} style={style} onFocus={focus} onBlur={blur}
          value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
      ) : (
        <input type={type} className={cls} style={style} onFocus={focus} onBlur={blur}
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

// ── Confirm Dialog ───────────────────────────────────────────────────────
function ConfirmDelete({ onConfirm, onCancel, item }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p className="text-gray-300 mb-6">Delete <strong className="text-white">{item}</strong>? This is irreversible.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors text-sm">Delete</button>
      </div>
    </Modal>
  );
}

// ── GREEN BTN ────────────────────────────────────────────────────────────
const GBtn = ({ onClick, children, className = '' }) => (
  <button onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 ${className}`}
    style={{ background: 'linear-gradient(135deg,#2faa5a,#1e7a40)', boxShadow: '0 4px 12px rgba(47,170,90,0.3)' }}>
    {children}
  </button>
);

// ── Table ────────────────────────────────────────────────────────────────
function Table({ headers, rows, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(47,170,90,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-3 text-xs font-bold text-green-400/70 uppercase tracking-wider font-mono">{h}</th>
            ))}
            <th className="px-4 py-3 text-xs font-bold text-green-400/70 uppercase tracking-wider font-mono text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length + 1} className="text-center py-12 text-gray-600 font-mono">No records found</td></tr>
          ) : rows.map((row, ri) => (
            <tr key={ri} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              {row.cells.map((c, ci) => (
                <td key={ci} className="px-4 py-3 text-gray-300 max-w-xs truncate">{c}</td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(row.data)} className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/10">Edit</button>
                  <button onClick={() => onDelete(row.data)} className="px-3 py-1 rounded-lg text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [resources, setResources] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [messages, setMessages] = useState([]);
  const [practice, setPractice] = useState([]);

  const [modal, setModal] = useState(null); // { type: 'edit'|'add'|'delete', entity, data }
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, ev, bl, re, lb, ms, pr] = await Promise.all([
        fetch(`${API}/users`).then(r => r.json()),
        fetch(`${API}/events`).then(r => r.json()),
        fetch(`${API}/blogs`).then(r => r.json()),
        fetch(`${API}/resources`).then(r => r.json()),
        fetch(`${API}/leaderboard`).then(r => r.json()),
        fetch(`${API}/messages`).then(r => r.json()),
        fetch(`${API}/practice`).then(r => r.json()),
      ]);
      setUsers(Array.isArray(u) ? u : []);
      setEvents(Array.isArray(ev) ? ev : []);
      setBlogs(Array.isArray(bl) ? bl : []);
      setResources(Array.isArray(re) ? re : []);
      setLeaderboard(Array.isArray(lb) ? lb : []);
      setMessages(Array.isArray(ms) ? ms : []);
      setPractice(Array.isArray(pr) ? pr : []);
    } catch { showToast('Failed to fetch data', false); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/admin-login');
  }, [user, navigate]);

  const apiCall = async (method, entity, id, body) => {
    const url = id ? `${API}/${entity}/${id}` : `${API}/${entity}`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return method === 'DELETE' ? null : res.json();
  };

  const handleSave = async () => {
    const { entity, data } = modal;
    try {
      if (data?.id) {
        await apiCall('PUT', entity, data.id, formData);
        showToast('Updated successfully!');
      } else {
        await apiCall('POST', entity, null, formData);
        showToast('Created successfully!');
      }
      setModal(null);
      fetchAll();
    } catch { showToast('Save failed', false); }
  };

  const handleDelete = async () => {
    const { entity, data } = modal;
    try {
      await apiCall('DELETE', entity, data.id || data.rank, null);
      showToast('Deleted successfully!');
      setModal(null);
      fetchAll();
    } catch { showToast('Delete failed', false); }
  };

  const openEdit = (entity, data) => {
    setFormData({ ...data });
    setModal({ type: 'edit', entity, data });
  };

  const openAdd = (entity, defaults = {}) => {
    setFormData(defaults);
    setModal({ type: 'add', entity, data: null });
  };

  const openDelete = (entity, data) => {
    setModal({ type: 'delete', entity, data });
  };

  // ── Member Analytics ──
  const approvedMembers = users.filter(u => u.approved && u.role !== 'admin');
  const pendingMembers = users.filter(u => !u.approved && u.role !== 'admin');
  const memberScores = approvedMembers.map(m => {
    const lb = leaderboard.find(l => l.name === m.name || l.regNo === m.regNo);
    return { ...m, points: lb?.points || 0, rank: lb?.rank || 999 };
  }).sort((a, b) => a.rank - b.rank);

  const top5 = memberScores.slice(0, 5);
  const semBreakdown = approvedMembers.reduce((acc, m) => {
    const s = m.sem || 'Unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const semColors = ['#2faa5a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const semSegments = Object.entries(semBreakdown).map(([k, v], i) => ({ label: k, value: v, color: semColors[i % semColors.length] }));

  const monthlyEvents = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const m = d.toLocaleString('default', { month: 'short' });
    const count = events.filter(e => new Date(e.date || e.createdAt).getMonth() === d.getMonth()).length;
    return { label: m, value: count };
  });

  const filter = arr => arr.filter(item =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  // ── Sidebar items ──
  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'members', icon: '👥', label: 'Members' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'events', icon: '📅', label: 'Events' },
    { id: 'blogs', icon: '📝', label: 'Blogs' },
    { id: 'resources', icon: '📚', label: 'Resources' },
    { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'practice', icon: '💻', label: 'Practice' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080c14', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sidebar ── */}
      <motion.aside initial={{ x: 0 }} animate={{ x: sidebarOpen ? 0 : -240 }}
        className="h-full flex-shrink-0 z-30 flex flex-col"
        style={{ width: 240, background: 'rgba(10,15,25,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                 style={{ background: 'linear-gradient(135deg,#2faa5a,#1e7a40)' }}>🛡️</div>
            <div>
              <p className="font-black text-white text-sm">GFG Admin</p>
              <p className="text-[10px] text-green-400/60 font-mono">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm"
              style={{
                background: tab === item.id ? 'rgba(47,170,90,0.15)' : 'transparent',
                color: tab === item.id ? '#2faa5a' : '#6b7280',
                border: tab === item.id ? '1px solid rgba(47,170,90,0.2)' : '1px solid transparent',
              }}>
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.id === 'members' && pendingMembers.length > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-full">{pendingMembers.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 p-2">
            <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center text-xs">👤</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-green-400/60 font-mono">Administrator</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full mt-1 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/10">
            🚪 Sign Out
          </button>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Bar */}
        <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-white/[0.05]"
             style={{ background: 'rgba(10,15,25,0.6)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-white transition-colors text-lg">☰</button>
            <h1 className="text-lg font-bold capitalize text-white">{tab === 'overview' ? 'Dashboard Overview' : tab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search anything…"
                className="pr-4 pl-9 py-2 rounded-xl text-sm outline-none text-white w-52"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">🔍</span>
            </div>
            <button onClick={fetchAll} className="p-2 rounded-xl text-gray-500 hover:text-white transition-colors border border-white/10 text-sm">
              {loading ? '⏳' : '🔄'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              {/* ── OVERVIEW ── */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon="👥" label="Total Members" value={approvedMembers.length} sub={`${pendingMembers.length} pending approval`} onClick={() => setTab('members')} />
                    <StatCard icon="📅" label="Events" value={events.length} sub="Total organized" color="#3b82f6" onClick={() => setTab('events')} />
                    <StatCard icon="📝" label="Blogs" value={blogs.length} sub="Published articles" color="#f59e0b" onClick={() => setTab('blogs')} />
                    <StatCard icon="💬" label="Messages" value={messages.length} sub="Contact forms" color="#8b5cf6" onClick={() => setTab('messages')} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Top performers */}
                    <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">🏆 Top Performers</h3>
                      <div className="space-y-3">
                        {top5.length === 0 ? <p className="text-gray-600 font-mono text-sm">No leaderboard data yet</p> :
                          top5.map((m, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black"
                                   style={{ background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : 'rgba(47,170,90,0.2)', color: i < 3 ? '#000' : '#2faa5a' }}>
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{m.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{m.sem || 'N/A'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-green-400">{m.points} pts</p>
                                <div className="h-1 w-20 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                  <div className="h-full rounded-full" style={{ width: `${(m.points / (top5[0]?.points || 1)) * 100}%`, background: 'linear-gradient(90deg,#2faa5a,#35c466)' }} />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Sem breakdown */}
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <h3 className="font-bold text-white mb-4">📊 Semester Split</h3>
                      {semSegments.length > 0 ? <DonutChart segments={semSegments} /> : <p className="text-gray-600 text-sm font-mono">No data</p>}
                      <div className="mt-4 pt-4 border-t border-white/[0.05]">
                        <BarChart data={semSegments.map(s => ({ label: s.label, value: s.value }))} label="Members per semester" />
                      </div>
                    </div>
                  </div>

                  {/* Monthly events */}
                  <div className="rounded-2xl p-5" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <h3 className="font-bold text-white mb-4">📅 Events – Last 6 Months</h3>
                    <BarChart data={monthlyEvents} color="#3b82f6" />
                  </div>
                </div>
              )}

              {/* ── ANALYTICS ── */}
              {tab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <h3 className="font-bold text-white mb-4">🏆 Member Points Ranking</h3>
                      <BarChart data={memberScores.slice(0, 8).map(m => ({ label: m.name?.split(' ')[0] || '?', value: m.points }))} color="#2faa5a" label="Points by member" />
                    </div>
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <h3 className="font-bold text-white mb-4">📚 Content Overview</h3>
                      <DonutChart segments={[
                        { label: 'Blogs', value: blogs.length, color: '#f59e0b' },
                        { label: 'Events', value: events.length, color: '#3b82f6' },
                        { label: 'Resources', value: resources.length, color: '#2faa5a' },
                        { label: 'Practice', value: practice.length, color: '#8b5cf6' },
                      ]} size={120} />
                    </div>
                  </div>

                  <div className="rounded-2xl p-5" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <h3 className="font-bold text-white mb-4">📋 Member Work Summary</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {['#','Name','Semester','Points','Rank','Status'].map((h, i) => (
                            <th key={i} className="text-left py-3 px-3 text-xs font-bold text-green-400/70 uppercase font-mono">{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {memberScores.map((m, i) => (
                            <tr key={i} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-3 text-gray-600">{i + 1}</td>
                              <td className="py-3 px-3 text-white font-medium">{m.name}</td>
                              <td className="py-3 px-3 text-gray-400 font-mono">{m.sem || 'N/A'}</td>
                              <td className="py-3 px-3">
                                <span className="font-black text-green-400">{m.points}</span>
                                <div className="h-1 w-16 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                  <div className="h-full rounded-full" style={{ width: `${Math.min((m.points / Math.max(memberScores[0]?.points || 1, 1)) * 100, 100)}%`, background: '#2faa5a' }} />
                                </div>
                              </td>
                              <td className="py-3 px-3 text-gray-400">#{m.rank < 999 ? m.rank : 'N/A'}</td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                      style={{ background: 'rgba(47,170,90,0.15)', color: '#2faa5a' }}>Active</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MEMBERS ── */}
              {tab === 'members' && (
                <div className="space-y-4">
                  {pendingMembers.length > 0 && (
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <h3 className="font-bold text-amber-400 mb-3">⏳ Pending Approval ({pendingMembers.length})</h3>
                      <div className="space-y-2">
                        {pendingMembers.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <div>
                              <p className="text-sm font-bold text-white">{m.name}</p>
                              <p className="text-xs text-gray-500 font-mono">{m.regNo} • {m.email}</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                              <button onClick={async () => {
                                await apiCall('PUT', 'users', m.id, { ...m, approved: true });
                                showToast(`${m.name} approved!`); fetchAll();
                              }} className="px-3 py-1.5 rounded-lg text-xs bg-green-500 hover:bg-green-600 text-white font-bold transition-colors">✓ Approve</button>
                              <button onClick={() => openDelete('users', m)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 transition-colors">✗ Reject</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">All Members ({filter(approvedMembers).length})</h3>
                    <GBtn onClick={() => openAdd('users', { name: '', regNo: '', email: '', sem: '', role: 'member', approved: true })}>+ Add Member</GBtn>
                  </div>
                  <Table
                    headers={['Name', 'Reg No', 'Email', 'Semester', 'Role']}
                    rows={filter(approvedMembers).map(m => ({
                      data: m,
                      cells: [m.name, m.regNo, m.email, m.sem || 'N/A', m.role || 'member']
                    }))}
                    onEdit={d => openEdit('users', d)}
                    onDelete={d => openDelete('users', d)}
                  />
                </div>
              )}

              {/* ── EVENTS ── */}
              {tab === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Events ({filter(events).length})</h3>
                    <GBtn onClick={() => openAdd('events', { title: '', date: '', description: '', type: '', status: 'upcoming' })}>+ Add Event</GBtn>
                  </div>
                  <Table
                    headers={['Title', 'Date', 'Type', 'Status']}
                    rows={filter(events).map(e => ({ data: e, cells: [e.title, e.date, e.type || 'General', e.status || 'upcoming'] }))}
                    onEdit={d => openEdit('events', d)}
                    onDelete={d => openDelete('events', d)}
                  />
                </div>
              )}

              {/* ── BLOGS ── */}
              {tab === 'blogs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Blogs ({filter(blogs).length})</h3>
                    <GBtn onClick={() => openAdd('blogs', { title: '', author: '', date: '', category: '', content: '', excerpt: '' })}>+ Add Blog</GBtn>
                  </div>
                  <Table
                    headers={['Title', 'Author', 'Date', 'Category']}
                    rows={filter(blogs).map(b => ({ data: b, cells: [b.title, b.author, b.date, b.category || 'General'] }))}
                    onEdit={d => openEdit('blogs', d)}
                    onDelete={d => openDelete('blogs', d)}
                  />
                </div>
              )}

              {/* ── RESOURCES ── */}
              {tab === 'resources' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Resources ({filter(resources).length})</h3>
                    <GBtn onClick={() => openAdd('resources', { title: '', category: '', link: '', description: '', type: '' })}>+ Add Resource</GBtn>
                  </div>
                  <Table
                    headers={['Title', 'Category', 'Type', 'Link']}
                    rows={filter(resources).map(r => ({ data: r, cells: [r.title, r.category || 'General', r.type || 'Link', r.link || '—'] }))}
                    onEdit={d => openEdit('resources', d)}
                    onDelete={d => openDelete('resources', d)}
                  />
                </div>
              )}

              {/* ── LEADERBOARD ── */}
              {tab === 'leaderboard' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Leaderboard ({filter(leaderboard).length})</h3>
                    <GBtn onClick={() => openAdd('leaderboard', { name: '', points: 0, rank: leaderboard.length + 1 })}>+ Add Entry</GBtn>
                  </div>
                  <Table
                    headers={['Rank', 'Name', 'Points']}
                    rows={filter(leaderboard).sort((a,b) => a.rank - b.rank).map(l => ({ data: l, cells: [`#${l.rank}`, l.name, `${l.points} pts`] }))}
                    onEdit={d => openEdit('leaderboard', d)}
                    onDelete={d => openDelete('leaderboard', d)}
                  />
                </div>
              )}

              {/* ── MESSAGES ── */}
              {tab === 'messages' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-white">Contact Messages ({filter(messages).length})</h3>
                  <div className="grid gap-3">
                    {filter(messages).length === 0 ? <p className="text-gray-600 font-mono text-sm text-center py-10">No messages yet</p> :
                      filter(messages).map((m, i) => (
                        <div key={i} className="rounded-2xl p-5 relative" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white">{m.name || 'Anonymous'}</p>
                              <p className="text-xs text-gray-500 font-mono mb-2">{m.email} • {m.subject || 'No subject'}</p>
                              <p className="text-sm text-gray-300">{m.message}</p>
                            </div>
                            <button onClick={() => openDelete('messages', m)} className="text-red-400 hover:text-red-300 text-xs border border-red-500/20 px-2 py-1 rounded-lg">Delete</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ── PRACTICE ── */}
              {tab === 'practice' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Practice Problems ({filter(practice).length})</h3>
                    <GBtn onClick={() => openAdd('practice', { title: '', difficulty: 'Easy', tags: '', description: '', link: '' })}>+ Add Problem</GBtn>
                  </div>
                  <Table
                    headers={['Title', 'Difficulty', 'Tags']}
                    rows={filter(practice).map(p => ({
                      data: p,
                      cells: [p.title, p.difficulty || 'Easy', Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '—')]
                    }))}
                    onEdit={d => openEdit('practice', d)}
                    onDelete={d => openDelete('practice', d)}
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-2xl"
            style={{ background: toast.ok ? 'linear-gradient(135deg,#2faa5a,#1e7a40)' : 'linear-gradient(135deg,#ef4444,#b91c1c)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            {toast.ok ? '✓' : '✗'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {modal?.type === 'delete' && (
          <ConfirmDelete
            item={modal.data?.name || modal.data?.title || 'this item'}
            onConfirm={handleDelete}
            onCancel={() => setModal(null)}
          />
        )}
        {(modal?.type === 'edit' || modal?.type === 'add') && (
          <Modal title={`${modal.type === 'add' ? 'Add' : 'Edit'} ${modal.entity?.slice(0, -1) || ''}`} onClose={() => setModal(null)}>
            <div className="space-y-4">
              {Object.keys(formData).filter(k => !['id', 'idCardPhoto', 'salt', 'passwordHash', 'createdAt'].includes(k)).map(key => (
                <Field key={key} label={key} value={formData[key] ?? ''} onChange={v => setFormData(p => ({ ...p, [key]: v }))}
                  rows={key === 'description' || key === 'content' || key === 'message' || key === 'excerpt' ? 3 : undefined}
                  type={key === 'points' || key === 'rank' ? 'number' : 'text'} />
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <GBtn onClick={handleSave} className="flex-1 py-3 rounded-xl">
                  {modal.type === 'add' ? '+ Create' : '✓ Save Changes'}
                </GBtn>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
