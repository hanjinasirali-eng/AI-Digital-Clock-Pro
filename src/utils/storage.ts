import { ClockSettings, ClockTheme, AlarmItem, WorldClockCity, WallpaperItem } from '../types/clock';
import wallpaperNature from '../assets/images/wallpaper_nature_mountains_1794471200510.jpg';
import wallpaperOcean from '../assets/images/wallpaper_ocean_waves_1794471201550.jpg';
import wallpaperSpace from '../assets/images/wallpaper_space_nebula_1794471200960.jpg';
import wallpaperAbstract from '../assets/images/wallpaper_abstract_dark_1794471201677.jpg';

export const PRESET_THEMES: ClockTheme[] = [
  {
    id: 'red-neon',
    name: 'Red Neon',
    textColor: '#ef4444',
    bgColor: '#030508',
    accentColor: '#dc2626',
    glowColor: 'rgba(239, 68, 68, 0.75)',
    fontStyle: 'orbitron',
    backgroundType: 'solid',
  },
  {
    id: 'purple-glow',
    name: 'Purple Glow',
    textColor: '#c084fc',
    bgColor: '#07040d',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.75)',
    fontStyle: 'syne',
    backgroundType: 'solid',
  },
  {
    id: 'blue-ocean',
    name: 'Blue Ocean',
    textColor: '#38bdf8',
    bgColor: '#030816',
    accentColor: '#0284c7',
    glowColor: 'rgba(56, 189, 248, 0.75)',
    fontStyle: 'rajdhani',
    backgroundType: 'solid',
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    textColor: '#fb923c',
    bgColor: '#0c0507',
    accentColor: '#f43f5e',
    glowColor: 'rgba(251, 146, 60, 0.75)',
    fontStyle: 'chakra',
    backgroundType: 'gradient',
  },
  {
    id: 'amoled-black',
    name: 'AMOLED Black',
    textColor: '#ffffff',
    bgColor: '#000000',
    accentColor: '#38bdf8',
    glowColor: 'rgba(255, 255, 255, 0.25)',
    fontStyle: 'jetbrains',
    backgroundType: 'solid',
  },
  {
    id: 'white-minimal',
    name: 'White Minimal',
    textColor: '#f8fafc',
    bgColor: '#090d16',
    accentColor: '#94a3b8',
    glowColor: 'rgba(248, 250, 252, 0.3)',
    fontStyle: 'digital',
    backgroundType: 'solid',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    textColor: '#22c55e',
    bgColor: '#020d06',
    accentColor: '#eab308',
    glowColor: 'rgba(34, 197, 94, 0.8)',
    fontStyle: 'vt323',
    backgroundType: 'solid',
  },
  {
    id: 'colorful-gradient',
    name: 'Colorful Gradient',
    textColor: '#ec4899',
    bgColor: '#070512',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(236, 72, 153, 0.75)',
    fontStyle: 'syne',
    backgroundType: 'gradient',
  },
];

export const PRESET_WALLPAPERS: WallpaperItem[] = [
  {
    id: 'none',
    name: 'Pure AMOLED Black',
    category: 'amoled',
    url: '',
    previewColor: '#000000',
  },
  {
    id: 'nature-mountains',
    name: 'Alpine Aurora & Lake',
    category: 'nature',
    url: wallpaperNature,
    previewColor: '#134e4a',
  },
  {
    id: 'ocean-waves',
    name: 'Bioluminescent Waves',
    category: 'ocean',
    url: wallpaperOcean,
    previewColor: '#0369a1',
  },
  {
    id: 'space-nebula',
    name: 'Cosmic Violet Nebula',
    category: 'space',
    url: wallpaperSpace,
    previewColor: '#581c87',
  },
  {
    id: 'abstract-dark',
    name: 'Obsidian Liquid Silk',
    category: 'abstract',
    url: wallpaperAbstract,
    previewColor: '#1c1917',
  },
  {
    id: 'anim-stars',
    name: 'Animated Deep Starfield',
    category: 'animated',
    url: 'animated:stars',
    isAnimated: true,
    animationType: 'stars',
    previewColor: '#0f172a',
  },
  {
    id: 'anim-matrix',
    name: 'Animated Cyber Rain',
    category: 'animated',
    url: 'animated:matrix',
    isAnimated: true,
    animationType: 'matrix',
    previewColor: '#052e16',
  },
  {
    id: 'anim-aurora',
    name: 'Animated Northern Lights',
    category: 'animated',
    url: 'animated:aurora',
    isAnimated: true,
    animationType: 'aurora',
    previewColor: '#042f2e',
  },
];

