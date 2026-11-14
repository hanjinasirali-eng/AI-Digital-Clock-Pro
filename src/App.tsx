import React, { useState, useEffect, useRef } from 'react';
import {
  ClockSettings,
  ClockStyle,
  ClockTheme,
  AlarmItem,
  WorldClockCity,
  WallpaperItem,
} from './types/clock';
import {
  loadSettings,
  saveSettings,
  loadCurrentTheme,
  saveCurrentTheme,
  loadAlarms,
  saveAlarms,
  loadWorldCities,
  saveWorldCities,
  loadCustomWallpapers,
  saveCustomWallpapers,
  PRESET_THEMES,
  PRESET_WALLPAPERS,
  DEFAULT_SETTINGS,
} from './utils/storage';
import { soundEngine } from './utils/audio';
import { BackgroundCanvas } from './components/common/BackgroundCanvas';
import { TopHeader, NavTab } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { MainClockView } from './components/views/MainClockView';
import { ClockStylesView } from './components/views/ClockStylesView';
import { NightStandView } from './components/views/NightStandView';
import { AlarmsView } from './components/views/AlarmsView';
import { StopwatchView } from './components/views/StopwatchView';
import { TimerView } from './components/views/TimerView';
import { WorldClockView } from './components/views/WorldClockView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { WallpapersModal } from './components/views/WallpapersModal';
import { ThemeModal } from './components/views/ThemeModal';
import { SettingsView } from './components/views/SettingsView';
import { AlarmRingingModal } from './components/views/AlarmRingingModal';

