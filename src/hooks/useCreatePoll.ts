import { useCallback, useState } from 'react';
import { describeFirestoreError } from '../lib/describeFirestoreError';
import { navigate } from '../lib/navigation';
import { createPoll } from '../lib/pollRepository';
import { presenterPath } from '../lib/routes';
import type { PollDraft } from '../lib/types';

export type CreateSource = 'form' | 'demo';

const CREATE_ERROR_COPY = {
  fallback: 'The poll could not be created. Please try again.',
  permissionDenied: 'The poll was not accepted. Check that your device clock is correct and try again.',
};

export interface CreatePollState {
  pendingSource: CreateSource | null;
  error: string | null;
  submit: (draft: PollDraft, source: CreateSource) => Promise<void>;
}

/** Creates a poll and opens its presenter view. */
export function useCreatePoll(): CreatePollState {
  const [pendingSource, setPendingSource] = useState<CreateSource | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (draft: PollDraft, source: CreateSource) => {
    setPendingSource(source);
    setError(null);
    try {
      const pollId = await createPoll(draft);
      navigate(presenterPath(pollId));
    } catch (caught) {
      setError(describeFirestoreError(caught, CREATE_ERROR_COPY));
      setPendingSource(null);
    }
  }, []);

  return { pendingSource, error, submit };
}
