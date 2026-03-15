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
const DATA_DIR = path.join(__dirname, 'server-data');

// ── Supabase Client (server-side uses service_role key for full access) ────────
const SUPABASE_URL  = process.env.VITE_SUPABASE_URL  || process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Supabase client initialized');
} else {
  console.warn('⚠️  No Supabase keys found — falling back to JSON files');
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
  const { data, error } = await supabase.from(table).insert([body]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function sbUpdate(table, id, body) {
  // Try matching by id column first, then by rank
  let { data, error } = await supabase.from(table).update(body).eq('id', id).select().single();
  if (error || !data) {
    ({ data, error } = await supabase.from(table).update(body).eq('rank', id).select().single());
  }
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Item not found');
  return data;
}

async function sbDelete(table, id) {
  let { error, count } = await supabase.from(table).delete({ count: 'exact' }).eq('id', id);
  if (count === 0) {
    ({ error, count } = await supabase.from(table).delete({ count: 'exact' }).eq('rank', id));
  }
  if (error) throw new Error(error.message);
  if (count === 0) throw new Error('Item not found');
}

// ── Unified data access (Supabase first, JSON fallback) ───────────────────────
const ENTITIES = ['blogs', 'events', 'resources', 'leaderboard', 'lessons', 'users', 'practice', 'messages'];

async function getAll(entity) {
  if (supabase) return sbGetAll(entity);
  return readJSON(entity);
}

async function createOne(entity, body) {
  if (supabase) return sbCreate(entity, body);
  const data = await readJSON(entity);
  const newItem = { id: Date.now(), ...body };
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
  const before = data.length;
  data = data.filter(item => item.id != id && item.rank != id);
  if (data.length === before) throw new Error('Not found');
  await writeJSON(entity, data);
}

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, _, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Auto-generate REST routes ─────────────────────────────────────────────────
ENTITIES.forEach(entity => {
  app.get(`/api/${entity}`, async (req, res) => {
    try { res.json(await getAll(entity)); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post(`/api/${entity}`, async (req, res) => {
    try { res.status(201).json(await createOne(entity, req.body)); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put(`/api/${entity}/:id`, async (req, res) => {
    try { res.json(await updateOne(entity, req.params.id, req.body)); }
    catch (e) { res.status(404).json({ error: e.message }); }
  });

  app.delete(`/api/${entity}/:id`, async (req, res) => {
    try { await deleteOne(entity, req.params.id); res.status(204).send(); }
    catch (e) { res.status(404).json({ error: e.message }); }
  });
});

// ── Seed endpoint (one-time: migrate JSON → Supabase) ─────────────────────────
app.post('/api/seed', async (req, res) => {
  if (!supabase) return res.status(400).json({ error: 'Supabase not configured' });
  const results = {};
  
  // Valid columns per table based on schema
  const schema = {
    users: ['id', 'name', 'email', 'regNo', 'phone', 'sem', 'role', 'approved', 'createdAt', 'salt', 'passwordHash', 'idCardPhoto'],
    events: ['id', 'title', 'date', 'type', 'status', 'description', 'image'],
    blogs: ['id', 'title', 'author', 'date', 'category', 'excerpt', 'content', 'image', 'tags'],
    resources: ['id', 'title', 'category', 'type', 'link', 'description'],
    leaderboard: ['id', 'rank', 'name', 'regNo', 'points', 'avatar'],
    messages: ['id', 'name', 'email', 'subject', 'message', 'createdAt'],
    practice: ['id', 'title', 'difficulty', 'tags', 'description', 'link'],
    lessons: ['id', 'title', 'category', 'content']
  };

  for (const entity of ENTITIES) {
    try {
      const jsonData = await readJSON(entity);
      if (jsonData.length === 0) { results[entity] = 'skipped (empty)'; continue; }
      
      const cols = schema[entity];
      const cleanData = jsonData.map((item, idx) => {
        const cleanItem = {};
        cols.forEach(c => { if (item[c] !== undefined) cleanItem[c] = item[c]; });
        // Auto-generate missing IDs to prevent Supabase non-null errors
        if (cleanItem.id === undefined) {
            cleanItem.id = Date.now() + idx; // Ensure uniqueness within the loop
        }
        if (entity === 'resources' && !cleanItem.title) {
            cleanItem.title = 'Untitled Resource';
        }
        return cleanItem;
      });

      const { error } = await supabase.from(entity).upsert(cleanData, { onConflict: 'id' });
      if (error) { results[entity] = `error: ${error.message}`; }
      else { results[entity] = `seeded ${jsonData.length} items`; }
    } catch (e) { results[entity] = `error: ${e.message}`; }
  }
  res.json({ success: true, results });
});

// ── OTP Email ─────────────────────────────────────────────────────────────────
app.post('/api/send-otp', async (req, res) => {
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

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: supabase ? 'supabase' : 'json-files',
    timestamp: new Date().toISOString()
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server on http://localhost:${PORT}`);
  console.log(`🗄️  Storage: ${supabase ? 'Supabase (PostgreSQL)' : 'JSON Files (fallback)'}`);
});
