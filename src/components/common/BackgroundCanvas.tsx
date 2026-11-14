import React, { useEffect, useRef } from 'react';
import { WallpaperItem } from '../../types/clock';

interface BackgroundCanvasProps {
  wallpaper?: WallpaperItem;
  bgColor?: string;
  dimPercent: number;
  blurPx: number;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  wallpaper,
  bgColor = '#030508',
  dimPercent,
  blurPx,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!wallpaper?.isAnimated) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    if (wallpaper.animationType === 'stars') {
      const stars = Array.from({ length: 140 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
      }));

      const render = () => {
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);

        for (const star of stars) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#60a5fa';
          ctx.fill();

          star.y -= star.speed;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }
        }
        animId = requestAnimationFrame(render);
      };
      render();
    } else if (wallpaper.animationType === 'matrix') {
      const fontSize = 16;
      const columns = Math.floor(width / fontSize);
      const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));
      const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';

      const render = () => {
        ctx.fillStyle = 'rgba(2, 13, 6, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#22c55e';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Head character brighter
          ctx.fillStyle = drops[i] % 3 === 0 ? '#86efac' : '#22c55e';
          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        animId = requestAnimationFrame(render);
      };
      render();
    } else if (wallpaper.animationType === 'aurora') {
      let step = 0;
      const render = () => {
        step += 0.01;
        ctx.fillStyle = '#020d1a';
        ctx.fillRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, height * 0.2, width, height * 0.8);
        const g1 = Math.sin(step) * 0.5 + 0.5;
        const g2 = Math.cos(step * 0.7) * 0.5 + 0.5;
        gradient.addColorStop(0, `rgba(5, 150, 105, ${0.15 + g1 * 0.1})`);
        gradient.addColorStop(0.5, `rgba(6, 182, 212, ${0.12 + g2 * 0.1})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, 0.05)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.4);
        for (let x = 0; x <= width; x += 30) {
          const y = height * 0.4 + Math.sin(x * 0.004 + step) * 60 + Math.cos(x * 0.008 - step * 0.5) * 40;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        animId = requestAnimationFrame(render);
      };
      render();
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [wallpaper?.isAnimated, wallpaper?.animationType]);

  const hasImage = wallpaper?.url && !wallpaper.isAnimated;

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Image Layer */}
      {hasImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${wallpaper.url})`,
            filter: `blur(${blurPx}px)`,
            transform: blurPx > 0 ? 'scale(1.05)' : 'none',
          }}
        />
      )}

      {/* Animated Canvas Layer */}
      {wallpaper?.isAnimated && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ filter: `blur(${blurPx}px)` }}
        />
      )}

      {/* Dim / Scrim Layer for legibility */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: '#000000',
          opacity: dimPercent / 100,
        }}
      />
    </div>
  );
};
