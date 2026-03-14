import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

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
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #718096; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (data.error) {
      console.error('Error sending email via Resend:', data.error);
      return res.status(400).json({ error: data.error.message });
    }

    res.status(200).json({ success: true, message: 'OTP sent successfully', data });
  } catch (error) {
    console.error('Exception sending email:', error);
    res.status(500).json({ error: 'Failed to send OTP email', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Mail Server running on http://localhost:${PORT} with Resend API`);
});
