import { formatTimeLeft } from '../lib/formatTimeLeft';

interface CountdownBadgeProps {
  msLeft: number;
  isClosed: boolean;
}

export function CountdownBadge({ msLeft, isClosed }: CountdownBadgeProps) {
  if (isClosed) {
    return <span className="badge badge--closed">Voting closed</span>;
  }
  return (
    <span className="badge badge--live">
      <span className="badge__dot" aria-hidden="true" />
      Live · <span className="visually-hidden">time left </span>
      <time className="badge__time">{formatTimeLeft(msLeft)}</time>
      <span aria-hidden="true"> left</span>
    </span>
  );
}
