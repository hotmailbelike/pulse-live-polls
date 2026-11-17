const VOTER_ID_STORAGE_KEY = 'pulse.voterId';
const VOTER_ID_BYTES = 16;
const HEX_RADIX = 16;
const VOTER_ID_PATTERN = /^[A-Za-z0-9_-]{20,40}$/;

// getRandomValues works on plain-http LAN addresses, where crypto.randomUUID is unavailable.
function generateVoterId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(VOTER_ID_BYTES));
  return Array.from(bytes, (byte) => byte.toString(HEX_RADIX).padStart(2, '0')).join('');
}

let sessionFallbackId: string | null = null;

/**
 * Returns this device's anonymous voter id, creating it on first use.
 * When storage is blocked (private mode, disabled cookies) the id lasts for this tab only.
 */
export function getVoterId(): string {
  try {
    const stored = localStorage.getItem(VOTER_ID_STORAGE_KEY);
    if (stored !== null && VOTER_ID_PATTERN.test(stored)) return stored;
    const created = generateVoterId();
    localStorage.setItem(VOTER_ID_STORAGE_KEY, created);
    return created;
  } catch {
    sessionFallbackId ??= generateVoterId();
    return sessionFallbackId;
  }
}
