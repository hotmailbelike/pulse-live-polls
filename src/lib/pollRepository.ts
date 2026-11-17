import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { CLOCK_SKEW_MARGIN_MS, MAX_POLL_DURATION_MS } from './pollDurations';
import type { Poll, PollDraft, Vote } from './types';

const POLLS_COLLECTION = 'polls';
const VOTES_SUBCOLLECTION = 'votes';

function computeClosesAt(durationMs: number): Timestamp {
  const safeDurationMs = Math.min(durationMs, MAX_POLL_DURATION_MS - CLOCK_SKEW_MARGIN_MS);
  return Timestamp.fromMillis(Date.now() + safeDurationMs);
}

function parsePoll(id: string, data: DocumentData): Poll | null {
  const { question, options, closesAt } = data;
  const hasValidShape =
    typeof question === 'string' &&
    Array.isArray(options) &&
    options.every((option) => typeof option === 'string') &&
    closesAt instanceof Timestamp;
  if (!hasValidShape) return null;
  return { id, question, options, closesAt: closesAt.toDate() };
}

function parseVote(voterId: string, data: DocumentData): Vote | null {
  const { option } = data;
  if (typeof option !== 'number' || !Number.isInteger(option)) return null;
  return { voterId, option };
}

/** Creates the poll and resolves with its id once the server has accepted it. */
export async function createPoll(draft: PollDraft): Promise<string> {
  const pollRef = await addDoc(collection(getDb(), POLLS_COLLECTION), {
    question: draft.question,
    options: draft.options,
    createdAt: serverTimestamp(),
    closesAt: computeClosesAt(draft.durationMs),
  });
  return pollRef.id;
}

/** Resolves with null when the poll does not exist or is malformed. Polls never change after creation. */
export async function fetchPoll(pollId: string): Promise<Poll | null> {
  const snapshot = await getDoc(doc(getDb(), POLLS_COLLECTION, pollId));
  const data = snapshot.data();
  return data === undefined ? null : parsePoll(snapshot.id, data);
}

export function subscribeToVotes(
  pollId: string,
  onVotes: (votes: Vote[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const votesRef = collection(getDb(), POLLS_COLLECTION, pollId, VOTES_SUBCOLLECTION);
  return onSnapshot(
    votesRef,
    (snapshot) => {
      const votes = snapshot.docs
        .map((voteDoc) => parseVote(voteDoc.id, voteDoc.data()))
        .filter((vote): vote is Vote => vote !== null);
      onVotes(votes);
    },
    onError,
  );
}

/** The vote id is the voter id, so the rules turn a repeat vote into a rejected update. */
export async function castVote(pollId: string, voterId: string, option: number): Promise<void> {
  const voteRef = doc(getDb(), POLLS_COLLECTION, pollId, VOTES_SUBCOLLECTION, voterId);
  await setDoc(voteRef, { option, createdAt: serverTimestamp() });
}
