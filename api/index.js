import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In Vercel, api/index.js is in /api. server-data is in the root.
const DATA_DIR = path.join(__dirname, '..', 'server-data');

// ── Supabase Client (server-side uses service_role key for full access) ────────
const SUPABASE_URL  = process.env.VITE_SUPABASE_URL  || process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const SCHEMA = {
  users: ['id', 'name', 'email', 'regNo', 'phone', 'sem', 'role', 'approved', 'createdAt', 'salt', 'passwordHash', 'idCardPhoto', 'bio', 'experience', 'certifications', 'github', 'linkedin', 'skills'],
  events: ['id', 'title', 'date', 'type', 'status', 'description', 'image'],
  blogs: ['id', 'title', 'author', 'date', 'category', 'excerpt', 'content', 'image', 'tags'],
  resources: ['id', 'title', 'category', 'type', 'link', 'description'],
  leaderboard: ['id', 'rank', 'name', 'regNo', 'points', 'avatar'],
  messages: ['id', 'name', 'email', 'subject', 'message', 'createdAt'],
  practice: ['id', 'title', 'difficulty', 'tags', 'description', 'link'],
  lessons: ['id', 'title', 'category', 'content']
};

console.log('Environment Check:', {
  hasUrl: !!SUPABASE_URL,
  hasAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
  env: process.env.NODE_ENV
});

let supabase = null;
if (SUPABASE_URL && (process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY)) {
  const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  supabase = createClient(SUPABASE_URL, KEY);
  console.log('✅ Supabase client initialized via ' + (process.env.SUPABASE_SERVICE_KEY ? 'Service Key' : 'Anon Key'));
} else {
  console.error('❌ Supabase keys missing in Vercel environment variables');
}

// ── JSON fallback helpers ─────────────────────────────────────────────────────
async function readJSON(file) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, `${file}.json`), 'utf-8');
    return JSON.parse(data);
  } catch { return []; }
}

async function writeJSON(file, data) {
  await fs.writeFile(path.join(DATA_DIR, `${file}.json`), JSON.stringify(data, null, 2));
}

// ── Supabase CRUD helpers ─────────────────────────────────────────────────────
async function sbGetAll(table) {
  const { data, error } = await supabase.from(table).select('*').order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

async function sbCreate(table, body) {
  const cleanBody = {};
  if (SCHEMA[table]) {
    SCHEMA[table].forEach(col => { if (body[col] !== undefined) cleanBody[col] = body[col]; });
  } else { Object.assign(cleanBody, body); }

  const { data, error } = await supabase.from(table).insert([cleanBody]).select().single();
  if (error) {
    console.error(`❌ Supabase Insert Error [${table}]:`, error);
    throw new Error(error.message);
  }
  return data;
}

async function sbUpdate(table, id, body) {
  const cleanBody = {};
  if (SCHEMA[table]) {
    SCHEMA[table].forEach(col => { if (body[col] !== undefined) cleanBody[col] = body[col]; });
  } else { Object.assign(cleanBody, body); }

  let { data, error } = await supabase.from(table).update(cleanBody).eq('id', id).select().single();
  if (error || !data) {
    ({ data, error } = await supabase.from(table).update(cleanBody).eq('rank', id).select().single());
  }
  if (error) throw new Error(error.message);
  return data;
}

async function sbDelete(table, id) {
  let { error, count } = await supabase.from(table).delete({ count: 'exact' }).eq('id', id);
  if (count === 0) {
    ({ error, count } = await supabase.from(table).delete({ count: 'exact' }).eq('rank', id));
  }
  if (error) throw new Error(error.message);
}

// ── Unified data access ───────────────────────────────────────────────────────
const ENTITIES = ['blogs', 'events', 'resources', 'leaderboard', 'lessons', 'users', 'practice', 'messages'];

async function getAll(entity) {
  if (supabase) return sbGetAll(entity);
  if (process.env.VERCEL) {
     console.error(`❌ Cannot load ${entity}: Supabase not configured`);
     return []; // Still return empty to prevent hard crash on load
  }
  return readJSON(entity);
}

async function createOne(entity, body) {
  const newItem = { id: body.id || Date.now(), ...body };
  if (supabase) return sbCreate(entity, newItem);
  
  if (process.env.VERCEL) {
     throw new Error('Database not connected. Please add VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY to your Vercel Environment Variables.');
  }

  const data = await readJSON(entity);
  data.push(newItem);
  await writeJSON(entity, data);
  return newItem;
}

async function updateOne(entity, id, body) {
  if (supabase) return sbUpdate(entity, id, body);
  const data = await readJSON(entity);
  const idx = data.findIndex(item => item.id == id || item.rank == id);
  if (idx === -1) throw new Error('Not found');
  data[idx] = { ...data[idx], ...body };
  await writeJSON(entity, data);
  return data[idx];
}

async function deleteOne(entity, id) {
  if (supabase) return sbDelete(entity, id);
  let data = await readJSON(entity);
  data = data.filter(item => item.id != id && item.rank != id);
  await writeJSON(entity, data);
}

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const router = express.Router();

router.get('/ping', (req, res) => res.send('pong'));
router.get('/debug-health', (req, res) => {
  res.json({ 
    ok: true, 
    supabase: !!supabase, 
    vercel: true, 
    time: new Date().toISOString(),
    apiBase: req.baseUrl,
    url: req.url
  });
});

const resend = new Resend(process.env.RESEND_API_KEY);

ENTITIES.forEach(entity => {
  router.get(`/${entity}`, async (req, res) => {
    try { res.json(await getAll(entity)); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post(`/${entity}`, async (req, res) => {
    try { 
      const result = await createOne(entity, req.body);
      res.status(201).json(result); 
    } catch (e) { 
      console.error(`❌ POST /${entity} Error:`, e);
      res.status(500).json({ error: e.message }); 
    }
  });

  router.put(`/${entity}/:id`, async (req, res) => {
    try { res.json(await updateOne(entity, req.params.id, req.body)); }
    catch (e) { res.status(404).json({ error: e.message }); }
  });

  router.delete(`/${entity}/:id`, async (req, res) => {
    try { await deleteOne(entity, req.params.id); res.status(204).send(); }
    catch (e) { res.status(404).json({ error: e.message }); }
  });
});

router.post('/send-otp', async (req, res) => {
  const { toEmail, toName, otpCode } = req.body;
  if (!toEmail || !toName || !otpCode) return res.status(400).json({ error: 'Missing fields' });
  try {
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
      </div>`,
    });
    if (data.error) return res.status(400).json({ error: data.error.message });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to send OTP', details: e.message });
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: supabase ? 'supabase' : 'json-files',
    vercel: true,
    timestamp: new Date().toISOString()
  });
});

// Mount the router on BOTH /api and / to handle different Vercel rewrite behaviors
app.use('/api', router);
app.use('/', router);

app.use('*', (req, res) => {
  console.log(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: `Backend path not found: ${req.method} ${req.originalUrl}`,
    hint: 'Check your API_BASE and Vercel rewrites.'
  });
});

export default app;
