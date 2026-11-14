import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Hourglass, Plus, Bell } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';

const PRESET_TIMERS = [
  { label: '1 Min', totalSeconds: 60 },
  { label: '5 Min', totalSeconds: 300 },
  { label: '10 Min', totalSeconds: 600 },
  { label: '15 Min', totalSeconds: 900 },
  { label: '25 Min Pomodoro', totalSeconds: 1500 },
  { label: '45 Min Focus', totalSeconds: 2700 },
  { label: '1 Hour', totalSeconds: 3600 },
];

export const TimerView: React.FC = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timerLabel, setTimerLabel] = useState('Focus Timer');

  const [initialTotalSeconds, setInitialTotalSeconds] = useState(300);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      timerRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            soundEngine.playTimerDone();
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, remainingSeconds]);

  const handleStart = () => {
    if (remainingSeconds === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total <= 0) return;
      setInitialTotalSeconds(total);
      setRemainingSeconds(total);
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingSeconds(initialTotalSeconds);
  };

  const handleSetPreset = (totalSecs: number, labelName: string) => {
    setIsRunning(false);
    setIsCompleted(false);
    setInitialTotalSeconds(totalSecs);
    setRemainingSeconds(totalSecs);
    setHours(Math.floor(totalSecs / 3600));
    setMinutes(Math.floor((totalSecs % 3600) / 60));
    setSeconds(totalSecs % 60);
    setTimerLabel(labelName);
  };

  // Convert remaining seconds to display
  const remH = Math.floor(remainingSeconds / 3600);
  const remM = Math.floor((remainingSeconds % 3600) / 60);
  const remS = remainingSeconds % 60;

  // Percentage complete
  const progressRatio =
    initialTotalSeconds > 0 ? (initialTotalSeconds - remainingSeconds) / initialTotalSeconds : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 flex flex-col items-center">
      {/* Header */}
      <div className="w-full mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Hourglass className="w-6 h-6 text-purple-400" />
          Countdown Timer
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Preset intervals, Pomodoro focus sessions, and audible alert fanfare.
        </p>
      </div>

      {/* Preset Buttons Carousel */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {PRESET_TIMERS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handleSetPreset(preset.totalSeconds, preset.label)}
            className="px-3.5 py-2 rounded-2xl bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Circular Progress Display */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center my-4">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="44%"
            className="stroke-neutral-800"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="44%"
            className={`transition-all duration-500 ${
              isCompleted ? 'stroke-purple-400 animate-pulse' : 'stroke-purple-500'
            }`}
            strokeWidth="6"
            strokeDasharray="553"
            strokeDashoffset={553 - (1 - progressRatio) * 553}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Digits & Status */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-purple-400 font-mono mb-2">
            {timerLabel}
          </span>

          <div className="flex items-baseline font-jetbrains text-white font-extrabold tabular-nums tracking-tight text-5xl sm:text-6xl">
            {remH > 0 && (
              <>
                <span>{remH.toString().padStart(2, '0')}</span>
                <span className="text-purple-400 mx-1 text-3xl">:</span>
              </>
            )}
            <span>{remM.toString().padStart(2, '0')}</span>
            <span className="text-purple-400 mx-1 text-3xl">:</span>
            <span>{remS.toString().padStart(2, '0')}</span>
          </div>

          <span className="text-xs uppercase tracking-widest text-slate-500 font-mono mt-3">
            {isCompleted ? 'COMPLETED!' : isRunning ? 'COUNTING DOWN' : 'READY'}
          </span>
        </div>
      </div>

      {/* Time Picker Inputs when not running */}
      {!isRunning && remainingSeconds === initialTotalSeconds && (
        <div className="flex items-center gap-3 p-4 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-md mb-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 mb-1">Hours</span>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                setHours(val);
                const total = val * 3600 + minutes * 60 + seconds;
                setInitialTotalSeconds(total);
                setRemainingSeconds(total);
              }}
              className="w-14 text-center font-jetbrains text-xl font-bold bg-black/60 rounded-xl py-1.5 border border-white/10 text-white"
            />
          </div>

          <span className="text-xl text-white/50 mt-4">:</span>

          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 mb-1">Minutes</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                setMinutes(val);
                const total = hours * 3600 + val * 60 + seconds;
                setInitialTotalSeconds(total);
                setRemainingSeconds(total);
              }}
              className="w-14 text-center font-jetbrains text-xl font-bold bg-black/60 rounded-xl py-1.5 border border-white/10 text-white"
            />
          </div>

          <span className="text-xl text-white/50 mt-4">:</span>

          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 mb-1">Seconds</span>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                setSeconds(val);
                const total = hours * 3600 + minutes * 60 + val;
                setInitialTotalSeconds(total);
                setRemainingSeconds(total);
              }}
              className="w-14 text-center font-jetbrains text-xl font-bold bg-black/60 rounded-xl py-1.5 border border-white/10 text-white"
            />
          </div>
        </div>
      )}

      {/* Primary Actions */}
      <div className="flex items-center gap-4 my-4">
        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={remainingSeconds === initialTotalSeconds}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-slate-300 font-semibold text-xs uppercase tracking-wider flex flex-col items-center justify-center border border-white/10 active:scale-95 transition-all shadow-lg"
        >
          <RotateCcw className="w-5 h-5 mb-1" />
          Reset
        </button>

        {/* Start / Pause Button */}
        {isRunning ? (
          <button
            onClick={handlePause}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-2 border-purple-500 flex flex-col items-center justify-center active:scale-95 transition-all shadow-xl shadow-purple-500/20"
          >
            <Pause className="w-8 h-8 fill-purple-300" />
            <span className="text-[10px] font-bold tracking-widest mt-0.5">PAUSE</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={remainingSeconds <= 0}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex flex-col items-center justify-center active:scale-95 transition-all shadow-xl shadow-purple-600/30"
          >
            <Play className="w-8 h-8 fill-white ml-1" />
            <span className="text-[10px] font-bold tracking-widest mt-0.5">START</span>
          </button>
        )}
      </div>
    </div>
  );
};