export const DEFAULT_SETTINGS: ClockSettings = {
  timeFormat: '12h',
  showSeconds: true,
  showDate: true,
  showDayOfWeek: true,
  showAmPm: true,
  blinkColons: true,
  tickSound: false,
  soundVolume: 0.8,
  brightness: 100,
  language: 'en',
  dateFormat: 'full',
  defaultStyle: 'neon',
  clockPosition: 'center',
  fontSize: 'lg',
  glowIntensity: 'high',
  wallpaperBlur: 0,
  wallpaperDim: 25,
  orientation: 'auto',
  standbyRedMode: false,
};

export const INITIAL_ALARMS: AlarmItem[] = [
  {
    id: 'alarm-1',
    time: '07:00',
    label: 'Morning Wakeup',
    enabled: true,
    days: [1, 2, 3, 4, 5], // Mon-Fri
    sound: 'chime',
    snoozeMinutes: 9,
  },
  {
    id: 'alarm-2',
    time: '08:30',
    label: 'Gym & Fitness',
    enabled: false,
    days: [1, 3, 5],
    sound: 'beep',
    snoozeMinutes: 5,
  },
  {
    id: 'alarm-3',
    time: '23:00',
    label: 'Sleep Wind-Down',
    enabled: true,
    days: [], // Every day / once
    sound: 'echo',
    snoozeMinutes: 10,
  },
];

export const DEFAULT_WORLD_CITIES: WorldClockCity[] = [
  {
    id: 'pk-khi',
    city: 'Karachi',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    flag: '🇵🇰',
  },
  {
    id: 'in-del',
    city: 'New Delhi',
    country: 'India',
    timezone: 'Asia/Kolkata',
    flag: '🇮🇳',
  },
  {
    id: 'us-nyc',
    city: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    flag: '🇺🇸',
  },
  {
    id: 'gb-lon',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    flag: '🇬🇧',
  },
  {
    id: 'sa-ruh',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    timezone: 'Asia/Riyadh',
    flag: '🇸🇦',
  },
  {
    id: 'ae-dxb',
    city: 'Dubai',
    country: 'UAE',
    timezone: 'Asia/Dubai',
    flag: '🇦🇪',
  },
  {
    id: 'jp-tyo',
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    flag: '🇯🇵',
  },
  {
    id: 'cn-bjs',
    city: 'Beijing',
    country: 'China',
    timezone: 'Asia/Shanghai',
    flag: '🇨🇳',
  },
];

export const ALL_AVAILABLE_CITIES: WorldClockCity[] = [
  ...DEFAULT_WORLD_CITIES,
  { id: 'us-lax', city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'us-chi', city: 'Chicago', country: 'United States', timezone: 'America/Chicago', flag: '🇺🇸' },
  { id: 'fr-par', city: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'de-ber', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { id: 'au-syd', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'sg-sin', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'tr-ist', city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
  { id: 'br-sao', city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'eg-cai', city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬' },
  { id: 'kr-sel', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'ca-tor', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦' },
  { id: 'nl-ams', city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  { id: 'ch-zrh', city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭' },
  { id: 'qa-doh', city: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar', flag: '🇶🇦' },
];

// Helper functions with localStorage
export function loadSettings(): ClockSettings {
  try {
    const raw = localStorage.getItem('ai_clock_settings');
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: ClockSettings) {
  try {
    localStorage.setItem('ai_clock_settings', JSON.stringify(settings));
  } catch {}
}

export function loadCurrentTheme(): ClockTheme {
  try {
    const raw = localStorage.getItem('ai_clock_current_theme');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.textColor) {
        return { ...PRESET_THEMES[0], ...parsed };
      }
    }
  } catch {}
  return PRESET_THEMES[0]; // Red Neon default
}

export function saveCurrentTheme(theme: ClockTheme) {
  try {
    localStorage.setItem('ai_clock_current_theme', JSON.stringify(theme));
  } catch {}
}

export function loadAlarms(): AlarmItem[] {
  try {
    const raw = localStorage.getItem('ai_clock_alarms');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return INITIAL_ALARMS;
}

export function saveAlarms(alarms: AlarmItem[]) {
  try {
    localStorage.setItem('ai_clock_alarms', JSON.stringify(alarms));
  } catch {}
}

export function loadWorldCities(): WorldClockCity[] {
  try {
    const raw = localStorage.getItem('ai_clock_world_cities');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return DEFAULT_WORLD_CITIES;
}

export function saveWorldCities(cities: WorldClockCity[]) {
  try {
    localStorage.setItem('ai_clock_world_cities', JSON.stringify(cities));
  } catch {}
}

export function loadCustomWallpapers(): WallpaperItem[] {
  try {
    const raw = localStorage.getItem('ai_clock_custom_wallpapers');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveCustomWallpapers(wallpapers: WallpaperItem[]) {
  try {
    localStorage.setItem('ai_clock_custom_wallpapers', JSON.stringify(wallpapers));
  } catch {}
}
