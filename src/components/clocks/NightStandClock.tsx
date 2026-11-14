import React from 'react';
import { ClockSettings, ClockTheme, AlarmItem } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
  nextAlarm?: AlarmItem | null;
}

export const NightStandClock: React.FC<ClockProps> = ({
  time,
  settings,
  isMiniPreview = false,
  nextAlarm,
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

  // Authentic Bedside Red Phosphor (#ff2a2a) with deep red glow
  const redColor = '#ff2b2b';
  const glowStyle = {
    textShadow: '0 0 16px rgba(255, 43, 43, 0.85), 0 0 35px rgba(255, 43, 43, 0.45), 0 0 70px rgba(255, 43, 43, 0.25)',
  };

  return (
    <div className="flex flex-col items-center justify-center select-none text-center bg-black rounded-3xl p-4 sm:p-8">
      {/* Time Display */}
      <div
        className={`flex items-baseline justify-center font-orbitron font-bold tracking-wider tabular-nums ${
          isMiniPreview ? 'text-3xl' : 'text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none'
        }`}
        style={{
          color: redColor,
          ...glowStyle,
        }}
      >
        <span>{hoursStr}</span>
        <span className={`mx-1 sm:mx-2 transition-opacity duration-150 ${showColon ? 'opacity-100' : 'opacity-20'}`}>
          :
        </span>
        <span>{minutes}</span>

        {settings.showSeconds && (
          <>
            <span className={`mx-1 text-[0.55em] transition-opacity duration-150 ${showColon ? 'opacity-100' : 'opacity-20'}`}>
              :
            </span>
            <span className="text-[0.6em] font-medium opacity-85">{seconds}</span>
          </>
        )}

        {settings.timeFormat === '12h' && settings.showAmPm && (
          <span
            className={`ml-2 uppercase font-rajdhani font-semibold tracking-widest ${
              isMiniPreview ? 'text-[9px]' : 'text-base sm:text-xl lg:text-2xl'
            }`}
            style={{ color: '#ff5555' }}
          >
            {ampm}
          </span>
        )}
      </div>

      {/* Date & Next Alarm Status Line */}
      {!isMiniPreview && (
        <div className="flex items-center gap-4 mt-6 text-sm sm:text-base font-rajdhani tracking-wider text-red-500/80">
          <span>
            {time.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {nextAlarm && (
            <>
              <span className="text-red-900">|</span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm shadow-red-500" />
                Alarm {nextAlarm.time} ({nextAlarm.label})
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
