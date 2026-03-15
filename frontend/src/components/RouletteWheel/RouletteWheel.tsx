import { useRef, useEffect, useState } from 'react';
import './RouletteWheel.css';

interface RouletteWheelProps {
  entries: string[];
  colors: string[];
  spinning: boolean;
  winnerIndex: number;
}

export default function RouletteWheel({ entries, colors, spinning, winnerIndex }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const animationRef = useRef<number>(0);

  const size = 420;
  const center = size / 2;
  const radius = size / 2 - 10;

  // Desenhar a roleta
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    const sliceAngle = (2 * Math.PI) / entries.length;

    entries.forEach((entry, i) => {
      const startAngle = i * sliceAngle + (currentAngle * Math.PI) / 180;
      const endAngle = startAngle + sliceAngle;
      const color = colors[i % colors.length];

      // Fatia
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Borda
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(11, Math.min(16, 400 / entries.length))}px "Segoe UI", sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;

      const text = entry.length > 15 ? entry.slice(0, 14) + '…' : entry;
      ctx.fillText(text, radius - 18, 5);
      ctx.restore();
    });

    // Centro
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#1F2937';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Borda externa
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [entries, colors, currentAngle, size, center, radius]);

  // Animação de giro
  useEffect(() => {
    if (!spinning) return;

    const sliceAngleDeg = 360 / entries.length;
    // Pointer at top = 270° in canvas coords (0° = right, clockwise)
    const desiredFinal = 270 - (winnerIndex * sliceAngleDeg + sliceAngleDeg / 2);
    const normalizedDesired = ((desiredFinal % 360) + 360) % 360;
    const normalizedStart = ((currentAngle % 360) + 360) % 360;

    let delta = normalizedDesired - normalizedStart;
    if (delta < 0) delta += 360;

    // 5 full rotations + the exact delta to land winner at pointer
    const totalRotation = 360 * 5 + delta;

    const startAngle = currentAngle;
    const duration = 5000;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const newAngle = startAngle + totalRotation * easedProgress;
      setCurrentAngle(newAngle);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, winnerIndex]);

  return (
    <div className="roulette-container">
      {/* Ponteiro no topo */}
      <div className="roulette-pointer">
        <svg width="28" height="36" viewBox="0 0 28 36">
          <polygon points="14,36 0,0 28,0" fill="#EF4444" />
        </svg>
      </div>
      {/* Linha marcadora */}
      <div className="roulette-marker" />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="roulette-canvas"
      />
    </div>
  );
}
