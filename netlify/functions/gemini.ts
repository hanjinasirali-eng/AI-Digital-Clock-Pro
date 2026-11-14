import { GoogleGenAI } from '@google/genai';

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
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

    if (url.pathname.includes('theme-suggest')) {
      const prompt = typeof body.prompt === 'string' ? body.prompt : 'futuristic cyberpunk nightstand';

      if (!ai) {
        return new Response(
          JSON.stringify({
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
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Generate a gorgeous custom clock theme based on this user prompt: "${prompt}".
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
      return new Response(JSON.stringify({ theme: parsed }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default: /api/gemini/chat
    const message = typeof body.message === 'string' ? body.message : '';
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!ai) {
      return new Response(
        JSON.stringify({
          reply:
            "AI Studio API key is not configured on this host yet. In the meantime, dark AMOLED themes with a soft red glow help preserve night vision and sleep quality—try 'Red Neon' or 'Night Stand' mode!",
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: `You are Chronos, the intelligent assistant for 'AI Digital Clock Pro'. You are an authority on timekeeping, chronobiology, circadian rhythms, sleep science, productivity time-blocking (Pomodoro, Ultra-radian cycles), timezones, and premium digital clock styling.
Keep answers concise (under 120 words unless requested), stylish, actionable, and warm. If the user asks about themes or clock setups, suggest concrete color hex codes and clock display modes available in the app (Digital LED, Flip Clock, Minimal Digital, Neon Glow, Retro VCR, Large Night Stand, Gradient, Modern AMOLED, Big Number, Analog).`,
      },
    });

    const response = await chat.sendMessage({ message });
    return new Response(
      JSON.stringify({ reply: response.text || 'No response generated.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Failed to communicate with AI Assistant',
        details: error?.message || String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
