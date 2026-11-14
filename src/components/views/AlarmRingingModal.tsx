import React, { useEffect } from 'react';
import { AlarmItem } from '../../types/clock';
import { soundEngine } from '../../utils/audio';
import { Bell, Volume2 } from 'lucide-react';

interface AlarmRingingModalProps {
  alarm: AlarmItem;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

export const AlarmRingingModal: React.FC<AlarmRingingModalProps> = ({
  alarm,
  onDismiss,
  onSnooze,
}) => {
  useEffect(() => {
    soundEngine.startAlarm(alarm.sound, alarm.customAudioUrl);
    return () => {
      soundEngine.stopAlarm();
    };
  }, [alarm]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900 border border-red-500/40 text-center shadow-2xl shadow-red-500/20 flex flex-col items-center">
        {/* Ringing Bell Icon Animation */}
        <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-6 animate-bounce">
          <Bell className="w-10 h-10 text-red-500 animate-pulse" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
          Alarm Alert
        </span>

        <h2 className="text-5xl font-extrabold text-white font-jetbrains tracking-tight tabular-nums">
          {alarm.time}
        </h2>

        <p className="text-xl font-medium text-slate-200 mt-2">
          {alarm.label || 'Wake Up!'}
        </p>

        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-red-400" />
          Ringing tone: {alarm.sound.toUpperCase()}
        </p>

        {/* Action Buttons: Snooze & Dismiss */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-8">
          <button
            onClick={() => onSnooze(alarm.snoozeMinutes || 9)}
            className="w-full py-3.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm transition-all border border-neutral-700 active:scale-[0.98]"
          >
            Snooze ({alarm.snoozeMinutes || 9} min)
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 active:scale-[0.98]"
          >
            Stop Alarm
          </button>
        </div>
      </div>
    </div>
  );
};
