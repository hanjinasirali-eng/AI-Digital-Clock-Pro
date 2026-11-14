import React, { useState, useEffect } from 'react';
import { ClockSettings, ClockTheme, AlarmItem } from '../../types/clock';
import { NightStandClock } from '../clocks/NightStandClock';
import {
  X,
  Volume2,
  VolumeX,
  Sun,
  Lock,
  CloudRain,
  Radio,
  Sliders,
} from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface NightStandViewProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  nextAlarm?: AlarmItem | null;
  onExit: () => void;
  onUpdateBrightness: (brightness: number) => void;
}

export const NightStandView: React.FC<NightStandViewProps> = ({
  time,
  theme,
  settings,
  nextAlarm,
  onExit,
  onUpdateBrightness,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [sleepSound, setSleepSound] = useState<'off' | 'rain' | 'crickets' | 'pink'>('off');
  const [activeNoise, setActiveNoise] = useState<{ stop: () => void } | null>(null);
  const [brightness, setBrightness] = useState(settings.brightness);

  // Auto keep screen awake in nightstand mode
  useEffect(() => {
    let sentinel: any = null;
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock.request('screen').then((s: any) => {
        sentinel = s;
      }).catch(() => {});
    }
    return () => {
      if (sentinel) sentinel.release().catch(() => {});
    };
  }, []);

  // Handle sleep sounds
  const handleToggleSound = (type: 'rain' | 'crickets' | 'pink') => {
    if (activeNoise) {
      activeNoise.stop();
      setActiveNoise(null);
    }
    if (sleepSound === type) {
      setSleepSound('off');
    } else {
      setSleepSound(type);
      const noise = soundEngine.createSleepNoise(type);
      setActiveNoise(noise);
    }
  };

  useEffect(() => {
    return () => {
      if (activeNoise) {
        activeNoise.stop();
      }
    };
  }, [activeNoise]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
      style={{
        filter: `brightness(${brightness}%)`,
      }}
      onClick={() => setShowControls((prev) => !prev)}
    >
      {/* Top minimal header */}
      <div
        className={`flex items-center justify-between w-full transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-red-500/80 px-2.5 py-1 rounded-full border border-red-500/20 bg-red-950/30">
            <Lock className="w-3 h-3 text-red-400" />
            Night Stand Mode
          </span>
        </div>

        {/* Exit Button */}
        <button
          onClick={onExit}
          className="p-2.5 rounded-full bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-colors shadow-lg"
          title="Exit Night Stand Mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Large Red Digital Bedside Clock */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <NightStandClock
          time={time}
          theme={theme}
          settings={{ ...settings, standbyRedMode: true }}
          nextAlarm={nextAlarm}
        />
      </div>

      {/* Bottom controls: Brightness slider & Sleep Ambient Sounds */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-2xl mx-auto transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brightness Dimmer */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-red-950/30 border border-red-500/20 text-red-400 backdrop-blur-md w-full sm:w-auto">
          <Sun className="w-4 h-4 opacity-75 shrink-0" />
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => {
              const val = Number(e.target.value);
              setBrightness(val);
              onUpdateBrightness(val);
            }}
            className="w-32 accent-red-500 h-1 bg-red-950 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono tabular-nums">{brightness}%</span>
        </div>

        {/* Ambient Bedside Sounds */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/30 border border-red-500/20 backdrop-blur-md">
          <span className="text-xs text-red-500/70 mr-1 hidden sm:inline">Sleep Sounds:</span>
          <button
            onClick={() => handleToggleSound('rain')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              sleepSound === 'rain'
                ? 'bg-red-500 text-black font-semibold'
                : 'text-red-400 hover:bg-red-950/50'
            }`}
          >
            Rain
          </button>
          <button
            onClick={() => handleToggleSound('pink')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              sleepSound === 'pink'
                ? 'bg-red-500 text-black font-semibold'
                : 'text-red-400 hover:bg-red-950/50'
            }`}
          >
            Pink Noise
          </button>
          {sleepSound !== 'off' && (
            <button
              onClick={() => {
                if (activeNoise) activeNoise.stop();
                setSleepSound('off');
              }}
              className="p-1 text-red-400 hover:text-white"
              title="Mute sounds"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
