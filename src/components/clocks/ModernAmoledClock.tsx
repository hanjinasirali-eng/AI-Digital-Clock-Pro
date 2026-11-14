import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const ModernAmoledClock: React.FC<ClockProps> = ({
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

  // Subtle shift to protect against OLED burn-in over long night sessions
  const shiftX = (time.getMinutes() % 4) - 2;
  const shiftY = (time.getMinutes() % 3) - 1;

  return (
    <div
      className="flex flex-col items-center justify-center select-none text-center transition-transform duration-1000"
      style={{
        transform: isMiniPreview ? 'none' : `translate(${shiftX}px, ${shiftY}px)`,
      }}
    >
      <div
        className={`relative flex items-center justify-center border border-white/10 rounded-3xl bg-black/90 shadow-2xl backdrop-blur-xl ${
          isMiniPreview ? 'px-4 py-2' : 'px-8 py-6 sm:px-14 sm:py-10'
        }`}
      >
        {/* Subtle accent corner indicators */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />

        <div
          className={`flex items-baseline justify-center font-jetbrains font-extrabold tracking-tight tabular-nums text-white ${
            isMiniPreview ? 'text-2xl' : 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
          }`}
        >
          <span>{hoursStr}</span>
          <span className="mx-2 text-white/40">:</span>
          <span>{minutes}</span>

          {settings.showSeconds && (
            <span
              className={`ml-3 font-semibold ${
                isMiniPreview ? 'text-xs' : 'text-xl sm:text-2xl md:text-3xl'
              }`}
              style={{ color: theme.accentColor }}
            >
              .{seconds}
            </span>
          )}

          {settings.timeFormat === '12h' && settings.showAmPm && (
            <span
              className={`ml-3 uppercase font-sans text-xs tracking-widest px-2 py-0.5 rounded border border-white/20 text-white/80 self-center ${
                isMiniPreview ? 'hidden' : 'block'
              }`}
            >
              {ampm}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
