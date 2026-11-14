import React from 'react';
import { ClockSettings, ClockTheme } from '../../types/clock';

interface ClockProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
}

export const AnalogClock: React.FC<ClockProps> = ({
  time,
  theme,
  settings,
  isMiniPreview = false,
}) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  // Smooth angles
  const secondDeg = (seconds + ms / 1000) * 6; // 360 / 60
  const minuteDeg = (minutes + seconds / 60) * 6;
  const hourDeg = (hours + minutes / 60) * 30;

  const size = isMiniPreview ? 90 : 320;
  const center = size / 2;
  const radius = center - (isMiniPreview ? 6 : 18);

  // Hour numerals (1 to 12)
  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="filter drop-shadow-2xl"
        >
          {/* Dial Rim & Face */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="rgba(5, 7, 13, 0.85)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={isMiniPreview ? 2 : 4}
          />

          {/* Minute / Hour Ticks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 * Math.PI) / 180;
            const isHourTick = i % 5 === 0;
            const tickLength = isHourTick ? (isMiniPreview ? 4 : 10) : isMiniPreview ? 2 : 4;
            const rInner = radius - tickLength;
            const x1 = center + radius * Math.sin(angle);
            const y1 = center - radius * Math.cos(angle);
            const x2 = center + rInner * Math.sin(angle);
            const y2 = center - rInner * Math.cos(angle);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHourTick ? theme.accentColor : 'rgba(255, 255, 255, 0.25)'}
                strokeWidth={isHourTick ? (isMiniPreview ? 1.5 : 2.5) : 1}
              />
            );
          })}

          {/* Hour Numbers */}
          {!isMiniPreview &&
            numbers.map((num, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const rText = radius - 26;
              const x = center + rText * Math.sin(angle);
              const y = center - rText * Math.cos(angle);

              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="rgba(255, 255, 255, 0.85)"
                  className="font-chakra font-semibold text-sm"
                >
                  {num}
                </text>
              );
            })}

          {/* Brand Wordmark inside dial */}
          {!isMiniPreview && (
            <text
              x={center}
              y={center - radius * 0.45}
              textAnchor="middle"
              fill={theme.accentColor}
              className="font-orbitron text-[9px] tracking-widest font-semibold uppercase opacity-80"
            >
              PRO CHRONO
            </text>
          )}

          {/* Hour Hand */}
          <line
            x1={center}
            y1={center}
            x2={center + radius * 0.5 * Math.sin((hourDeg * Math.PI) / 180)}
            y2={center - radius * 0.5 * Math.cos((hourDeg * Math.PI) / 180)}
            stroke="#ffffff"
            strokeWidth={isMiniPreview ? 2.5 : 5}
            strokeLinecap="round"
          />

          {/* Minute Hand */}
          <line
            x1={center}
            y1={center}
            x2={center + radius * 0.72 * Math.sin((minuteDeg * Math.PI) / 180)}
            y2={center - radius * 0.72 * Math.cos((minuteDeg * Math.PI) / 180)}
            stroke={theme.textColor}
            strokeWidth={isMiniPreview ? 2 : 3.5}
            strokeLinecap="round"
          />

          {/* Sweep Second Hand */}
          {settings.showSeconds && (
            <>
              <line
                x1={center - radius * 0.15 * Math.sin((secondDeg * Math.PI) / 180)}
                y1={center + radius * 0.15 * Math.cos((secondDeg * Math.PI) / 180)}
                x2={center + radius * 0.82 * Math.sin((secondDeg * Math.PI) / 180)}
                y2={center - radius * 0.82 * Math.cos((secondDeg * Math.PI) / 180)}
                stroke={theme.accentColor}
                strokeWidth={isMiniPreview ? 1 : 1.5}
                strokeLinecap="round"
              />
              <circle
                cx={center + radius * 0.65 * Math.sin((secondDeg * Math.PI) / 180)}
                cy={center - radius * 0.65 * Math.cos((secondDeg * Math.PI) / 180)}
                r={isMiniPreview ? 1.5 : 3.5}
                fill={theme.accentColor}
              />
            </>
          )}

          {/* Center Cap */}
          <circle
            cx={center}
            cy={center}
            r={isMiniPreview ? 3 : 5.5}
            fill="#ffffff"
            stroke={theme.accentColor}
            strokeWidth={1.5}
          />
        </svg>
      </div>
    </div>
  );
};
