import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel handles environment variables automatically.
// We use a try-catch during client initialization to prevent startup crashes.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const SCHEMA = {
  users: ['id', 'name', 'email', 'regNo', 'phone', 'sem', 'dept', 'section', 'year', 'role', 'approved', 'createdAt', 'salt', 'passwordHash', 'idCardPhoto', 'bio', 'experience', 'certifications', 'github', 'linkedin', 'skills'],
  events: ['id', 'title', 'date', 'type', 'status', 'description', 'image'],
  blogs: ['id', 'title', 'author', 'date', 'category', 'excerpt', 'content', 'image', 'tags'],
  resources: ['id', 'title', 'category', 'type', 'link', 'description'],
  leaderboard: ['id', 'rank', 'name', 'regNo', 'points', 'avatar'],
  messages: ['id', 'name', 'email', 'subject', 'message', 'createdAt'],
  practice: ['id', 'title', 'difficulty', 'tags', 'description', 'link'],
  lessons: ['id', 'title', 'category', 'content']
};

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } else {
    console.error('⚠️ SUPABASE_URL or SUPABASE_KEY is missing');
  }
} catch (err) {
  console.error('❌ Failed to initialize Supabase client:', err);
}

let resend = null;
try {
  if (RESEND_API_KEY) {
    resend = new Resend(RESEND_API_KEY);
  }
} catch (err) {
  console.error('❌ Failed to initialize Resend client:', err);
}

// Helper to filter columns based on schema
function clean(table, body) {
  if (!SCHEMA[table] || !body) return body || {};
  const filtered = {};
  SCHEMA[table].forEach(col => { if (body[col] !== undefined) filtered[col] = body[col]; });
  return filtered;
}

// --- API Routes ---
const ENTITIES = ['blogs', 'events', 'resources', 'leaderboard', 'lessons', 'users', 'practice', 'messages'];

ENTITIES.forEach(entity => {
  // GET ALL
  app.get(`/api/${entity}`, async (req, res, next) => {
    try {
      if (!supabase) return res.status(503).json({ error: 'Database not connected. Please check Vercel Env Vars.' });
      const { data, error } = await supabase.from(entity).select('*').order('id', { ascending: true });
      if (error) throw error;
      res.json(data || []);
    } catch (e) { next(e); }
  });

  // POST ONE
  app.post(`/api/${entity}`, async (req, res, next) => {
    try {
      if (!supabase) return res.status(503).json({ error: 'Database not connected.' });
      const body = { id: req.body?.id || Date.now(), ...clean(entity, req.body) };
      const { data, error } = await supabase.from(entity).insert([body]).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (e) { next(e); }
  });

  // PUT ONE
  app.put(`/api/${entity}/:id`, async (req, res, next) => {
    try {
      if (!supabase) return res.status(503).json({ error: 'Database not connected.' });
      const { id } = req.params;
      const body = clean(entity, req.body);
      let { data, error } = await supabase.from(entity).update(body).eq('id', id).select().single();
      if (error || !data) {
        ({ data, error } = await supabase.from(entity).update(body).eq('rank', id).select().single());
      }
      if (error) throw error;
      res.json(data);
    } catch (e) { next(e); }
  });

  // DELETE ONE
  app.delete(`/api/${entity}/:id`, async (req, res, next) => {
    try {
      if (!supabase) return res.status(503).json({ error: 'Database not connected.' });
      const { id } = req.params;
      let { error, count } = await supabase.from(entity).delete({ count: 'exact' }).eq('id', id);
      if (count === 0) {
        ({ error, count } = await supabase.from(entity).delete({ count: 'exact' }).eq('rank', id));
      }
      if (error) throw error;
      res.status(204).send();
    } catch (e) { next(e); }
  });
});

app.post('/api/send-otp', async (req, res, next) => {
  try {
    const { toEmail, toName, otpCode } = req.body || {};
    if (!toEmail || !toName || !otpCode) return res.status(400).json({ error: 'Missing fields' });
    if (!resend) return res.status(503).json({ error: 'Email service not configured.' });

    const data = await resend.emails.send({
      from: 'GFG Club Verification <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Your GFG Club Verification Code',
      html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="color:#2f855a;text-align:center;">GFG Club Verification</h2>
        <p>Hello <b>${toName}</b>,</p>
        <p>Your 6-digit verification code is:</p>
        <div style="background:#f0fff4;color:#276749;text-align:center;font-size:32px;font-weight:bold;letter-spacing:6px;padding:15px;border-radius:8px;margin:20px 0;">${otpCode}</div>
        <p>Enter this on the registration page to complete your signup.</p>
      </div>`
    });
    if (data.error) throw new Error(data.error.message);
    res.json({ success: true });
  } catch (e) { next(e); }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: supabase ? 'supabase' : 'disconnected',
    vercel: true,
    timestamp: new Date().toISOString(),
    node_version: process.version
  });
});

// Final Error Handler for all routes
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
