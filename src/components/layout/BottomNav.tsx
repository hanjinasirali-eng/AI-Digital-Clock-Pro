import React from 'react';
import { NavTab } from './TopHeader';
import {
  Clock,
  Sliders,
  Bell,
  Timer,
  Globe,
  Hourglass,
  Sparkles,
  Settings,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadAlarmsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadAlarmsCount = 0,
}) => {
  const tabs = [
    { id: 'clock' as NavTab, label: 'Home', icon: Clock },
    { id: 'styles' as NavTab, label: 'Styles', icon: Sliders },
    { id: 'alarms' as NavTab, label: 'Alarms', icon: Bell, badge: unreadAlarmsCount },
    { id: 'stopwatch' as NavTab, label: 'Stopwatch', icon: Timer },
    { id: 'timer' as NavTab, label: 'Timer', icon: Hourglass },
    { id: 'world' as NavTab, label: 'World', icon: Globe },
    { id: 'ai' as NavTab, label: 'AI', icon: Sparkles },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/85 backdrop-blur-2xl border-t border-white/10 select-none pb-safe">
      <div className="grid grid-cols-8 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative transition-all ${
                isActive ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-medium tracking-tight mt-1 truncate max-w-full ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
