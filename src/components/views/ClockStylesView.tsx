import React from 'react';
import { ClockSettings, ClockStyle, ClockTheme } from '../../types/clock';
import { ClockRenderer } from '../clocks/ClockRenderer';
import { Check, Sparkles } from 'lucide-react';

interface ClockStylesViewProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  currentStyle: ClockStyle;
  onSelectStyle: (style: ClockStyle) => void;
}

interface StyleMeta {
  id: ClockStyle;
  title: string;
  category: string;
  desc: string;
}

const STYLES_LIST: StyleMeta[] = [
  {
    id: 'digital-led',
    title: 'Digital LED Clock',
    category: 'Digital',
    desc: 'Classic 7-segment digital matrix with authentic segment glow and blinking colons.',
  },
  {
    id: 'flip',
    title: 'Flip Clock',
    category: 'Mechanical',
    desc: 'Mechanical split-flap board cards with center divider seam and tactile depth.',
  },
  {
    id: 'minimal',
    title: 'Minimal Digital Clock',
    category: 'Modern',
    desc: 'Ultra-clean Scandinavian typography with ultra-thin weights and exquisite balance.',
  },
  {
    id: 'neon',
    title: 'Neon Glow Clock',
    category: 'Vibrant',
    desc: 'Electric glass neon tube illumination with multi-layered text glow effect.',
  },
  {
    id: 'retro',
    title: 'Retro VCR Clock',
    category: 'Vintage',
    desc: 'Authentic 80s/90s vintage VCR display with CRT scanlines and phosphor glow.',
  },
  {
    id: 'nightstand',
    title: 'Large Night Stand Clock',
    category: 'Bedside',
    desc: 'Deep red glowing digits on pure AMOLED black for eye comfort in dark rooms.',
  },
  {
    id: 'gradient',
    title: 'Gradient Clock',
    category: 'Modern iOS',
    desc: 'Vibrant shifting multi-stop gradient typography inspired by Apple StandBy.',
  },
  {
    id: 'amoled',
    title: 'Modern AMOLED Clock',
    category: 'OLED',
    desc: 'Razor-sharp white digits with accent pins and anti-burn-in pixel shifting.',
  },
  {
    id: 'big-number',
    title: 'Big Number Clock',
    category: 'Bold',
    desc: 'Giant stacked 2-row numbers filling the display for high-visibility distance reading.',
  },
  {
    id: 'analog',
    title: 'Precision Analog Clock',
    category: 'Classic',
    desc: 'High-precision SVG dial with Roman/Arabic tick marks and sweep second hand.',
  },
];

export const ClockStylesView: React.FC<ClockStylesViewProps> = ({
  time,
  theme,
  settings,
  currentStyle,
  onSelectStyle,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Clock Display Styles
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose from 10 live, accurate clock faces crafted for every screen and aesthetic.
        </p>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {STYLES_LIST.map((item) => {
          const isSelected = currentStyle === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectStyle(item.id)}
              className={`group relative flex flex-col justify-between p-5 rounded-3xl border transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                isSelected
                  ? 'bg-white/10 border-cyan-400/80 shadow-cyan-500/10 shadow-xl'
                  : 'bg-black/40 hover:bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Category & Selection Pill */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              {/* Live Miniature Clock Preview */}
              <div className="h-32 flex items-center justify-center my-2 p-2 rounded-2xl bg-black/50 border border-white/5 overflow-hidden group-hover:scale-[1.02] transition-transform">
                <ClockRenderer
                  style={item.id}
                  time={time}
                  theme={theme}
                  settings={settings}
                  isMiniPreview={true}
                />
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStyle(item.id);
                }}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isSelected ? 'Applied' : 'Select Style'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
