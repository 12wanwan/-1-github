import { LEVEL_NAMES, levelHue } from "../lib/levels";

const NUMERALS = ["一", "二", "三", "四", "五", "六"];

export default function LevelBadge({ level = 0, progress = 0, size = 96, showName = false }) {
  const hue = levelHue(level, progress);
  const c1 = hue == null ? "#565b6b" : `hsl(${hue} 72% 56%)`;
  const c2 = hue == null ? "#2e323e" : `hsl(${Math.max(0, hue - 45)} 80% 64%)`;
  const glow = hue == null ? "rgba(120,126,145,0.28)" : `hsla(${hue} 85% 60% / 0.42)`;
  const numeral = level === 0 ? "·" : NUMERALS[level - 1];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative rounded-full shrink-0"
        style={{ width: size, height: size, boxShadow: `0 0 ${size * 0.4}px ${glow}` }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(from 210deg, ${c1}, ${c2}, ${c1})` }}
        />
        <div
          className="absolute rounded-full bg-[#0b0e17] flex items-center justify-center border border-white/10"
          style={{ inset: "6.5%" }}
        >
          <span
            className="font-display font-semibold leading-none"
            style={{ color: c1, fontSize: size * 0.36, letterSpacing: "0.08em", textShadow: `0 0 18px ${glow}` }}
          >
            {numeral}
          </span>
        </div>
      </div>
      {showName && (
        <span className="mono-label !tracking-[0.3em]">{LEVEL_NAMES[level] || LEVEL_NAMES[0]}</span>
      )}
    </div>
  );
}
