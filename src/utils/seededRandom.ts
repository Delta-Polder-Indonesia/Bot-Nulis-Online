/**
 * Menghasilkan angka pseudo-random yang konsisten [0, 1) berdasarkan seed string.
 * Deterministik sehingga tidak berubah antar render seperti Math.random().
 */
export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return (Math.abs(hash) % 10000) / 10000;
}

/**
 * Menghasilkan angka dalam rentang [min, max] berdasarkan seed.
 */
export function seededRandomRange(
  seed: string,
  min: number,
  max: number
): number {
  return min + seededRandom(seed) * (max - min);
}

/**
 * Menghasilkan rotasi kecil untuk efek tulisan tangan alami.
 * Nilai antara -maxDeg sampai +maxDeg.
 */
export function seededRotation(seed: string, maxDeg: number): number {
  return (seededRandom(seed) - 0.5) * 2 * maxDeg;
}
