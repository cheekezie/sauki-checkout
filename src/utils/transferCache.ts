const KEY_PREFIX = 'sauki_tf_';

export type TransferCacheData = {
  status: boolean;
  supportMessage: string;
  transID: string;
  ussdCode: string;
  redirectUrl: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
};

interface CacheEntry {
  data: TransferCacheData;
  expiresAt: number;
}

export function getTransferCache(ref: string): TransferCacheData | undefined {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + ref);
    if (!raw) return undefined;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(KEY_PREFIX + ref);
      return undefined;
    }
    return entry.data;
  } catch {
    return undefined;
  }
}

export function setTransferCache(ref: string, data: TransferCacheData, expiryMinutes: number): void {
  try {
    const entry: CacheEntry = {
      data,
      expiresAt: Date.now() + expiryMinutes * 60 * 1000,
    };
    localStorage.setItem(KEY_PREFIX + ref, JSON.stringify(entry));
  } catch {}
}

export function clearTransferCache(ref: string): void {
  localStorage.removeItem(KEY_PREFIX + ref);
}
