import { useEffect, useRef } from "react";

const COUNT = 520;
const COLORS = ["#f6d9a0", "#e9b35f", "#6fd0bb", "#f4ecdd"];

export default function ParticleSphere({ speed = 0.16 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let angle = 0;

    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    function resize() {
      const w = canvas.offsetWidth || 300;
      const h = canvas.offsetHeight || 300;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function frame() {
      raf = requestAnimationFrame(frame);
      angle += speed * 0.011;
      const w = canvas.offsetWidth || 300;
      const h = canvas.offsetHeight || 300;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.44;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosB = Math.cos(angle * 0.55);
      const sinB = Math.sin(angle * 0.55);

      const order = pts
        .map((p) => {
          const x1 = p.x * cosA + p.z * sinA;
          const z1 = -p.x * sinA + p.z * cosA;
          const y1 = p.y * cosB - z1 * sinB;
          const z2 = p.y * sinB + z1 * cosB;
          return { x: x1, y: y1, z: z2 };
        })
        .sort((a, b) => a.z - b.z);

      for (let i = 0; i < order.length; i++) {
        const q = order[i];
        const depth = (q.z + 1) / 2;
        const px = cx + q.x * R;
        const py = cy + q.y * R;
        ctx.globalAlpha = 0.16 + depth * 0.84;
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.beginPath();
        ctx.arc(px, py, 0.7 + depth * 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [speed]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

