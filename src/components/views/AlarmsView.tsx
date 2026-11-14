import React, { useState } from 'react';
import { AlarmItem } from '../../types/clock';
import {
  Bell,
  Plus,
  Trash2,
  Volume2,
  Play,
  Square,
  Clock,
  Info,
  Upload,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface AlarmsViewProps {
  alarms: AlarmItem[];
  onAddAlarm: (alarm: AlarmItem) => void;
  onUpdateAlarm: (id: string, updates: Partial<AlarmItem>) => void;
  onDeleteAlarm: (id: string) => void;
  onTestAlarmTrigger: (alarm: AlarmItem) => void;
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmsView: React.FC<AlarmsViewProps> = ({
  alarms,
  onAddAlarm,
  onUpdateAlarm,
  onDeleteAlarm,
  onTestAlarmTrigger,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [hours, setHours] = useState('07');
  const [minutes, setMinutes] = useState('00');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [label, setLabel] = useState('Morning Alarm');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [sound, setSound] = useState<AlarmItem['sound']>('chime');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | undefined>();
  const [snoozeMinutes, setSnoozeMinutes] = useState(9);
  const [testingSound, setTestingSound] = useState<string | null>(null);

  const handleTestSound = (soundType: AlarmItem['sound'], audioUrl?: string) => {
    if (testingSound === soundType) {
      soundEngine.stopAlarm();
      setTestingSound(null);
    } else {
      soundEngine.startAlarm(soundType, audioUrl, 0.7);
      setTestingSound(soundType);
      setTimeout(() => {
        soundEngine.stopAlarm();
        setTestingSound(null);
      }, 3500);
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCustomAudioUrl(base64);
        setSound('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAlarm = () => {
    let hourNum = parseInt(hours, 10);
    if (ampm === 'PM' && hourNum < 12) hourNum += 12;
    if (ampm === 'AM' && hourNum === 12) hourNum = 0;

    const timeStr = `${hourNum.toString().padStart(2, '0')}:${minutes}`;

    const newAlarm: AlarmItem = {
      id: `alarm-${Date.now()}`,
      time: timeStr,
      label: label.trim() || 'Alarm',
      enabled: true,
      days: selectedDays,
      sound,
      customAudioUrl,
      snoozeMinutes,
    };

    onAddAlarm(newAlarm);
    setShowAddModal(false);
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-500" />
            Alarm Clock
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your daily wakeup schedules with customizable tones and repeat cycles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Alarm</span>
        </button>
      </div>

      {/* Browser background limitations educational notice (Requirement #16) */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed mb-6">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-200">Browser Execution Notice: </span>
          Alarms play reliably while this tab is open or running in the background. Modern browsers restrict audio execution if the tab is completely closed or your device enters deep sleep. Keep this tab open or use Night Stand mode with Screen Wake Lock enabled.
        </div>
      </div>

      {/* List of Alarms */}
      <div className="flex flex-col gap-3">
        {alarms.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
            <Bell className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-300">No alarms configured</p>
            <p className="text-xs text-slate-500 mt-1">Tap 'Add Alarm' above to create one.</p>
          </div>
        ) : (
          alarms.map((alarm) => {
            // Format time for display (12-hour)
            const [h, m] = alarm.time.split(':').map(Number);
            const isPM = h >= 12;
            const displayHours = (h % 12 || 12).toString().padStart(2, '0');
            const ampmStr = isPM ? 'PM' : 'AM';

            const repeatText =
              alarm.days.length === 7
                ? 'Every day'
                : alarm.days.length === 5 && !alarm.days.includes(0) && !alarm.days.includes(6)
                ? 'Weekdays'
                : alarm.days.length === 2 && alarm.days.includes(0) && alarm.days.includes(6)
                ? 'Weekends'
                : alarm.days.length === 0
                ? 'Once'
                : alarm.days.map((d) => DAY_NAMES[d]).join(', ');

            return (
              <div
                key={alarm.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border transition-all backdrop-blur-xl ${
                  alarm.enabled
                    ? 'bg-neutral-900/80 border-white/15 shadow-xl'
                    : 'bg-black/40 border-white/5 opacity-60'
                }`}
              >
                {/* Time & Label */}
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline font-jetbrains">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                      {displayHours}:{m.toString().padStart(2, '0')}
                    </span>
                    <span className="ml-1.5 text-xs font-bold text-red-400 uppercase">
                      {ampmStr}
                    </span>
                  </div>

                  <div className="border-l border-white/10 pl-4">
                    <h4 className="text-sm font-semibold text-white">{alarm.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{repeatText}</p>
                  </div>
                </div>

                {/* Sound & Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Test preview sound button */}
                  <button
                    onClick={() => handleTestSound(alarm.sound, alarm.customAudioUrl)}
                    title="Test alarm sound"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    {testingSound === alarm.sound ? (
                      <Square className="w-4 h-4 text-red-400" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>

                  {/* Trigger test alert now */}
                  <button
                    onClick={() => onTestAlarmTrigger(alarm)}
                    title="Simulate alarm triggering now"
                    className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-medium text-red-300 transition-colors"
                  >
                    Test Ring
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteAlarm(alarm.id)}
                    title="Delete alarm"
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer ml-1">
                    <input
                      type="checkbox"
                      checked={alarm.enabled}
                      onChange={(e) => onUpdateAlarm(alarm.id, { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6.5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Alarm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-white/15 shadow-2xl flex flex-col gap-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Set New Alarm
            </h3>

            {/* Time Selectors (HH : MM AM/PM) */}
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-black/60 border border-white/10">
              <input
                type="number"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(e.target.value.padStart(2, '0').slice(-2))}
                className="w-16 text-center text-4xl font-extrabold font-jetbrains text-white bg-transparent border-b-2 border-red-500 focus:outline-none"
              />
              <span className="text-3xl font-extrabold text-white/50">:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value.padStart(2, '0').slice(-2))}
                className="w-16 text-center text-4xl font-extrabold font-jetbrains text-white bg-transparent border-b-2 border-red-500 focus:outline-none"
              />
              <div className="flex flex-col gap-1 ml-2">
                <button
                  type="button"
                  onClick={() => setAmpm('AM')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    ampm === 'AM' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-slate-400'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setAmpm('PM')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    ampm === 'PM' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-slate-400'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Alarm Label */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Alarm Name</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Work, Workout, Morning"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Repeat Days */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Repeat Days</label>
              <div className="grid grid-cols-7 gap-2">
                {DAY_LABELS.map((day, idx) => {
                  const isSelected = selectedDays.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`h-10 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-black/50 hover:bg-white/10 text-slate-400 border border-white/10'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sound Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Alarm Sound</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {(['chime', 'beep', 'echo', 'siren'] as const).map((snd) => (
                  <button
                    key={snd}
                    type="button"
                    onClick={() => {
                      setSound(snd);
                      handleTestSound(snd);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      sound === snd
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-black/50 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {snd}
                  </button>
                ))}
              </div>

              {/* Custom audio upload */}
              <div className="mt-2">
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 bg-black/30 hover:bg-white/5 cursor-pointer text-xs text-slate-300 transition-colors">
                  <Upload className="w-4 h-4 text-red-400" />
                  <span>
                    {customAudioUrl ? 'Custom Sound Uploaded' : 'Upload Custom MP3 / WAV'}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleCustomAudioUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAlarm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all"
              >
                Save Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
