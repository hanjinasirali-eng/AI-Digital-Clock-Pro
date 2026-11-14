import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint for AI Clock Assistant Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      return res.json({
        reply: "AI Studio API key is not currently detected in the environment. In the meantime, I can tell you that dark AMOLED themes with low red glow are scientifically proven to preserve night vision and sleep quality! You can switch to 'Red Neon' or 'Night Stand' mode in the themes menu.",
      });
    }

    // Format history if provided
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: `You are Chronos, the intelligent assistant for 'AI Digital Clock Pro'. You are an authority on timekeeping, chronobiology, circadian rhythms, sleep science, productivity time-blocking (Pomodoro, Ultra-radian cycles), timezones, and premium digital clock styling.
Keep answers concise (under 120 words unless requested), stylish, actionable, and warm. If the user asks about themes or clock setups, suggest concrete color hex codes and clock display modes available in the app (Digital LED, Flip Clock, Minimal Digital, Neon Glow, Retro VCR, Large Night Stand, Gradient, Modern AMOLED, Big Number, Analog).`,
      },
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: 'Failed to communicate with AI Assistant',
      details: error.message || String(error),
    });
  }
});

// Endpoint for AI Theme Generation / Recommendation
app.post('/api/gemini/theme-suggest', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!ai) {
      // Fallback curated theme
      return res.json({
        theme: {
          name: 'Cyber Horizon',
          textColor: '#06b6d4',
          bgColor: '#030712',
          accentColor: '#3b82f6',
          glowColor: 'rgba(6, 182, 212, 0.7)',
          fontStyle: 'orbitron',
          clockStyle: 'neon',
          description: 'High-contrast cyan cyber aesthetic with deep obsidian background.',
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a gorgeous custom clock theme based on this user prompt: "${prompt || 'futuristic cyberpunk nightstand'}".
Return a JSON object with:
- name: string (short poetic theme name)
- textColor: hex color code (e.g. #00f0ff)
- bgColor: hex color code (prefer deep dark AMOLED #05070d or rich dark tones for battery & screen comfort)
- accentColor: hex color code
- glowColor: rgba string (e.g. rgba(0, 240, 255, 0.7))
- fontStyle: one of ['orbitron', 'digital', 'vt323', 'chakra', 'syne', 'rajdhani', 'jetbrains']
- clockStyle: one of ['digital-led', 'flip', 'minimal', 'neon', 'retro', 'nightstand', 'gradient', 'amoled', 'big-number', 'analog']
- description: short one-line design commentary (under 20 words)`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ theme: parsed });
  } catch (error: any) {
    console.error('Error generating theme:', error);
    res.status(500).json({
      error: 'Theme generation failed',
      details: error.message || String(error),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
