import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const NeonGlowClock: React.FC<ClockProps> = ({
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

  const glowShadow = `0 0 5px #fff, 0 0 15px ${theme.glowColor}, 0 0 35px ${theme.glowColor}, 0 0 70px ${theme.glowColor}`;

  return (
    <div className="flex flex-col items-center justify-center select-none text-center">
      <div
        className={`flex items-baseline justify-center font-chakra font-bold tracking-widest tabular-nums ${
          isMiniPreview ? 'text-3xl' : 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
        }`}
        style={{
          color: '#ffffff',
          textShadow: glowShadow,
        }}
      >
        <span>{hoursStr}</span>
        <span
          className={`mx-2 transition-opacity duration-150 ${showColon ? 'opacity-100' : 'opacity-10'}`}
          style={{ textShadow: glowShadow }}
        >
          :
        </span>
        <span>{minutes}</span>

        {settings.showSeconds && (
          <>
            <span
              className={`mx-1 text-[0.6em] transition-opacity duration-150 ${
                showColon ? 'opacity-100' : 'opacity-10'
              }`}
            >
              :
            </span>
            <span className="text-[0.6em] opacity-90">{seconds}</span>
          </>
        )}

        {settings.timeFormat === '12h' && settings.showAmPm && (
          <span
            className={`ml-3 uppercase font-syne font-black tracking-widest ${
              isMiniPreview ? 'text-[9px]' : 'text-base sm:text-xl'
            }`}
            style={{ color: theme.accentColor, textShadow: `0 0 15px ${theme.glowColor}` }}
          >
            {ampm}
          </span>
        )}
      </div>
    </div>
  );
};
