import React, { useState } from 'react';
import { WorldClockCity } from '../../types/clock';
import { Globe, Plus, Trash2, Search, Sun, Moon, Clock } from 'lucide-react';
import { ALL_AVAILABLE_CITIES } from '../../utils/storage';

interface WorldClockViewProps {
  time: Date;
  cities: WorldClockCity[];
  onAddCity: (city: WorldClockCity) => void;
  onRemoveCity: (id: string) => void;
  timeFormat: '12h' | '24h';
}

export const WorldClockView: React.FC<WorldClockViewProps> = ({
  time,
  cities,
  onAddCity,
  onRemoveCity,
  timeFormat,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to get time in timezone
  const getTimeInZone = (timezone: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: timeFormat === '12h',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const parts = formatter.formatToParts(time);
      const hour = parts.find((p) => p.type === 'hour')?.value || '00';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const second = parts.find((p) => p.type === 'second')?.value || '00';
      const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || '';
      const weekday = parts.find((p) => p.type === 'weekday')?.value || '';
      const day = parts.find((p) => p.type === 'day')?.value || '';
      const month = parts.find((p) => p.type === 'month')?.value || '';

      // Determine day offset relative to local
      const localDay = time.getDate();
      const targetDay = parseInt(day, 10);
      let dayDiff = 'Today';
      if (targetDay > localDay || (localDay >= 28 && targetDay === 1)) {
        dayDiff = 'Tomorrow';
      } else if (targetDay < localDay || (targetDay >= 28 && localDay === 1)) {
        dayDiff = 'Yesterday';
      }

      // Check if day or night in target timezone
      const hour24Formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false,
      });
      const h24 = parseInt(hour24Formatter.format(time), 10);
      const isDaytime = h24 >= 6 && h24 < 18;

      return {
        timeStr: `${hour}:${minute}`,
        secondStr: second,
        period: dayPeriod,
        dateStr: `${weekday}, ${month} ${day}`,
        dayDiff,
        isDaytime,
        h24,
      };
    } catch {
      return {
        timeStr: '--:--',
        secondStr: '00',
        period: '',
        dateStr: '',
        dayDiff: 'Today',
        isDaytime: true,
        h24: 12,
      };
    }
  };

  const filteredAvailableCities = ALL_AVAILABLE_CITIES.filter(
    (c) =>
      !cities.some((existing) => existing.id === c.id) &&
      (c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-sky-400" />
            World Clock
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Global time synchronized with accurate daylight saving adjustments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add City</span>
        </button>
      </div>

      {/* World Clock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city) => {
          const info = getTimeInZone(city.timezone);

          return (
            <div
              key={city.id}
              className="relative flex flex-col justify-between p-5 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-xl hover:border-white/20 transition-all"
            >
              {/* Top Row: Flag, City, Day/Night */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{city.flag}</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{city.city}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{city.country}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      info.isDaytime
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {info.isDaytime ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                    {info.dayDiff}
                  </span>

                  <button
                    onClick={() => onRemoveCity(city.id)}
                    title="Remove city"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Center Digital Readout */}
              <div className="my-4 flex items-baseline justify-between">
                <div className="flex items-baseline font-jetbrains text-white">
                  <span className="text-4xl font-black tabular-nums tracking-tight">
                    {info.timeStr}
                  </span>
                  <span className="text-sm font-semibold text-sky-400 ml-1.5 tabular-nums">
                    :{info.secondStr}
                  </span>
                  {info.period && (
                    <span className="ml-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {info.period}
                    </span>
                  )}
                </div>

                {/* Mini Analog SVG Face */}
                <div className="w-12 h-12 rounded-full border border-white/20 bg-black/50 relative flex items-center justify-center shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    {/* Hour hand */}
                    <line
                      x1="20"
                      y1="20"
                      x2={20 + 8 * Math.sin((((info.h24 % 12) * 30 + 15) * Math.PI) / 180)}
                      y2={20 - 8 * Math.cos((((info.h24 % 12) * 30 + 15) * Math.PI) / 180)}
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Minute hand */}
                    <line
                      x1="20"
                      y1="20"
                      x2={20 + 13 * Math.sin(((parseInt(info.timeStr.split(':')[1], 10) * 6) * Math.PI) / 180)}
                      y2={20 - 13 * Math.cos(((parseInt(info.timeStr.split(':')[1], 10) * 6) * Math.PI) / 180)}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="20" cy="20" r="1.5" fill="#ffffff" />
                  </svg>
                </div>
              </div>

              {/* Bottom Date and Timezone */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>{info.dateStr}</span>
                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                  {city.timezone}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add City Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-white/15 shadow-2xl flex flex-col max-h-[85vh]">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-sky-400" />
              Add World City
            </h3>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Cities List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 max-h-72 pr-1">
              {filteredAvailableCities.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No matching cities found.
                </div>
              ) : (
                filteredAvailableCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onAddCity(city);
                      setShowAddModal(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{city.flag}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{city.city}</h4>
                        <p className="text-xs text-slate-400">{city.country}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-sky-400 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
