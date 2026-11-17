import { useMemo, useRef } from 'react';
import { CountdownBadge } from '../components/CountdownBadge';
import { ErrorNotice } from '../components/ErrorNotice';
import { JoinPanel } from '../components/JoinPanel';
import { NavLink } from '../components/NavLink';
import { ResultsChart } from '../components/ResultsChart';
import { StatusPanel } from '../components/StatusPanel';
import { useCountdown } from '../hooks/useCountdown';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFullscreen } from '../hooks/useFullscreen';
import { usePoll } from '../hooks/usePoll';
import { useRetryToken } from '../hooks/useRetryToken';
import { useVotes } from '../hooks/useVotes';
import { buildAudienceUrl } from '../lib/audienceUrl';
import { formatVoteCount } from '../lib/formatVoteCount';
import { homePath } from '../lib/routes';
import { tallyVotes } from '../lib/tallyVotes';
import type { Poll, Vote } from '../lib/types';

const NO_VOTES: Vote[] = [];

interface PresenterPageProps {
  pollId: string;
}

export function PresenterPage({ pollId }: PresenterPageProps) {
  const [pollRetryToken, retryPoll] = useRetryToken();
  const poll = usePoll(pollId, pollRetryToken);
  useDocumentTitle(poll.status === 'ready' ? `Present: ${poll.data.question}` : 'Present');

  switch (poll.status) {
    case 'loading':
      return <StatusPanel title="Loading poll…" isLoading />;
    case 'not-found':
      return <PollNotFound />;
    case 'error':
      return (
        <StatusPanel title="Something went wrong" tone="error">
          <p className="status-panel__body">{poll.message}</p>
          <button type="button" className="button button--primary" onClick={retryPoll}>
            Try again
          </button>
        </StatusPanel>
      );
    case 'ready':
      return <PresenterStage poll={poll.data} />;
  }
}

function PollNotFound() {
  return (
    <StatusPanel title="Poll not found">
      <p className="status-panel__body">The link may be mistyped, or the poll was never created.</p>
      <NavLink to={homePath()} className="button button--primary">
        Create a poll
      </NavLink>
    </StatusPanel>
  );
}

function PresenterStage({ poll }: { poll: Poll }) {
  const stageRef = useRef<HTMLElement>(null);
  const fullscreen = useFullscreen(stageRef);
  const countdown = useCountdown(poll.closesAt);
  const [votesRetryToken, retryVotes] = useRetryToken();
  const votes = useVotes(poll.id, votesRetryToken);
  const audienceUrl = buildAudienceUrl(poll.id);

  const voteList = votes.status === 'ready' ? votes.data : NO_VOTES;
  const results = useMemo(() => tallyVotes(poll.options, voteList), [poll.options, voteList]);

  return (
    <section ref={stageRef} className="presenter" aria-labelledby="presenter-question">
      <div className="presenter__meta">
        <CountdownBadge msLeft={countdown.msLeft} isClosed={countdown.isClosed} />
        <span className="presenter__total" aria-live="polite">
          {formatVoteCount(results.total)}
        </span>
      </div>

      <h1 id="presenter-question" className="presenter__question">
        {poll.question}
      </h1>

      <div className="presenter__grid">
        <div className="presenter__results">
          {votes.status === 'error' ? (
            <ErrorNotice message={votes.message} onRetry={retryVotes} />
          ) : (
            <ResultsChart results={results} size="large" />
          )}
          {votes.status === 'ready' && results.total === 0 && (
            <p className="presenter__empty">
              {countdown.isClosed ? 'No votes were cast.' : 'Waiting for the first vote…'}
            </p>
          )}
        </div>
        <JoinPanel audienceUrl={audienceUrl} fullscreen={fullscreen} />
      </div>
    </section>
  );
}
