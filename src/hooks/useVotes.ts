import { useEffect, useState } from 'react';
import { describeFirestoreError } from '../lib/describeFirestoreError';
import { subscribeToVotes } from '../lib/pollRepository';
import type { Loadable, Vote } from '../lib/types';

interface VotesState {
  pollId: string;
  retryToken: number;
  result: Loadable<Vote[]>;
}

/**
 * Live votes for a poll. Pass null to stay idle until the poll itself has loaded.
 * A listener error is final, so change `retryToken` to open a new listener.
 */
export function useVotes(pollId: string | null, retryToken: number): Loadable<Vote[]> {
  const [state, setState] = useState<VotesState | null>(null);

  useEffect(() => {
    if (pollId === null) return;
    return subscribeToVotes(
      pollId,
      (votes) => setState({ pollId, retryToken, result: { status: 'ready', data: votes } }),
      (error) => {
        const message = describeFirestoreError(error, { fallback: 'Live results are unavailable right now.' });
        setState({ pollId, retryToken, result: { status: 'error', message } });
      },
    );
  }, [pollId, retryToken]);

  const isCurrentResult = state !== null && state.pollId === pollId && state.retryToken === retryToken;
  return isCurrentResult ? state.result : { status: 'loading' };
}
