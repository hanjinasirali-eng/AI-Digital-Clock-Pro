export type ClockStyle =
  | 'digital-led'
  | 'flip'
  | 'minimal'
  | 'neon'
  | 'retro'
  | 'nightstand'
  | 'gradient'
  | 'amoled'
  | 'big-number'
  | 'analog';

export type FontStyle =
  | 'orbitron'
  | 'digital'
  | 'vt323'
  | 'chakra'
  | 'syne'
  | 'rajdhani'
  | 'jetbrains';

export interface ClockTheme {
  id: string;
  name: string;
  textColor: string;
  bgColor: string;
  accentColor: string;
  glowColor: string;
  fontStyle: FontStyle;
  wallpaperUrl?: string;
  backgroundType?: 'solid' | 'gradient' | 'image' | 'animated-stars' | 'animated-aurora' | 'matrix';
  isCustom?: boolean;
}

export interface ClockSettings {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  showDate: boolean;
  showDayOfWeek: boolean;
  showAmPm: boolean;
  blinkColons: boolean;
  tickSound: boolean;
  soundVolume: number; // 0 to 1
  brightness: number; // 10 to 100
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ar' | 'ur' | 'zh';
  dateFormat: 'full' | 'short' | 'numeric' | 'iso';
  defaultStyle: ClockStyle;
  clockPosition: 'center' | 'top' | 'bottom' | 'split';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  glowIntensity: 'off' | 'subtle' | 'high';
  wallpaperBlur: number; // 0 to 20px
  wallpaperDim: number; // 0 to 80%
  orientation: 'auto' | 'landscape' | 'portrait';
  standbyRedMode: boolean;
}

export interface AlarmItem {
  id: string;
  time: string; // "HH:mm" in 24h internal format
  label: string;
  enabled: boolean;
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat. Empty array means once.
  sound: 'beep' | 'chime' | 'echo' | 'siren' | 'custom';
  customAudioUrl?: string;
  snoozeMinutes: number;
  lastTriggeredDate?: string;
}

export interface StopwatchLap {
  lapNumber: number;
  timeMs: number;
  splitMs: number;
}

export interface WorldClockCity {
  id: string;
  city: string;
  country: string;
  timezone: string;
  flag: string;
}

export interface WallpaperItem {
  id: string;
  name: string;
  category: 'nature' | 'ocean' | 'space' | 'abstract' | 'amoled' | 'animated';
  url: string;
  previewColor?: string;
  isAnimated?: boolean;
  animationType?: 'stars' | 'aurora' | 'matrix' | 'gradient';
  isUploaded?: boolean;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | 'moon';
  high: number;
  low: number;
}
