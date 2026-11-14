import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const GradientClock: React.FC<ClockProps> = ({
  time,
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

  return (
    <div className="flex flex-col items-center justify-center select-none text-center">
      <div
        className={`flex items-baseline justify-center font-syne font-extrabold tracking-tight tabular-nums bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 filter drop-shadow-lg ${
          isMiniPreview ? 'text-3xl' : 'text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none'
        }`}
      >
        <span>{hoursStr}</span>
        <span
          className={`mx-1 transition-opacity duration-150 ${showColon ? 'opacity-100' : 'opacity-20'}`}
        >
          :
        </span>
        <span>{minutes}</span>

        {settings.showSeconds && (
          <span
            className={`ml-3 font-semibold ${
              isMiniPreview ? 'text-xs' : 'text-xl sm:text-2xl md:text-3xl'
            }`}
          >
            {seconds}
          </span>
        )}

        {settings.timeFormat === '12h' && settings.showAmPm && (
          <span
            className={`ml-2 uppercase font-sans font-bold tracking-widest text-indigo-300 ${
              isMiniPreview ? 'text-[8px]' : 'text-sm sm:text-base'
            }`}
          >
            {ampm}
          </span>
        )}
      </div>
    </div>
  );
};
