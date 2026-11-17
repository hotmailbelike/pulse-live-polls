import { useCallback, useState } from 'react';

/**
 * A counter to pass as a hook dependency: bumping it re-runs a fetch or re-opens a listener.
 * Firestore listeners do not resubscribe after an error, so a retry has to start a new one.
 */
export function useRetryToken(): [token: number, retry: () => void] {
  const [token, setToken] = useState(0);
  const retry = useCallback(() => setToken((current) => current + 1), []);
  return [token, retry];
}
