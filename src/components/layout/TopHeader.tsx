import React from 'react';
import {
  Clock,
  Sparkles,
  BedDouble,
  Maximize2,
  Minimize2,
  Bell,
  Timer,
  Globe,
  Settings,
  Sliders,
} from 'lucide-react';

export type NavTab =
  | 'clock'
  | 'styles'
  | 'alarms'
  | 'stopwatch'
  | 'timer'
  | 'world'
  | 'ai'
  | 'settings';

interface TopHeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onLaunchNightStand: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onSelectTab,
  onLaunchNightStand,
  onToggleFullscreen,
  isFullscreen,
}) => {
  return (
    <>
      {/* Mobile / Tablet Compact Top Bar (Beginning of App) */}
      <header className="lg:hidden flex items-center justify-between gap-4 px-4 py-2.5 border-b border-white/10 bg-black/50 backdrop-blur-xl shrink-0 z-40 select-none">
        <button
          onClick={() => onSelectTab('clock')}
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-cyan-500/20">
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-orbitron tracking-wider text-xs">
            AI CLOCK <span className="text-cyan-400">PRO</span>
          </span>
        </button>

        <span className="text-xs font-medium tracking-wide text-slate-300 whitespace-nowrap truncate">
          Zulmanan Hassan
        </span>
      </header>

      {/* Desktop Top Bar (Beginning of App) */}
      <header className="hidden lg:flex items-center justify-between gap-8 px-6 py-3.5 border-b border-white/10 bg-black/40 backdrop-blur-xl shrink-0 z-40 select-none">
        {/* Zone 1: Brand Wordmark + Creator Name */}
        <button
          onClick={() => onSelectTab('clock')}
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="font-orbitron tracking-wider text-sm">
            AI CLOCK <span className="text-cyan-400">PRO</span>
            <span className="font-sans font-medium text-xs text-slate-400 ml-2">· Zulmanan Hassan</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (concise single-line text links) */}
        <nav className="flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onSelectTab('clock')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'clock'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            Live Clock
          </button>
          <button
            onClick={() => onSelectTab('styles')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'styles'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            Styles
          </button>
          <button
            onClick={() => onSelectTab('alarms')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'alarms'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            Alarms
          </button>
          <button
            onClick={() => onSelectTab('stopwatch')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'stopwatch'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => onSelectTab('timer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'timer'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => onSelectTab('world')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'world'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            World Clock
          </button>
          <button
            onClick={() => onSelectTab('ai')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'ai'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI Assistant
          </button>
          <button
            onClick={() => onSelectTab('settings')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'settings'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onLaunchNightStand}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-red-950/50"
          >
            <BedDouble className="w-3.5 h-3.5 text-red-400" />
            Night Stand
          </button>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>
    </>
  );
};
