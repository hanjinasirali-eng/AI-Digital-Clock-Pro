import React, { useState } from 'react';
import { ClockTheme, ClockStyle, FontStyle } from '../../types/clock';
import {
  Sparkles,
  Send,
  Wand2,
  Check,
  Palette,
  Clock,
  HelpCircle,
  Lightbulb,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface AiAssistantViewProps {
  onApplyCustomTheme: (theme: ClockTheme, style?: ClockStyle) => void;
  currentTheme: ClockTheme;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedTheme?: ClockTheme;
  suggestedStyle?: ClockStyle;
}

const QUICK_PROMPTS = [
  'Suggest a dark cozy bedside theme for deep sleep',
  'Recommend vibrant colors for an outdoor desk clock',
  'Create a cyberpunk neon theme with high energy',
  'How do red wavelengths prevent night eye fatigue?',
  'What is the best Pomodoro work/break timer interval?',
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  onApplyCustomTheme,
  currentTheme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Chronos, your AI Clock & Chronometry Assistant. I can generate personalized clock themes, recommend color schemes for your room lighting, explain circadian rhythms, and optimize your digital clock setup. How can I help you customize your clock today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Theme Generator State
  const [generatorPrompt, setGeneratorPrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<{
    theme: ClockTheme;
    style?: ClockStyle;
    description: string;
  } | null>(null);

  // Send Chat message to backend `/api/gemini/chat`
  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = userPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('API endpoint unavailable');
      }
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'm here to help you customize your clock experience!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Graceful conversational response if network or serverless route unavailable
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: "I recommend using deep AMOLED black backgrounds (#000000) paired with a deep red (#ef4444) or warm amber glow. For productivity, a vibrant cyan (#06b6d4) keeps you alert and focused!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Theme with Gemini backend `/api/gemini/theme-suggest`
  const handleGenerateTheme = async () => {
    const prompt = generatorPrompt.trim() || 'Midnight Cyberpunk Tokyo';
    setIsGeneratingTheme(true);

    try {
      const res = await fetch('/api/gemini/theme-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Failed to generate theme');
      }
      const data = await res.json();
      const tData = data.theme;

      const newTheme: ClockTheme = {
        id: `ai-theme-${Date.now()}`,
        name: tData.name || 'AI Custom Theme',
        textColor: tData.textColor || '#38bdf8',
        bgColor: tData.bgColor || '#030712',
        accentColor: tData.accentColor || '#a855f7',
        glowColor: tData.glowColor || 'rgba(56, 189, 248, 0.7)',
        fontStyle: (tData.fontStyle as FontStyle) || 'orbitron',
        isCustom: true,
      };

      setGeneratedTheme({
        theme: newTheme,
        style: tData.clockStyle as ClockStyle,
        description: tData.description || 'Custom crafted AI theme palette.',
      });
    } catch {
      // Fallback custom theme
      const fallbackTheme: ClockTheme = {
        id: `ai-theme-${Date.now()}`,
        name: 'Aurora Borealis Flow',
        textColor: '#34d399',
        bgColor: '#021018',
        accentColor: '#38bdf8',
        glowColor: 'rgba(52, 211, 153, 0.8)',
        fontStyle: 'syne',
        isCustom: true,
      };
      setGeneratedTheme({
        theme: fallbackTheme,
        style: 'neon',
        description: 'Vibrant emerald and cyan arctic glow designed for night focus.',
      });
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          Chronos AI Assistant
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Powered by Gemini 3.8 to design custom clock styles, colors, and chronobiology advice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Theme Generator Tool */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-neutral-900/90 border border-purple-500/30 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">AI Theme Generator</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Describe any mood, room setting, or artistic style to generate an instant custom clock theme.
            </p>

            <textarea
              value={generatorPrompt}
              onChange={(e) => setGeneratorPrompt(e.target.value)}
              placeholder="e.g. Minimalist Japanese cherry blossom dawn with subtle rose gold glow..."
              rows={3}
              className="w-full p-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500 resize-none mb-3"
            />

            <button
              onClick={handleGenerateTheme}
              disabled={isGeneratingTheme}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {isGeneratingTheme ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Palette...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Theme
                </>
              )}
            </button>

            {/* Generated Theme Preview */}
            {generatedTheme && (
              <div className="mt-5 p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{generatedTheme.theme.name}</h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Generated
                  </span>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedTheme.theme.textColor }}
                    title={`Text: ${generatedTheme.theme.textColor}`}
                  />
                  <div
                    className="w-8 h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedTheme.theme.bgColor }}
                    title={`Background: ${generatedTheme.theme.bgColor}`}
                  />
                  <div
                    className="w-8 h-8 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: generatedTheme.theme.accentColor }}
                    title={`Accent: ${generatedTheme.theme.accentColor}`}
                  />
                </div>

                <p className="text-xs text-slate-400 italic">
                  "{generatedTheme.description}"
                </p>

                <button
                  onClick={() => onApplyCustomTheme(generatedTheme.theme, generatedTheme.style)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Check className="w-3.5 h-3.5" /> Apply Theme to Clock
                </button>
              </div>
            )}
          </div>

          {/* Quick Prompts List */}
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Suggested Inquiries
            </h4>
            <div className="flex flex-col gap-1.5">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left p-2.5 rounded-xl hover:bg-white/5 text-xs text-slate-300 hover:text-white transition-colors border border-transparent hover:border-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Interface */}
        <div className="lg:col-span-2 flex flex-col h-[560px] rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-black/60 text-slate-200 border border-white/10 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/40 text-xs text-slate-400 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Chronos is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Chronos about themes, circadian rhythm, timers..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-950 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all shadow-md shadow-purple-600/25 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
