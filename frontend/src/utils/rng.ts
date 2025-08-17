// RNG utilities: provide seeded RNG (mulberry32) and helpers: shuffle (Fisher-Yates), pickOne, pickMany, randomInt

export type RNG = () => number;

// Small, fast seedable PRNG (mulberry32)
export function mulberry32(seed: number): RNG {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const createRng = (seed?: number): RNG => {
  if (typeof seed === 'number') return mulberry32(seed);
  return Math.random;
};

export function shuffle<T>(array: T[], rng?: RNG): T[] {
  const r = rng || Math.random;
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
  const tmp = a[i]!;
  a[i] = a[j]!;
  a[j] = tmp;
  }
  return a;
}

export function pickOne<T>(array: T[], rng?: RNG): T | undefined {
  if (!array || array.length === 0) return undefined;
  const r = rng || Math.random;
  const idx = Math.floor(r() * array.length);
  return array[idx];
}

export function pickMany<T>(array: T[], count: number, rng?: RNG): T[] {
  if (!array || array.length === 0 || count <= 0) return [];
  const r = rng || Math.random;
  // Use shuffle with provided rng
  const shuffled = shuffle(array, r as RNG);
  return shuffled.slice(0, Math.min(count, array.length));
}

export function randomInt(min: number, max: number, rng?: RNG): number {
  const r = rng || Math.random;
  const mn = Math.ceil(min);
  const mx = Math.floor(max);
  return Math.floor(r() * (mx - mn + 1)) + mn;
}

export default { mulberry32, createRng, shuffle, pickOne, pickMany, randomInt };
