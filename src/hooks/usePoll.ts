import { useEffect, useState } from 'react';
import { describeFirestoreError } from '../lib/describeFirestoreError';
import { fetchPoll } from '../lib/pollRepository';
import type { Loadable, Poll } from '../lib/types';

interface PollState {
  pollId: string;
  retryToken: number;
  result: Loadable<Poll>;
}

/** Loads a poll once. Change `retryToken` to fetch it again after an error. */
export function usePoll(pollId: string, retryToken: number): Loadable<Poll> {
  const [state, setState] = useState<PollState | null>(null);

  useEffect(() => {
    let isCurrent = true;
    fetchPoll(pollId)
      .then((poll) => {
        if (!isCurrent) return;
        const result: Loadable<Poll> =
          poll === null ? { status: 'not-found' } : { status: 'ready', data: poll };
        setState({ pollId, retryToken, result });
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        const message = describeFirestoreError(error, { fallback: 'This poll could not be loaded.' });
        setState({ pollId, retryToken, result: { status: 'error', message } });
      });
    return () => {
      isCurrent = false;
    };
  }, [pollId, retryToken]);

  // A result for a previous poll id or attempt is stale until the new fetch settles.
  const isCurrentResult = state !== null && state.pollId === pollId && state.retryToken === retryToken;
  return isCurrentResult ? state.result : { status: 'loading' };
}
