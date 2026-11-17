import type { Vote } from './types';

export interface OptionResult {
  label: string;
  count: number;
  percent: number;
  isLeading: boolean;
}

export interface PollResults {
  options: OptionResult[];
  total: number;
}

const PERCENT_SCALE = 100;

/** Counts votes per option on the client. Votes for options that do not exist are ignored. */
export function tallyVotes(optionLabels: readonly string[], votes: readonly Vote[]): PollResults {
  const counts = optionLabels.map(() => 0);
  for (const vote of votes) {
    const current = counts[vote.option];
    if (current !== undefined) counts[vote.option] = current + 1;
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  const highestCount = Math.max(0, ...counts);

  const options = optionLabels.map((label, index) => {
    const count = counts[index] ?? 0;
    const percent = total === 0 ? 0 : Math.round((count / total) * PERCENT_SCALE);
    return { label, count, percent, isLeading: count > 0 && count === highestCount };
  });

  return { options, total };
}
