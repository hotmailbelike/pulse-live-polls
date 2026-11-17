import type { CSSProperties } from 'react';
import { formatVoteCount } from '../lib/formatVoteCount';
import type { OptionResult } from '../lib/tallyVotes';

interface ResultBarProps {
  result: OptionResult;
  isOwnVote: boolean;
}

const PERCENT_TO_RATIO = 100;

export function ResultBar({ result, isOwnVote }: ResultBarProps) {
  const fillStyle = { '--fill': result.percent / PERCENT_TO_RATIO } as CSSProperties;
  const className = ['result', result.isLeading && 'result--leading', isOwnVote && 'result--own']
    .filter(Boolean)
    .join(' ');

  return (
    <li className={className}>
      <div className="result__labels">
        <span className="result__label">
          {result.label}
          {isOwnVote && <span className="result__badge">Your vote</span>}
        </span>
        <span className="result__numbers">
          <span className="result__percent">{result.percent}%</span>
          <span className="result__count">{formatVoteCount(result.count)}</span>
        </span>
      </div>
      <div className="result__track" aria-hidden="true">
        <div className="result__fill" style={fillStyle} />
      </div>
    </li>
  );
}
