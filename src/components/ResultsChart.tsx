import { ResultBar } from './ResultBar';
import type { PollResults } from '../lib/tallyVotes';

interface ResultsChartProps {
  results: PollResults;
  /** The option this device voted for, marked as "Your vote". */
  ownOption?: number | null;
  size?: 'regular' | 'large';
}

export function ResultsChart({ results, ownOption = null, size = 'regular' }: ResultsChartProps) {
  return (
    <ol className={`results results--${size}`} aria-label="Results">
      {results.options.map((option, index) => (
        <ResultBar key={index} result={option} isOwnVote={index === ownOption} />
      ))}
    </ol>
  );
}
