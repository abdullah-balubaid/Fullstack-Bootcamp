import { useEffect, useRef } from "react";

// ── Design tokens (mirrors src/index.css) ────────────────────────────────────
const GOLD_COLORS = ["#D4AF37", "#E8C84A", "#FFF1AA", "#C9A227", "#F8E4AE"];

// ── Particle shape types ──────────────────────────────────────────────────────
type ParticleType = "star" | "crescent" | "sparkle" | "dot";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  type: ParticleType;
  rotation: number;
  vRotation: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  colorIdx: number;
}

// ── Pre-render a crescent to an offscreen canvas so it can be blitted fast ───
function makeCrescentCanvas(radius: number, color: string): HTMLCanvasElement {
  const pad = 4;
  const d = (radius + pad) * 2;
  const oc = document.createElement("canvas");
  oc.width = d;
  oc.height = d;
  const octx = oc.getContext("2d")!;
  const cx = d / 2;
  const cy = d / 2;

  // outer disk
  octx.fillStyle = color;
  octx.shadowColor = color;
  octx.shadowBlur = radius;
  octx.beginPath();
  octx.arc(cx, cy, radius, 0, Math.PI * 2);
  octx.fill();

  // punch hole to create crescent
  octx.globalCompositeOperation = "destination-out";
  octx.fillStyle = "rgba(0,0,0,1)";
  octx.beginPath();
  octx.arc(cx + radius * 0.45, cy, radius * 0.78, 0, Math.PI * 2);
  octx.fill();

  return oc;
}

// ── Draw a 4-pointed sparkle ──────────────────────────────────────────────────
function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string,
  opacity: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 3;
  ctx.beginPath();
  for (let arm = 0; arm < 4; arm++) {
    const a = (arm * Math.PI) / 2;
    const bx = Math.cos(a) * size;
    const by = Math.sin(a) * size;
    const lx = Math.cos(a + Math.PI / 4) * size * 0.28;
    const ly = Math.sin(a + Math.PI / 4) * size * 0.28;
    const rx = Math.cos(a - Math.PI / 4) * size * 0.28;
    const ry = Math.sin(a - Math.PI / 4) * size * 0.28;
    if (arm === 0) ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(0, 0, rx, ry);
    ctx.lineTo(bx, by);
    ctx.lineTo(lx, ly);
  }
  ctx.fill();
  ctx.restore();
}

// ── Draw a glowing round star / dot ──────────────────────────────────────────
function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  opacity: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 4;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
  // Inner bright core
  ctx.globalAlpha = opacity * 0.9;
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 2;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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

    // Pre-render crescent sprites at a few sizes
    const crescentSprites: Map<string, HTMLCanvasElement> = new Map();
    const crescentSizes = [5, 7, 10, 13];
    for (const sz of crescentSizes) {
      for (const col of GOLD_COLORS) {
        crescentSprites.set(`${sz}-${col}`, makeCrescentCanvas(sz, col));
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const buildParticles = () => {
      const count = Math.max(
        40,
        Math.floor((canvas.width * canvas.height) / 9000)
      );
      particles = Array.from({ length: count }, () => {
        // weight: mostly dots/stars, some sparkles, fewer crescents
        const roll = Math.random();
        const type: ParticleType =
          roll < 0.55
            ? "dot"
            : roll < 0.75
            ? "star"
            : roll < 0.9
            ? "sparkle"
            : "crescent";

        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(Math.random() * 0.35 + 0.08),
          size:
            type === "crescent"
              ? crescentSizes[Math.floor(Math.random() * crescentSizes.length)]
              : type === "sparkle"
              ? Math.random() * 4 + 3
              : Math.random() * 2.5 + 1,
          baseOpacity: Math.random() * 0.5 + 0.2,
          type,
          rotation: Math.random() * Math.PI * 2,
          vRotation: (Math.random() - 0.5) * 0.015,
          twinkleSpeed: Math.random() * 0.025 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          colorIdx: Math.floor(Math.random() * GOLD_COLORS.length),
        };
      });
    };

    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      for (const p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        // Wrap vertically
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        const twinkle =
          0.4 + 0.6 * Math.abs(Math.sin(t * p.twinkleSpeed + p.twinkleOffset));
        const opacity = p.baseOpacity * twinkle;
        const color = GOLD_COLORS[p.colorIdx];

        if (p.type === "dot" || p.type === "star") {
          drawDot(ctx, p.x, p.y, p.size, color, opacity);
        } else if (p.type === "sparkle") {
          drawSparkle(ctx, p.x, p.y, p.size, p.rotation, color, opacity);
        } else {
          // crescent — blit from sprite
          const closestSize = crescentSizes.reduce((prev, cur) =>
            Math.abs(cur - p.size) < Math.abs(prev - p.size) ? cur : prev
          );
          const sprite = crescentSprites.get(`${closestSize}-${color}`);
          if (sprite) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            const hw = sprite.width / 2;
            const hh = sprite.height / 2;
            ctx.drawImage(sprite, -hw, -hh);
            ctx.restore();
          }
        }
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
      style={{ mixBlendMode: "screen", opacity: 0.65 }}
    />
  );
};

export default ParticleBackground;
