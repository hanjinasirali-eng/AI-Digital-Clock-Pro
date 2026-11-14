import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const MinimalDigitalClock: React.FC<ClockProps> = ({
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

  return (
    <div className="flex flex-col items-center justify-center select-none text-center">
      <div
        className={`flex items-baseline justify-center font-light tracking-tighter tabular-nums ${
          isMiniPreview ? 'text-3xl' : 'text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none'
        }`}
        style={{ color: theme.textColor }}
      >
        <span className="font-extralight">{hoursStr}</span>
        <span className="mx-1 font-thin opacity-40">:</span>
        <span className="font-light">{minutes}</span>

        {settings.showSeconds && (
          <span
            className={`ml-3 font-normal opacity-50 ${
              isMiniPreview ? 'text-xs' : 'text-xl sm:text-2xl md:text-3xl'
            }`}
          >
            {seconds}
          </span>
        )}

        {settings.timeFormat === '12h' && settings.showAmPm && (
          <span
            className={`ml-2 text-xs uppercase tracking-widest font-medium opacity-60 self-start ${
              isMiniPreview ? 'text-[8px]' : 'text-xs sm:text-sm'
            }`}
          >
            {ampm}
          </span>
        )}
      </div>
    </div>
  );
};
