const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function monthKey(dateKey) {
  return dateKey.slice(0, 7);
}

export function addDaysKey(dateKey, n) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d + n));
}

export function parseKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateCN(dateKey, { withYear = false } = {}) {
  const dt = parseKey(dateKey);
  const md = `${dt.getMonth() + 1}月${dt.getDate()}日`;
  const w = WEEK[dt.getDay()];
  return withYear ? `${dt.getFullYear()}年${md} ${w}` : `${md} ${w}`;
}

export function daysInMonth(dateKey) {
  const dt = parseKey(dateKey);
  return new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
}

export function monthLabel(dateKey) {
  const [y, m] = dateKey.split("-").map(Number);
  return `${y}年${m}月`;
}
