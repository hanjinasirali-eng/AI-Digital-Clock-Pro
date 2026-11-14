import React, { useState, useEffect } from 'react';
import {
  ClockSettings,
  ClockStyle,
  ClockTheme,
  AlarmItem,
  WeatherData,
} from '../../types/clock';
import { ClockRenderer } from '../clocks/ClockRenderer';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  BatteryCharging,
  BatteryMedium,
  BatteryLow,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  BedDouble,
  Palette,
  Image as ImageIcon,
  Sliders,
  RotateCw,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { t } from '../../utils/i18n';
import { fetchLiveWeather } from '../../utils/weather';

interface MainClockViewProps {
  time: Date;
  theme: ClockTheme;
  settings: ClockSettings;
  currentStyle: ClockStyle;
  nextAlarm?: AlarmItem | null;
  onOpenThemeModal: () => void;
  onOpenWallpaperModal: () => void;
  onOpenStylesModal: () => void;
  onToggleNightStand: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
}

export const MainClockView: React.FC<MainClockViewProps> = ({
  time,
  theme,
  settings,
  currentStyle,
  nextAlarm,
  onOpenThemeModal,
  onOpenWallpaperModal,
  onOpenStylesModal,
  onToggleNightStand,
  onToggleFullscreen,
  isFullscreen,
  onUpdateSettings,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);
  const [cleanView, setCleanView] = useState(false);
  const [simulatedOrientation, setSimulatedOrientation] = useState<'auto' | 'landscape' | 'portrait'>('auto');

  // Load weather
  useEffect(() => {
    fetchLiveWeather().then(setWeather).catch(() => {});
  }, []);

  // Battery status API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        })
        .catch(() => {});
    }
  }, []);

  // Screen Wake Lock API
  const toggleWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        if (!wakeLockActive) {
          const sentinel = await (navigator as any).wakeLock.request('screen');
          setWakeLockSentinel(sentinel);
          setWakeLockActive(true);
          sentinel.addEventListener('release', () => {
            setWakeLockActive(false);
            setWakeLockSentinel(null);
          });
        } else if (wakeLockSentinel) {
          await wakeLockSentinel.release();
          setWakeLockActive(false);
          setWakeLockSentinel(null);
        }
      } catch (err) {
        console.warn('Wake lock error:', err);
      }
    }
  };

  // Weather icon selector
  const renderWeatherIcon = () => {
    if (!weather) return <Sun className="w-4 h-4 text-amber-400" />;
    switch (weather.icon) {
      case 'rain':
        return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'snow':
        return <CloudSnow className="w-4 h-4 text-blue-200" />;
      case 'storm':
        return <CloudLightning className="w-4 h-4 text-amber-400" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 text-slate-300" />;
      case 'moon':
        return <Moon className="w-4 h-4 text-indigo-300" />;
      default:
        return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  // Formatted date string
  const formatDate = () => {
    const lang = settings.language;
    const options: Intl.DateTimeFormatOptions = {
      weekday: settings.showDayOfWeek ? 'long' : undefined,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return time.toLocaleDateString(lang, options);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between transition-all duration-300 ${
        simulatedOrientation === 'landscape' ? 'flex-row items-center px-8' : 'px-4 sm:px-6 md:px-10 py-4 sm:py-6'
      }`}
      style={{
        filter: `brightness(${settings.brightness}%)`,
      }}
    >
      {/* Top Status & Quick Widgets Bar */}
      <div
        className={`w-full flex items-center justify-between gap-4 transition-opacity duration-300 ${
          cleanView ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Left: Weather and Battery */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Weather Widget */}
          {weather && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-white/90 shadow-lg">
              {renderWeatherIcon()}
              <span className="font-medium tabular-nums">{weather.temp}°C</span>
              <span className="hidden sm:inline text-white/50">·</span>
              <span className="hidden sm:inline text-white/70">{weather.city}</span>
              <button
                onClick={() => fetchLiveWeather().then(setWeather)}
                title="Refresh weather"
                className="hover:text-white text-white/50 transition-colors ml-1"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Battery Indicator */}
          {batteryLevel !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-white/90 shadow-lg">
              {isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              ) : batteryLevel <= 20 ? (
                <BatteryLow className="w-4 h-4 text-rose-400" />
              ) : (
                <BatteryMedium className="w-4 h-4 text-emerald-400" />
              )}
              <span className="font-mono tabular-nums">{batteryLevel}%</span>
            </div>
          )}

          {/* Next Alarm Pill */}
          {nextAlarm && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 backdrop-blur-md text-xs text-red-200">
              <Bell className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>{nextAlarm.time}</span>
              <span className="text-red-400/60">({nextAlarm.label})</span>
            </div>
          )}
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Orientation switch */}
          <button
            onClick={() => {
              setSimulatedOrientation((prev) =>
                prev === 'auto' ? 'landscape' : prev === 'landscape' ? 'portrait' : 'auto'
              );
            }}
            title="Toggle orientation preview"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/40 hover:bg-white/10 border border-white/10 backdrop-blur-md text-xs text-white/80 transition-all flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline uppercase text-[10px] tracking-wider font-mono">
              {simulatedOrientation}
            </span>
          </button>

          {/* Screen Wake Lock */}
          {'wakeLock' in navigator && (
            <button
              onClick={toggleWakeLock}
              title={wakeLockActive ? 'Screen will stay awake' : 'Enable screen keep-awake'}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full border backdrop-blur-md text-xs transition-all flex items-center gap-1.5 ${
                wakeLockActive
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/20 shadow-md'
                  : 'bg-black/40 hover:bg-white/10 border-white/10 text-white/70'
              }`}
            >
              {wakeLockActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-[11px] font-medium">Awake</span>
            </button>
          )}

          {/* Night Stand Mode quick switch */}
          <button
            onClick={onToggleNightStand}
            title="Switch to Night Stand Mode"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/40 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 backdrop-blur-md text-xs text-red-400 transition-all flex items-center gap-1.5 shadow-lg"
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium text-[11px]">Night Stand</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 rounded-full bg-black/40 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white/80 hover:text-white transition-all shadow-lg"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Center Clock Attraction */}
      <div
        className="flex-1 flex flex-col items-center justify-center my-auto cursor-pointer"
        onClick={() => setCleanView((prev) => !prev)}
        title="Tap anywhere to toggle clean view"
      >
        <ClockRenderer
          style={currentStyle}
          time={time}
          theme={theme}
          settings={settings}
          nextAlarm={nextAlarm}
        />

        {/* Live Date and Day */}
        {settings.showDate && (
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm sm:text-lg md:text-xl font-medium tracking-wide text-white/75">
              {formatDate()}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div
        className={`w-full flex items-center justify-center gap-3 transition-opacity duration-300 pb-2 ${
          cleanView ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* Clock Styles Picker */}
          <button
            onClick={onOpenStylesModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full hover:bg-white/10 text-xs sm:text-sm font-medium text-white transition-colors"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Styles</span>
          </button>

          <span className="w-px h-4 bg-white/10" />

          {/* Theme Selector */}
          <button
            onClick={onOpenThemeModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full hover:bg-white/10 text-xs sm:text-sm font-medium text-white transition-colors"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Themes</span>
          </button>

          <span className="w-px h-4 bg-white/10" />

          {/* Wallpapers Selector */}
          <button
            onClick={onOpenWallpaperModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full hover:bg-white/10 text-xs sm:text-sm font-medium text-white transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Wallpapers</span>
          </button>
        </div>
      </div>

      {/* Minimal clean-view hint */}
      {cleanView && (
        <button
          onClick={() => setCleanView(false)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 border border-white/10 text-[11px] text-white/60 hover:text-white backdrop-blur-md transition-all shadow-xl"
        >
          Tap screen to show controls
        </button>
      )}
    </div>
  );
};
