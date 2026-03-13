import { useEffect, useRef } from "react";

// ── Design tokens (Arcade Neon Colors) ────────────────────────────────────
const NEON_COLORS = ["#00F2FF", "#39FF14", "#FF00E5", "#1466ff"];

type ParticleType = "pixel" | "cross" | "invader";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  type: ParticleType;
  colorIdx: number;
}

// ── Drawing Functions ─────────────────────────────────────────────────────────
function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 2;
  ctx.fillRect(x, y, size * 2, size * 2);
}

function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 2;
  ctx.fillRect(x + size, y, size, size * 3);
  ctx.fillRect(x, y + size, size * 3, size);
}

function drawInvader(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 2;
  ctx.fillRect(x + 2 * size, y, size, size);
  ctx.fillRect(x + size, y + size, size * 3, size);
  ctx.fillRect(x, y + 2 * size, size, size);
  ctx.fillRect(x + 2 * size, y + 2 * size, size, size);
  ctx.fillRect(x + 4 * size, y + 2 * size, size, size);
}

// ── Main component ────────────────────────────────────────────────────────────
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const buildParticles = () => {
      // THE SWEET SPOT: Not too crowded, not completely empty
      const count = Math.max(35, Math.floor((canvas.width * canvas.height) / 12000));
      
      particles = Array.from({ length: count }, () => {
        const roll = Math.random();
        // 75% Pixels, 15% Crosses, 10% Space Invaders
        const type: ParticleType = roll < 0.75 ? "pixel" : roll < 0.90 ? "cross" : "invader";

        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Gentle upward float
          vx: (Math.random() - 0.5) * 0.15,
          vy: -(Math.random() * 0.4 + 0.15), 
          size: Math.floor(Math.random() * 2) + 2,
          // Solid visibility, but not blinding
          baseOpacity: Math.random() * 0.4 + 0.15,
          type,
          colorIdx: Math.floor(Math.random() * NEON_COLORS.length),
        };
      });
    };

    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;

        // Wrap around the screen smoothly
        if (p.y < -30) {
          p.y = canvas.height + 30;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;

        // Very subtle twinkle so they don't look completely frozen
        const twinkle = 0.8 + 0.2 * Math.sin(t * 0.05 + p.x);
        const opacity = p.baseOpacity * twinkle;
        const color = NEON_COLORS[p.colorIdx];

        ctx.save();
        if (p.type === "pixel") drawPixel(ctx, p.x, p.y, p.size, color, opacity);
        else if (p.type === "cross") drawCross(ctx, p.x, p.y, p.size, color, opacity);
        else drawInvader(ctx, p.x, p.y, p.size, color, opacity);
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
    buildParticles();
    animate();

    const onResize = () => {
      resize();
      buildParticles();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1"
      // Good baseline opacity so it sits nicely in the background
      style={{ mixBlendMode: "screen", opacity: 0.5 }}
    />
  );
};

export default ParticleBackground;