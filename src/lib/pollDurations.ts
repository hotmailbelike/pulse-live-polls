const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

export interface PollDuration {
  id: string;
  label: string;
  ms: number;
}

const FIFTEEN_MINUTES: PollDuration = { id: '15m', label: '15 min', ms: 15 * MINUTE_MS };
const ONE_HOUR: PollDuration = { id: '1h', label: '1 hour', ms: HOUR_MS };
const ONE_DAY: PollDuration = { id: '24h', label: '24 hours', ms: 24 * HOUR_MS };

export const POLL_DURATIONS: readonly PollDuration[] = [FIFTEEN_MINUTES, ONE_HOUR, ONE_DAY];
export const DEFAULT_DURATION = ONE_HOUR;

/** Firestore rules reject a closing time more than 24 hours after the server's request time. */
export const MAX_POLL_DURATION_MS = ONE_DAY.ms;

/**
 * closesAt is computed on the device, but the rules compare it with the server clock.
 * Keeping the longest poll a little under the cap stops a fast device clock from
 * pushing it past the 24-hour limit.
 */
export const CLOCK_SKEW_MARGIN_MS = 2 * MINUTE_MS;