export default function App() {
  const [time, setTime] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<NavTab>('clock');
  const [settings, setSettings] = useState<ClockSettings>(loadSettings);
  const [currentTheme, setCurrentTheme] = useState<ClockTheme>(loadCurrentTheme);
  const [currentStyle, setCurrentStyle] = useState<ClockStyle>(loadSettings().defaultStyle || 'neon');
  const [alarms, setAlarms] = useState<AlarmItem[]>(loadAlarms);
  const [worldCities, setWorldCities] = useState<WorldClockCity[]>(loadWorldCities);
  const [customWallpapers, setCustomWallpapers] = useState<WallpaperItem[]>(loadCustomWallpapers);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperItem | undefined>(() => {
    return PRESET_WALLPAPERS.find((w) => w.id === 'nature-mountains') || PRESET_WALLPAPERS[1];
  });

  // Modals & Overlay Views
  const [isNightStandActive, setIsNightStandActive] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState<AlarmItem | null>(null);

  // Time ticker & Alarm detection loop
  const lastTriggeredMinuteRef = useRef<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      // Play subtle tick sound if enabled
      if (settings.tickSound) {
        soundEngine.playTick(settings.soundVolume);
      }

      // Check alarms
      const currentH = now.getHours().toString().padStart(2, '0');
      const currentM = now.getMinutes().toString().padStart(2, '0');
      const currentHM = `${currentH}:${currentM}`;
      const currentDay = now.getDay(); // 0 to 6

      if (lastTriggeredMinuteRef.current !== currentHM) {
        alarms.forEach((alarm) => {
          if (alarm.enabled && alarm.time === currentHM) {
            const matchesDay = alarm.days.length === 0 || alarm.days.includes(currentDay);
            if (matchesDay && !ringingAlarm) {
              setRingingAlarm(alarm);
              lastTriggeredMinuteRef.current = currentHM;
            }
          }
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.tickSound, settings.soundVolume, alarms, ringingAlarm]);

  // Sync settings & themes to localStorage
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveCurrentTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  useEffect(() => {
    saveWorldCities(worldCities);
  }, [worldCities]);

  useEffect(() => {
    saveCustomWallpapers(customWallpapers);
  }, [customWallpapers]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // Find next upcoming alarm for dashboard display
  const getNextUpcomingAlarm = (): AlarmItem | null => {
    const enabledAlarms = alarms.filter((a) => a.enabled);
    if (enabledAlarms.length === 0) return null;
    return enabledAlarms[0];
  };

  // Alarm Actions
  const handleAddAlarm = (newAlarm: AlarmItem) => {
    setAlarms((prev) => [...prev, newAlarm]);
  };

  const handleUpdateAlarm = (id: string, updates: Partial<AlarmItem>) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSnoozeAlarm = (minutes: number) => {
    soundEngine.stopAlarm();
    setRingingAlarm(null);
    // Temporary reschedule in minutes
    const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
    const snoozeTime = `${snoozeDate.getHours().toString().padStart(2, '0')}:${snoozeDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    if (ringingAlarm) {
      const snoozedItem: AlarmItem = {
        ...ringingAlarm,
        id: `snoozed-${Date.now()}`,
        time: snoozeTime,
        label: `${ringingAlarm.label} (Snoozed)`,
        enabled: true,
      };
      setAlarms((prev) => [...prev, snoozedItem]);
    }
  };

  const handleDismissAlarm = () => {
    soundEngine.stopAlarm();
    setRingingAlarm(null);
  };

  // World Cities Actions
  const handleAddCity = (city: WorldClockCity) => {
    if (!worldCities.some((c) => c.id === city.id)) {
      setWorldCities((prev) => [...prev, city]);
    }
  };

  const handleRemoveCity = (id: string) => {
    setWorldCities((prev) => prev.filter((c) => c.id !== id));
  };

  // AI Theme application
  const handleApplyAiTheme = (newTheme: ClockTheme, newStyle?: ClockStyle) => {
    setCurrentTheme(newTheme);
    if (newStyle) {
      setCurrentStyle(newStyle);
    }
    setActiveTab('clock');
  };

  // Settings update helper
  const handleUpdateSettings = (updates: Partial<ClockSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setCurrentTheme(PRESET_THEMES[0]);
    setCurrentStyle('neon');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030508] text-slate-100 overflow-x-hidden">
      {/* Background Layer with Wallpaper or Canvas Animation */}
      <BackgroundCanvas
        wallpaper={selectedWallpaper}
        bgColor={currentTheme.bgColor}
        blurPx={settings.wallpaperBlur}
        dimPercent={settings.wallpaperDim}
      />

      {/* Top Header (Desktop & Tablet) */}
      {!isNightStandActive && (
        <TopHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLaunchNightStand={() => setIsNightStandActive(true)}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center w-full relative z-10">
        {activeTab === 'clock' && (
          <MainClockView
            time={time}
            theme={currentTheme}
            settings={settings}
            currentStyle={currentStyle}
            nextAlarm={getNextUpcomingAlarm()}
            onOpenThemeModal={() => setShowThemeModal(true)}
            onOpenWallpaperModal={() => setShowWallpaperModal(true)}
            onOpenStylesModal={() => setActiveTab('styles')}
            onToggleNightStand={() => setIsNightStandActive(true)}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === 'styles' && (
          <ClockStylesView
            time={time}
            theme={currentTheme}
            settings={settings}
            currentStyle={currentStyle}
            onSelectStyle={(style) => {
              setCurrentStyle(style);
              handleUpdateSettings({ defaultStyle: style });
              setActiveTab('clock');
            }}
          />
        )}

        {activeTab === 'alarms' && (
          <AlarmsView
            alarms={alarms}
            onAddAlarm={handleAddAlarm}
            onUpdateAlarm={handleUpdateAlarm}
            onDeleteAlarm={handleDeleteAlarm}
            onTestAlarmTrigger={(al) => setRingingAlarm(al)}
          />
        )}

        {activeTab === 'stopwatch' && <StopwatchView />}

        {activeTab === 'timer' && <TimerView />}

        {activeTab === 'world' && (
          <WorldClockView
            time={time}
            cities={worldCities}
            onAddCity={handleAddCity}
            onRemoveCity={handleRemoveCity}
            timeFormat={settings.timeFormat}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantView
            onApplyCustomTheme={handleApplyAiTheme}
            currentTheme={currentTheme}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetSettings={handleResetSettings}
            currentStyle={currentStyle}
            onSelectStyle={setCurrentStyle}
            onOpenThemeModal={() => setShowThemeModal(true)}
            currentTheme={currentTheme}
          />
        )}
      </main>

      {/* App Footer (End of App) */}
      {!isNightStandActive && (
        <footer className="relative z-10 w-full px-6 py-3 pb-20 lg:pb-4 border-t border-white/5 bg-black/30 backdrop-blur-md text-center text-xs text-slate-400 select-none">
          <span>AI Digital Clock Pro</span>
          <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-200 font-medium">Zulmanan Hassan</span>
        </footer>
      )}

      {/* Bottom Navigation (Mobile & Tablet) */}
      {!isNightStandActive && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadAlarmsCount={alarms.filter((a) => a.enabled).length}
        />
      )}

      {/* Night Stand Mode Fullscreen Overlay */}
      {isNightStandActive && (
        <NightStandView
          time={time}
          theme={currentTheme}
          settings={settings}
          nextAlarm={getNextUpcomingAlarm()}
          onExit={() => setIsNightStandActive(false)}
          onUpdateBrightness={(b) => handleUpdateSettings({ brightness: b })}
        />
      )}

      {/* Wallpaper Selection Modal */}
      {showWallpaperModal && (
        <WallpapersModal
          currentWallpaper={selectedWallpaper}
          customWallpapers={customWallpapers}
          onSelectWallpaper={(wp) => {
            setSelectedWallpaper(wp);
            setShowWallpaperModal(false);
          }}
          onAddCustomWallpaper={(newWp) => {
            setCustomWallpapers((prev) => [...prev, newWp]);
          }}
          blurPx={settings.wallpaperBlur}
          dimPercent={settings.wallpaperDim}
          onUpdateBlur={(blur) => handleUpdateSettings({ wallpaperBlur: blur })}
          onUpdateDim={(dim) => handleUpdateSettings({ wallpaperDim: dim })}
          onClose={() => setShowWallpaperModal(false)}
        />
      )}

      {/* Theme Customization Modal */}
      {showThemeModal && (
        <ThemeModal
          currentTheme={currentTheme}
          onSelectTheme={(theme) => {
            setCurrentTheme(theme);
            setShowThemeModal(false);
          }}
          onUpdateCustomTheme={(updates) => {
            setCurrentTheme((prev) => ({ ...prev, ...updates, isCustom: true }));
          }}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {/* Alarm Ringing Modal */}
      {ringingAlarm && (
        <AlarmRingingModal
          alarm={ringingAlarm}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
        />
      )}
    </div>
  );
}
