import React from 'react';
import { ClockSettings, ClockStyle, ClockTheme } from '../../types/clock';
import {
  Settings,
  Globe,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Sun,
  RotateCcw,
  Sliders,
  Check,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface SettingsViewProps {
  settings: ClockSettings;
  onUpdateSettings: (updates: Partial<ClockSettings>) => void;
  onResetSettings: () => void;
  currentStyle: ClockStyle;
  onSelectStyle: (style: ClockStyle) => void;
  onOpenThemeModal: () => void;
  currentTheme: ClockTheme;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  currentStyle,
  onSelectStyle,
  onOpenThemeModal,
  currentTheme,
}) => {
  const languages = [
    { id: 'en', name: 'English (US)' },
    { id: 'es', name: 'Español' },
    { id: 'fr', name: 'Français' },
    { id: 'de', name: 'Deutsch' },
    { id: 'ja', name: '日本語' },
    { id: 'ar', name: 'العربية' },
    { id: 'ur', name: 'اردو' },
    { id: 'zh', name: '中文' },
  ];

  const clockStyles: { id: ClockStyle; label: string }[] = [
    { id: 'digital-led', label: 'Digital LED' },
    { id: 'flip', label: 'Flip Clock' },
    { id: 'minimal', label: 'Minimal Digital' },
    { id: 'neon', label: 'Neon Glow' },
    { id: 'retro', label: 'Retro VCR' },
    { id: 'nightstand', label: 'Night Stand' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'amoled', label: 'Modern AMOLED' },
    { id: 'big-number', label: 'Big Number' },
    { id: 'analog', label: 'Analog' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-300" />
          Settings & Preferences
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Customize your clock display rules, audio behaviors, language, and power saving.
        </p>
      </div>

      {/* Section 1: Time & Display Formats */}
      <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Time & Display Format
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 12h vs 24h Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/5">
            <div>
              <span className="text-sm font-medium text-white">Hour Format</span>
              <p className="text-xs text-slate-400">Choose 12-Hour or 24-Hour military time</p>
            </div>
            <div className="flex items-center p-1 rounded-xl bg-neutral-800 border border-white/10">
              <button
                onClick={() => onUpdateSettings({ timeFormat: '12h' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  settings.timeFormat === '12h'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                12-Hour
              </button>
              <button
                onClick={() => onUpdateSettings({ timeFormat: '24h' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  settings.timeFormat === '24h'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                24-Hour
              </button>
            </div>
          </div>

          {/* Default Clock Style */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/5">
            <div>
              <span className="text-sm font-medium text-white">Clock Style</span>
              <p className="text-xs text-slate-400">Current active display face</p>
            </div>
            <select
              value={currentStyle}
              onChange={(e) => onSelectStyle(e.target.value as ClockStyle)}
              className="bg-neutral-800 border border-white/10 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {clockStyles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          {/* Seconds Visibility */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/5 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200">Show Seconds</span>
              <p className="text-[11px] text-slate-400">Display running seconds counters</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showSeconds}
              onChange={(e) => onUpdateSettings({ showSeconds: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>

          {/* Date Visibility */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/5 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200">Show Date & Calendar</span>
              <p className="text-[11px] text-slate-400">Display day, month, and year</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showDate}
              onChange={(e) => onUpdateSettings({ showDate: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>

          {/* Blinking Colons */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/5 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200">Blinking Colons</span>
              <p className="text-[11px] text-slate-400">Pulsing colon separators every second</p>
            </div>
            <input
              type="checkbox"
              checked={settings.blinkColons}
              onChange={(e) => onUpdateSettings({ blinkColons: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>

          {/* AM/PM Indicator */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/5 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200">Show AM / PM Marker</span>
              <p className="text-[11px] text-slate-400">Display 12-hour period indicator</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showAmPm}
              onChange={(e) => onUpdateSettings({ showAmPm: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Section 2: Audio & Mechanical Sound */}
      <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          Sound & Acoustics
        </h3>

        {/* Ticking sound toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/5">
          <div>
            <span className="text-sm font-medium text-white">Mechanical Clock Tick</span>
            <p className="text-xs text-slate-400">
              Plays realistic subtle mechanical escapement click on every second
            </p>
          </div>
          <button
            onClick={() => {
              const nextVal = !settings.tickSound;
              onUpdateSettings({ tickSound: nextVal });
              if (nextVal) soundEngine.playTick(settings.soundVolume);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              settings.tickSound
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-neutral-800 text-slate-400 hover:text-white'
            }`}
          >
            {settings.tickSound ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Master Sound Volume */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-sm font-medium text-white">Sound Effects Volume</span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundVolume}
              onChange={(e) => onUpdateSettings({ soundVolume: parseFloat(e.target.value) })}
              className="w-32 accent-emerald-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300 w-10">
              {Math.round(settings.soundVolume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Screen & Brightness */}
      <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          Brightness & Power Control
        </h3>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/5">
          <div>
            <span className="text-sm font-medium text-white">Display Brightness</span>
            <p className="text-xs text-slate-400">Controls software screen dimming overlay</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="100"
              value={settings.brightness}
              onChange={(e) => onUpdateSettings({ brightness: parseInt(e.target.value, 10) })}
              className="w-32 accent-amber-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300 w-10">{settings.brightness}%</span>
          </div>
        </div>
      </div>

      {/* Section 4: Internationalization & Language */}
      <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Language & Regional Settings
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onUpdateSettings({ language: lang.id as any })}
              className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                settings.language === lang.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md font-bold'
                  : 'bg-black/50 hover:bg-white/5 border-white/5 text-slate-300'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Settings Danger Zone */}
      <div className="pt-4 flex justify-between items-center">
        <p className="text-xs text-slate-500">All configurations save automatically in your browser.</p>
        <button
          onClick={() => {
            if (confirm('Reset all clock settings to factory defaults?')) {
              onResetSettings();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Settings
        </button>
      </div>
    </div>
  );
};
