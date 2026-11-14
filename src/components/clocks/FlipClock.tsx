import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

const FlipCard: React.FC<{
  digit: string;
  label?: string;
  isMiniPreview?: boolean;
  accentColor: string;
}> = ({ digit, label, isMiniPreview, accentColor }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-950 border border-neutral-700/60 shadow-xl overflow-hidden ${
          isMiniPreview ? 'w-8 h-10 rounded-md' : 'w-16 h-22 sm:w-22 sm:h-28 md:w-28 md:h-36 lg:w-32 lg:h-40'
        }`}
      >
        {/* Top Half */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.04] border-b border-black/80 flex items-end justify-center overflow-hidden">
          <span
            className={`font-jetbrains font-bold text-white tabular-nums translate-y-1/2 ${
              isMiniPreview ? 'text-lg' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
            }`}
          >
            {digit}
          </span>
        </div>

        {/* Bottom Half */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/40 flex items-start justify-center overflow-hidden">
          <span
            className={`font-jetbrains font-bold text-white/90 tabular-nums -translate-y-1/2 ${
              isMiniPreview ? 'text-lg' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
            }`}
          >
            {digit}
          </span>
        </div>

        {/* Mechanical Center Slit & Side Pins */}
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/90 shadow-sm z-10" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-neutral-600 rounded-r-sm z-20" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-neutral-600 rounded-l-sm z-20" />
      </div>

      {label && !isMiniPreview && (
        <span
          className="mt-2 text-[10px] sm:text-xs font-medium tracking-widest uppercase opacity-75"
          style={{ color: accentColor }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export const FlipClock: React.FC<ClockProps> = ({
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
    <div className="flex flex-col items-center justify-center select-none">
      <div className={`flex items-center ${isMiniPreview ? 'gap-1' : 'gap-2 sm:gap-3 md:gap-4'}`}>
        {/* Hours */}
        <div className="flex gap-1">
          <FlipCard
            digit={hoursStr[0]}
            label="Hours"
            isMiniPreview={isMiniPreview}
            accentColor={theme.accentColor}
          />
          <FlipCard
            digit={hoursStr[1]}
            isMiniPreview={isMiniPreview}
            accentColor={theme.accentColor}
          />
        </div>

        {/* Separator Dots */}
        <div className="flex flex-col gap-2 py-2">
          <div
            className={`rounded-full shadow-sm ${
              isMiniPreview ? 'w-1 h-1' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'
            }`}
            style={{ backgroundColor: theme.accentColor }}
          />
          <div
            className={`rounded-full shadow-sm ${
              isMiniPreview ? 'w-1 h-1' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'
            }`}
            style={{ backgroundColor: theme.accentColor }}
          />
        </div>

        {/* Minutes */}
        <div className="flex gap-1">
          <FlipCard
            digit={minutes[0]}
            label="Minutes"
            isMiniPreview={isMiniPreview}
            accentColor={theme.accentColor}
          />
          <FlipCard
            digit={minutes[1]}
            isMiniPreview={isMiniPreview}
            accentColor={theme.accentColor}
          />
        </div>

        {/* Seconds */}
        {settings.showSeconds && (
          <>
            <div className="flex flex-col gap-2 py-2">
              <div
                className={`rounded-full shadow-sm ${
                  isMiniPreview ? 'w-1 h-1' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'
                }`}
                style={{ backgroundColor: theme.accentColor }}
              />
              <div
                className={`rounded-full shadow-sm ${
                  isMiniPreview ? 'w-1 h-1' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'
                }`}
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>
            <div className="flex gap-1">
              <FlipCard
                digit={seconds[0]}
                label="Sec"
                isMiniPreview={isMiniPreview}
                accentColor={theme.accentColor}
              />
              <FlipCard
                digit={seconds[1]}
                isMiniPreview={isMiniPreview}
                accentColor={theme.accentColor}
              />
            </div>
          </>
        )}

        {/* AM/PM */}
        {settings.timeFormat === '12h' && settings.showAmPm && (
          <div className="flex flex-col justify-end self-stretch pb-4">
            <span
              className={`font-jetbrains font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 ${
                isMiniPreview ? 'text-[8px]' : 'text-xs sm:text-sm'
              }`}
              style={{ color: theme.textColor }}
            >
              {ampm}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
