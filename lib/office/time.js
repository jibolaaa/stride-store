// Dates and times in Lagos (UTC+1 all year, no daylight saving), written
// out by hand so the server and the phone always print the same thing.
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(d) {
  const t = new Date(new Date(d).getTime() + 3600_000);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate(), wd: t.getUTCDay(), h: t.getUTCHours(), min: t.getUTCMinutes() };
}

// "2:05pm"
export function timeOf(d) {
  const p = parts(d);
  return `${p.h % 12 || 12}:${String(p.min).padStart(2, "0")}${p.h < 12 ? "am" : "pm"}`;
}

// "Sat 17 Oct"
export function dateOf(d) {
  const p = parts(d);
  return `${DAYS[p.wd]} ${p.d} ${MONTHS[p.m]}`;
}

// "2026-10-17", for grouping by day
export function dayKey(d) {
  const p = parts(d);
  return `${p.y}-${String(p.m + 1).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

// "Today", "Yesterday" or "Thu 15 Oct"
export function dayLabel(d, now = new Date()) {
  const key = dayKey(d);
  if (key === dayKey(now)) return "Today";
  if (key === dayKey(now.getTime() - 86400_000)) return "Yesterday";
  return dateOf(d);
}

// "Today, 2:05pm" or "Thu 15 Oct, 2:05pm"
export const when = (d, now = new Date()) => `${dayLabel(d, now)}, ${timeOf(d)}`;

// Short weekday for a "2026-10-17" style date: "Sat"
export const weekdayOf = (iso) => DAYS[new Date(`${String(iso).slice(0, 10)}T12:00:00Z`).getUTCDay()];
