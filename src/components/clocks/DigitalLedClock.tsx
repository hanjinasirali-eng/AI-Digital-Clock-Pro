import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const DigitalLedClock: React.FC<ClockProps> = ({
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

  const glowStyle =
    settings.glowIntensity !== 'off'
      ? {
          textShadow: `0 0 12px ${theme.glowColor}, 0 0 28px ${theme.glowColor}`,
        }
      : {};

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* 7-Segment Digital Display Box */}
      <div className={`relative px-4 py-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md shadow-2xl ${isMiniPreview ? 'px-2 py-1' : 'px-8 py-6'}`}>
        <div
          className={`flex items-baseline justify-center font-orbitron tracking-wider tabular-nums ${
            isMiniPreview ? 'text-2xl' : 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
          }`}
          style={{ color: theme.textColor, ...glowStyle }}
        >
          <span>{hoursStr}</span>
          <span
            className={`mx-1 transition-opacity duration-150 ${showColon ? 'opacity-100' : 'opacity-20'}`}
          >
            :
          </span>
          <span>{minutes}</span>

          {settings.showSeconds && (
            <>
              <span
                className={`mx-1 text-[0.6em] transition-opacity duration-150 ${
                  showColon ? 'opacity-100' : 'opacity-20'
                }`}
              >
                :
              </span>
              <span className="text-[0.65em] font-semibold opacity-90">{seconds}</span>
            </>
          )}

          {settings.timeFormat === '12h' && settings.showAmPm && (
            <span
              className={`ml-3 font-chakra font-bold uppercase tracking-widest ${
                isMiniPreview ? 'text-[10px]' : 'text-base sm:text-xl lg:text-2xl'
              }`}
              style={{ color: theme.accentColor }}
            >
              {ampm}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
