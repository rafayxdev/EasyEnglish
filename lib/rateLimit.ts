type RateEntry = {
  timestamps: number[];
};

const windowMs = 10 * 60 * 1000;
const maxRequests = 15;

const memory = new Map<string, RateEntry>();

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = memory.get(ip) ?? { timestamps: [] };

  const recent = entry.timestamps.filter((time) => now - time < windowMs);
  recent.push(now);

  memory.set(ip, { timestamps: recent });

  if (recent.length > maxRequests) {
    return false;
  }

  return true;
}
