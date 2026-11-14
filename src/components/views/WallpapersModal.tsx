import React, { useState } from 'react';
import { WallpaperItem } from '../../types/clock';
import { PRESET_WALLPAPERS } from '../../utils/storage';
import { Image as ImageIcon, Upload, Check, X, Sparkles, Sliders } from 'lucide-react';

interface WallpapersModalProps {
  currentWallpaper?: WallpaperItem;
  customWallpapers: WallpaperItem[];
  onSelectWallpaper: (wallpaper: WallpaperItem) => void;
  onAddCustomWallpaper: (wallpaper: WallpaperItem) => void;
  blurPx: number;
  dimPercent: number;
  onUpdateBlur: (blur: number) => void;
  onUpdateDim: (dim: number) => void;
  onClose: () => void;
}

export const WallpapersModal: React.FC<WallpapersModalProps> = ({
  currentWallpaper,
  customWallpapers,
  onSelectWallpaper,
  onAddCustomWallpaper,
  blurPx,
  dimPercent,
  onUpdateBlur,
  onUpdateDim,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const allWallpapers = [...PRESET_WALLPAPERS, ...customWallpapers];

  const filtered =
    activeCategory === 'all'
      ? allWallpapers
      : allWallpapers.filter((w) => w.category === activeCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newItem: WallpaperItem = {
          id: `custom-wp-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 16),
          category: 'abstract',
          url: base64,
          isUploaded: true,
        };
        onAddCustomWallpaper(newItem);
        onSelectWallpaper(newItem);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'nature', label: 'Nature' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'space', label: 'Space' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'amoled', label: 'AMOLED' },
    { id: 'animated', label: 'Animated' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-6 rounded-3xl bg-neutral-900 border border-white/15 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              Wallpaper Gallery
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select high-resolution backgrounds or animated atmospheric canvases.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-black/40 hover:bg-white/10 text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Upload Custom Wallpaper Button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-400 cursor-pointer whitespace-nowrap ml-auto">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Wallpaper Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isSelected = currentWallpaper?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectWallpaper(item)}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Thumbnail */}
                <div
                  className="h-28 w-full bg-cover bg-center relative flex items-center justify-center"
                  style={{
                    backgroundColor: item.previewColor || '#0a0a0a',
                    backgroundImage: item.url && !item.isAnimated ? `url(${item.url})` : 'none',
                  }}
                >
                  {item.isAnimated && (
                    <span className="flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                      Canvas Anim
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="p-2.5 bg-black/70 flex items-center justify-between">
                  <span className="text-xs font-medium text-white truncate">{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Blur & Dim Sliders */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full sm:w-auto">
            {/* Blur slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Blur:</span>
              <input
                type="range"
                min="0"
                max="20"
                value={blurPx}
                onChange={(e) => onUpdateBlur(Number(e.target.value))}
                className="w-24 accent-emerald-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300">{blurPx}px</span>
            </div>

            {/* Dim slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Dim:</span>
              <input
                type="range"
                min="0"
                max="80"
                value={dimPercent}
                onChange={(e) => onUpdateDim(Number(e.target.value))}
                className="w-24 accent-emerald-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300">{dimPercent}%</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold transition-all w-full sm:w-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
