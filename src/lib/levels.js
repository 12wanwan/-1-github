export const LEVELS = [
  { level: 1, name: "壹 · 启程", threshold: 3 },
  { level: 2, name: "贰 · 扬帆", threshold: 30 },
  { level: 3, name: "叁 · 远航", threshold: 300 },
  { level: 4, name: "肆 · 穿越", threshold: 600 },
  { level: 5, name: "伍 · 深空", threshold: 1000 },
  { level: 6, name: "陆 · 星海", threshold: 5000 },
];

export const LEVEL_NAMES = ["星尘", "壹 · 启程", "贰 · 扬帆", "叁 · 远航", "肆 · 穿越", "伍 · 深空", "陆 · 星海"];

export function levelFor(points) {
  let level = 0;
  for (const L of LEVELS) if (points >= L.threshold) level = L.level;
  const current = LEVELS[level - 1] || null;
  const next = LEVELS[level] || null;
  const base = current ? current.threshold : 0;
  const progress = next ? Math.min(1, (points - base) / (next.threshold - base)) : 1;
  return { level, current, next, progress };
}

// 等级徽章颜色：从绿(140)渐渐变红(0)，随等级与进度渐变
export function levelHue(level, progress = 0) {
  if (level <= 0) return null;
  const t = Math.max(0, Math.min(1, (level - 1 + progress) / 5));
  return Math.round(140 * (1 - t));
}
