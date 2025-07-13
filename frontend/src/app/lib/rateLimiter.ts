const ipStore = new Map<string, { count: number; timestamp: number }>();

const WINDOW = 60 * 1000;
const LIMIT = 10;

export function rateLimiter(ip: string): boolean {
  const now = Date.now();
  const existing = ipStore.get(ip);

  if (!existing || now - existing.timestamp > WINDOW) {
    ipStore.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (existing.count < LIMIT) {
    existing.count += 1;
    return true;
  }

  return false;
}
