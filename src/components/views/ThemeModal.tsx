import React from 'react';
import { ClockTheme, FontStyle } from '../../types/clock';
import { PRESET_THEMES } from '../../utils/storage';
import { Palette, Check, X, Sparkles } from 'lucide-react';

interface ThemeModalProps {
  currentTheme: ClockTheme;
  onSelectTheme: (theme: ClockTheme) => void;
  onUpdateCustomTheme: (updates: Partial<ClockTheme>) => void;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  currentTheme,
  onSelectTheme,
  onUpdateCustomTheme,
  onClose,
}) => {
  const fontOptions: { id: FontStyle; name: string }[] = [
    { id: 'orbitron', name: 'Orbitron' },
    { id: 'digital', name: 'Digital Matrix' },
    { id: 'chakra', name: 'Chakra Petch' },
    { id: 'syne', name: 'Syne Display' },
    { id: 'rajdhani', name: 'Rajdhani' },
    { id: 'jetbrains', name: 'JetBrains Mono' },
    { id: 'vt323', name: 'VT323 Pixel' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-white/15 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              Theme Customization
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select designer color presets or customize colors and typography.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Preset Themes Grid */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Preset Themes
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_THEMES.map((theme) => {
                const isSelected = currentTheme.id === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme)}
                    className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950/40 ring-2 ring-purple-400/50 shadow-lg'
                        : 'border-white/10 bg-black/40 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white truncate">
                        {theme.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <div
                        className="w-5 h-5 rounded-md border border-white/20"
                        style={{ backgroundColor: theme.textColor }}
                      />
                      <div
                        className="w-5 h-5 rounded-md border border-white/20"
                        style={{ backgroundColor: theme.bgColor }}
                      />
                      <div
                        className="w-5 h-5 rounded-md border border-white/20"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Tuning Section */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Fine-Tune Colors
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Text Color */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2 p-3 rounded-xl bg-neutral-900 border border-white/5">
                <span className="text-xs text-slate-300 font-medium">Text Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.textColor}
                    onChange={(e) => onUpdateCustomTheme({ textColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-400">{currentTheme.textColor}</span>
                </div>
              </div>

              {/* Background Color */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2 p-3 rounded-xl bg-neutral-900 border border-white/5">
                <span className="text-xs text-slate-300 font-medium">Background Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.bgColor}
                    onChange={(e) => onUpdateCustomTheme({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-400">{currentTheme.bgColor}</span>
                </div>
              </div>

              {/* Accent Color */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2 p-3 rounded-xl bg-neutral-900 border border-white/5">
                <span className="text-xs text-slate-300 font-medium">Accent Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.accentColor}
                    onChange={(e) =>
                      onUpdateCustomTheme({
                        accentColor: e.target.value,
                        glowColor: `${e.target.value}bf`,
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-400">{currentTheme.accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Font Typography Style */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Typography Font Style
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {fontOptions.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdateCustomTheme({ fontStyle: font.id })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    currentTheme.fontStyle === font.id
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-black/40 hover:bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
