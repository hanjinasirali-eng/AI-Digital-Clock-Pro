import React, { useState, useEffect, useRef } from 'react';
import { StopwatchLap } from '../../types/clock';
import { Play, Pause, RotateCcw, Flag, Timer } from 'lucide-react';

export const StopwatchView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<StopwatchLap[]>([]);

  const startTimestampRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimestampRef.current = performance.now();

      const update = () => {
        const now = performance.now();
        const delta = now - startTimestampRef.current;
        setElapsedMs(accumulatedMsRef.current + delta);
        animFrameRef.current = requestAnimationFrame(update);
      };

      animFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    accumulatedMsRef.current = elapsedMs;
  };

  const handleReset = () => {
    setIsRunning(false);
    accumulatedMsRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning && elapsedMs === 0) return;
    const lastLapTime = laps.length > 0 ? laps[0].timeMs : 0;
    const splitMs = elapsedMs - lastLapTime;

    const newLap: StopwatchLap = {
      lapNumber: laps.length + 1,
      timeMs: elapsedMs,
      splitMs: splitMs,
    };

    setLaps([newLap, ...laps]);
  };

  // Format Helper
  const formatTime = (msTotal: number) => {
    const mins = Math.floor(msTotal / 60000);
    const secs = Math.floor((msTotal % 60000) / 1000);
    const ms = Math.floor((msTotal % 1000) / 10);
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0'),
    };
  };

  const currentFormatted = formatTime(elapsedMs);

  // Identify fastest and slowest laps
  let fastestSplit = Infinity;
  let slowestSplit = -Infinity;
  if (laps.length > 1) {
    laps.forEach((l) => {
      if (l.splitMs < fastestSplit) fastestSplit = l.splitMs;
      if (l.splitMs > slowestSplit) slowestSplit = l.splitMs;
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 flex flex-col items-center">
      {/* Header */}
      <div className="w-full mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Timer className="w-6 h-6 text-emerald-400" />
          Stopwatch
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Precision split & lap timer with millisecond accuracy.
        </p>
      </div>

      {/* Main Stopwatch Face with Circular Dial Ring */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center my-4">
        {/* Circular Progress Ring */}
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
            className="stroke-emerald-400 transition-all duration-75"
            strokeWidth="6"
            strokeDasharray="553"
            strokeDashoffset={553 - ((elapsedMs % 60000) / 60000) * 553}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Stopwatch Digits */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline font-jetbrains text-white font-extrabold tabular-nums tracking-tight">
            <span className="text-4xl sm:text-5xl">{currentFormatted.minutes}</span>
            <span className="text-2xl text-emerald-400 mx-1">:</span>
            <span className="text-4xl sm:text-5xl">{currentFormatted.seconds}</span>
            <span className="text-2xl text-emerald-400 font-semibold ml-1.5">
              .{currentFormatted.milliseconds}
            </span>
          </div>

          <span className="text-xs uppercase tracking-widest text-slate-500 font-mono mt-2">
            {isRunning ? 'RUNNING' : elapsedMs > 0 ? 'PAUSED' : 'READY'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 my-6">
        {/* Reset / Lap Button */}
        {isRunning ? (
          <button
            onClick={handleLap}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs uppercase tracking-wider flex flex-col items-center justify-center border border-white/10 active:scale-95 transition-all shadow-lg"
          >
            <Flag className="w-5 h-5 mb-1 text-emerald-400" />
            Lap
          </button>
        ) : (
          <button
            onClick={handleReset}
            disabled={elapsedMs === 0}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-slate-300 font-semibold text-xs uppercase tracking-wider flex flex-col items-center justify-center border border-white/10 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5 mb-1" />
            Reset
          </button>
        )}

        {/* Start / Pause Primary Button */}
        {isRunning ? (
          <button
            onClick={handlePause}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-2 border-amber-500 flex flex-col items-center justify-center active:scale-95 transition-all shadow-xl shadow-amber-500/20"
          >
            <Pause className="w-8 h-8 fill-amber-300" />
            <span className="text-[10px] font-bold tracking-widest mt-0.5">PAUSE</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-2 border-emerald-500 flex flex-col items-center justify-center active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            <Play className="w-8 h-8 fill-emerald-400 ml-1" />
            <span className="text-[10px] font-bold tracking-widest mt-0.5">START</span>
          </button>
        )}
      </div>

      {/* Lap Times Table */}
      {laps.length > 0 && (
        <div className="w-full max-w-md mt-4 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400">
            <span>Lap</span>
            <span>Split</span>
            <span>Total Time</span>
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-white/5">
            {laps.map((lap) => {
              const splitFmt = formatTime(lap.splitMs);
              const totalFmt = formatTime(lap.timeMs);

              const isFastest = laps.length > 1 && lap.splitMs === fastestSplit;
              const isSlowest = laps.length > 1 && lap.splitMs === slowestSplit;

              return (
                <div
                  key={lap.lapNumber}
                  className={`flex items-center justify-between px-6 py-3 text-xs sm:text-sm font-mono tabular-nums ${
                    isFastest
                      ? 'text-emerald-400 font-semibold bg-emerald-500/5'
                      : isSlowest
                      ? 'text-rose-400 font-semibold bg-rose-500/5'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="font-sans font-medium text-slate-400">
                    Lap {lap.lapNumber.toString().padStart(2, '0')}
                    {isFastest && ' (Fastest)'}
                    {isSlowest && ' (Slowest)'}
                  </span>
                  <span>
                    +{splitFmt.minutes}:{splitFmt.seconds}.{splitFmt.milliseconds}
                  </span>
                  <span className="font-bold text-white">
                    {totalFmt.minutes}:{totalFmt.seconds}.{totalFmt.milliseconds}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
