import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const BigNumberClock: React.FC<ClockProps> = ({
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
      <div className="flex flex-col items-center leading-[0.82] font-syne font-black tracking-tighter">
        {/* Hours Row */}
        <div
          className={`tabular-nums ${
            isMiniPreview ? 'text-4xl' : 'text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem]'
          }`}
          style={{ color: theme.textColor }}
        >
          {hoursStr}
        </div>

        {/* Minutes Row */}
        <div
          className={`tabular-nums opacity-90 ${
            isMiniPreview ? 'text-4xl' : 'text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem]'
          }`}
          style={{ color: theme.accentColor }}
        >
          {minutes}
        </div>
      </div>

      {/* Floating seconds & AM/PM tag */}
      <div className="flex items-center gap-3 mt-3">
        {settings.showSeconds && (
          <span
            className={`font-jetbrains font-bold px-2 py-0.5 rounded-full bg-white/10 ${
              isMiniPreview ? 'text-[8px]' : 'text-xs sm:text-sm'
            }`}
            style={{ color: theme.textColor }}
          >
            :{seconds}
          </span>
        )}
        {settings.timeFormat === '12h' && settings.showAmPm && (
          <span
            className={`font-jetbrains font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 ${
              isMiniPreview ? 'text-[8px]' : 'text-xs sm:text-sm'
            }`}
            style={{ color: theme.accentColor }}
          >
            {ampm}
          </span>
        )}
      </div>
    </div>
  );
};
