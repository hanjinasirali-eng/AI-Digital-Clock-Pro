import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const RetroClock: React.FC<ClockProps> = ({
  time,
  theme,
  settings,
  isMiniPreview = false,
}) => {
  let hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  let ampm = '';

  if (settings.timeFormat === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  const hoursStr = hours.toString().padStart(2, '0');
  const showColon = !settings.blinkColons || time.getSeconds() % 2 === 0;

  const color = theme.id === 'cyberpunk' ? '#4ade80' : '#fbbf24';

  return (
    <div className="relative flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl bg-black/80 border border-neutral-800 p-4 sm:p-8 shadow-2xl">
      {/* VCR Header */}
      {!isMiniPreview && (
        <div className="flex items-center justify-between w-full max-w-md pb-2 mb-2 border-b border-white/10 text-xs font-mono tracking-widest text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            REC 00:00:00
          </span>
          <span>SP 120min</span>
          <span>AUTO TRACK</span>
        </div>
      )}

      {/* Retro Digits */}
      <div
        className={`flex items-baseline justify-center font-vt323 tracking-wider tabular-nums ${
          isMiniPreview ? 'text-3xl' : 'text-7xl sm:text-8xl md:text-9xl'
        }`}
        style={{
          color: color,
          textShadow: `0 0 10px ${color}, 0 0 25px ${color}`,
        }}
      >
        <span>{hoursStr}</span>
        <span className={`mx-1 ${showColon ? 'opacity-100' : 'opacity-20'}`}>:</span>
        <span>{minutes}</span>

        {settings.showSeconds && (
          <>
            <span className={`mx-1 text-[0.7em] ${showColon ? 'opacity-100' : 'opacity-20'}`}>:</span>
            <span className="text-[0.75em]">{seconds}</span>
          </>
        )}

        {settings.timeFormat === '12h' && settings.showAmPm && (
          <span className="ml-3 text-[0.4em] uppercase tracking-widest opacity-80">{ampm}</span>
        )}
      </div>

      {/* CRT Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />
    </div>
  );
};
