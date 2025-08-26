export function getId(): string {
  try {
    // Use the global crypto where available and type it to include randomUUID if present
    type CryptoWithUUID = Crypto & { randomUUID?: () => string };
    const maybeCrypto = (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined) as CryptoWithUUID | undefined;
    if (maybeCrypto && typeof maybeCrypto.randomUUID === 'function') {
      return maybeCrypto.randomUUID();
    }
  } catch {
    // ignore and fall through to fallback
  }

  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export default getId;
