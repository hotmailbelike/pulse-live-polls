export interface Poll {
  id: string;
  question: string;
  options: string[];
  closesAt: Date;
}

export interface Vote {
  voterId: string;
  option: number;
}

/** A create-form option row with a stable key, so removing a middle row keeps focus aligned. */
export interface OptionDraft {
  key: number;
  value: string;
}

export interface PollDraft {
  question: string;
  options: string[];
  durationMs: number;
}

/** Async data in one of its explicit states, so views never guess from nulls. */
export type Loadable<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'not-found' }
  | { status: 'error'; message: string };
