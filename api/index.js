import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In Vercel, api/index.js is in /api. server-data is in the root.
const DATA_DIR = path.join(__dirname, '..', 'server-data');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const resend = new Resend(process.env.RESEND_API_KEY);

async function readData(file) {
  try {
    const filePath = path.join(DATA_DIR, `${file}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
}

async function writeData(file, data) {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  // Note: On Vercel, this will only work in the same execution context.
  // Persistent storage requires a real database.
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

const ENTITIES = ['blogs', 'events', 'resources', 'leaderboard', 'lessons', 'users', 'practice', 'messages'];

ENTITIES.forEach(entity => {
  app.get(`/api/${entity}`, async (req, res) => {
    const data = await readData(entity);
    res.json(data);
  });

  app.post(`/api/${entity}`, async (req, res) => {
    const data = await readData(entity);
    const newItem = { id: Date.now(), ...req.body };
    data.push(newItem);
    await writeData(entity, data);
    res.status(201).json(newItem);
  });

  app.put(`/api/${entity}/:id`, async (req, res) => {
    const { id } = req.params;
    const data = await readData(entity);
    const index = data.findIndex(item => item.id == id || item.rank == id);
    if (index === -1) return res.status(404).json({ error: 'Item not found' });
    
    data[index] = { ...data[index], ...req.body };
    await writeData(entity, data);
    res.json(data[index]);
  });

  app.delete(`/api/${entity}/:id`, async (req, res) => {
    const { id } = req.params;
    let data = await readData(entity);
    const initialLength = data.length;
    data = data.filter(item => item.id != id && item.rank != id);
    if (data.length === initialLength) return res.status(404).json({ error: 'Item not found' });
    
    await writeData(entity, data);
    res.status(204).send();
  });
});

app.post('/api/send-otp', async (req, res) => {
  const { toEmail, toName, otpCode } = req.body;
  if (!toEmail || !toName || !otpCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const data = await resend.emails.send({
      from: 'GFG Club Verification <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Your GFG Club Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2f855a; text-align: center;">GFG Club Verification</h2>
          <p>Hello <b>${toName}</b>,</p>
          <p>Your 6-digit verification code to join the GFG Club is:</p>
          <div style="background: #f0fff4; color: #276749; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 15px; border-radius: 8px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>Please enter this code on the registration page to complete your signup.</p>
        </div>
      `,
    });

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }
    res.status(200).json({ success: true, message: 'OTP sent successfully', data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP email', details: error.message });
  }
});

export default app;
