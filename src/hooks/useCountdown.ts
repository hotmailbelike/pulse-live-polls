import { useNow } from './useNow';

const TICK_MS = 1000;

export interface Countdown {
  msLeft: number;
  isClosed: boolean;
}

export function useCountdown(closesAt: Date): Countdown {
  const now = useNow(TICK_MS);
  const msLeft = Math.max(0, closesAt.getTime() - now);
  return { msLeft, isClosed: msLeft === 0 };
}
