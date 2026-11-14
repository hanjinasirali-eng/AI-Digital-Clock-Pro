import React from 'react';
import { ClockSettings, ClockStyle, ClockTheme, AlarmItem } from '../../types/clock';
import { DigitalLedClock } from './DigitalLedClock';
import { FlipClock } from './FlipClock';
import { MinimalDigitalClock } from './MinimalDigitalClock';
import { NeonGlowClock } from './NeonGlowClock';
import { RetroClock } from './RetroClock';
import { NightStandClock } from './NightStandClock';
import { GradientClock } from './GradientClock';
import { ModernAmoledClock } from './ModernAmoledClock';
import { BigNumberClock } from './BigNumberClock';
import { AnalogClock } from './AnalogClock';

interface ClockRendererProps {
  style: ClockStyle;
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  isMiniPreview?: boolean;
  nextAlarm?: AlarmItem | null;
}

export const ClockRenderer: React.FC<ClockRendererProps> = ({
  style,
  time,
  theme,
  settings,
  isMiniPreview = false,
  nextAlarm,
}) => {
  // If user activated Night Stand mode or style is 'nightstand'
  if (style === 'nightstand' || settings.standbyRedMode) {
    return (
      <NightStandClock
        time={time}
        theme={theme}
        settings={settings}
        isMiniPreview={isMiniPreview}
        nextAlarm={nextAlarm}
      />
    );
  }

  switch (style) {
    case 'digital-led':
      return <DigitalLedClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'flip':
      return <FlipClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'minimal':
      return <MinimalDigitalClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'neon':
      return <NeonGlowClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'retro':
      return <RetroClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'gradient':
      return <GradientClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'amoled':
      return <ModernAmoledClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'big-number':
      return <BigNumberClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    case 'analog':
      return <AnalogClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
    default:
      return <NeonGlowClock time={time} theme={theme} settings={settings} isMiniPreview={isMiniPreview} />;
  }
};
