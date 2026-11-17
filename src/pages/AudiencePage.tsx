import { useMemo, useState } from 'react';
import { ErrorNotice } from '../components/ErrorNotice';
import { NavLink } from '../components/NavLink';
import { ResultsChart } from '../components/ResultsChart';
import { StatusPanel } from '../components/StatusPanel';
import { VoteOptions } from '../components/VoteOptions';
import { useCountdown } from '../hooks/useCountdown';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePoll } from '../hooks/usePoll';
import { useRetryToken } from '../hooks/useRetryToken';
import { useVotes } from '../hooks/useVotes';
import { describeFirestoreError } from '../lib/describeFirestoreError';
import { formatTimeLeft } from '../lib/formatTimeLeft';
import { formatVoteCount } from '../lib/formatVoteCount';
import { castVote } from '../lib/pollRepository';
import { homePath } from '../lib/routes';
import { tallyVotes, type PollResults } from '../lib/tallyVotes';
import type { Poll, Vote } from '../lib/types';
import { getVoterId } from '../lib/voterId';

const NO_VOTES: Vote[] = [];

const VOTE_ERROR_COPY = {
  fallback: 'Your vote did not go through. Please try again.',
  permissionDenied:
    'Your vote was not accepted. The poll may have closed, this device may have voted already, or its clock may be off.',
};

interface AudiencePageProps {
  pollId: string;
}

export function AudiencePage({ pollId }: AudiencePageProps) {
  const [pollRetryToken, retryPoll] = useRetryToken();
  const poll = usePoll(pollId, pollRetryToken);
  useDocumentTitle(poll.status === 'ready' ? poll.data.question : 'Vote');

  switch (poll.status) {
    case 'loading':
      return <StatusPanel title="Loading poll…" isLoading />;
    case 'not-found':
      return (
        <StatusPanel title="Poll not found">
          <p className="status-panel__body">
            Check the link or scan the QR code again. If it still fails, ask the presenter for a new link.
          </p>
          <NavLink to={homePath()} className="button button--secondary">
            Make your own poll
          </NavLink>
        </StatusPanel>
      );
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
      return <AudienceBallot poll={poll.data} />;
  }
}

function AudienceBallot({ poll }: { poll: Poll }) {
  const voterId = useMemo(getVoterId, []);
  const [votesRetryToken, retryVotes] = useRetryToken();
  const votes = useVotes(poll.id, votesRetryToken);
  const countdown = useCountdown(poll.closesAt);
  const [pendingOption, setPendingOption] = useState<number | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);

  const voteList = votes.status === 'ready' ? votes.data : NO_VOTES;
  const results = useMemo(() => tallyVotes(poll.options, voteList), [poll.options, voteList]);

  // Firestore shows a pending write in the snapshot at once; wait for the server before thanking.
  const ownVote = voteList.find((vote) => vote.voterId === voterId);
  const ownOption = pendingOption === null ? (ownVote?.option ?? null) : null;
  const hasVoted = ownOption !== null;

  const handleVote = async (option: number) => {
    setPendingOption(option);
    setVoteError(null);
    try {
      await castVote(poll.id, voterId, option);
    } catch (error) {
      setVoteError(describeFirestoreError(error, VOTE_ERROR_COPY));
    } finally {
      setPendingOption(null);
    }
  };

  const showResults = hasVoted || countdown.isClosed;

  return (
    <article className="ballot" aria-labelledby="ballot-question">
      <p className="ballot__meta">
        {countdown.isClosed ? 'Voting closed' : `${formatTimeLeft(countdown.msLeft)} left to vote`}
      </p>
      <h1 id="ballot-question" className="ballot__question">
        {poll.question}
      </h1>

      {hasVoted && (
        <p className="notice notice--success" role="status">
          Thanks, your vote is in. Results update live.
        </p>
      )}
      {!hasVoted && countdown.isClosed && (
        <p className="notice" role="status">
          This poll has closed. Here are the final results.
        </p>
      )}
      {voteError !== null && (
        <p className="notice notice--error" role="alert">
          {voteError}
        </p>
      )}

      <BallotBody
        isLoadingVotes={votes.status === 'loading'}
        votesError={votes.status === 'error' ? votes.message : null}
        showResults={showResults}
        poll={poll}
        results={results}
        ownOption={ownOption}
        pendingOption={pendingOption}
        onVote={(option) => void handleVote(option)}
        onRetryVotes={retryVotes}
      />

      {showResults && votes.status === 'ready' && (
        <p className="ballot__total">{formatVoteCount(results.total)} so far</p>
      )}
    </article>
  );
}

interface BallotBodyProps {
  isLoadingVotes: boolean;
  votesError: string | null;
  showResults: boolean;
  poll: Poll;
  results: PollResults;
  ownOption: number | null;
  pendingOption: number | null;
  onVote: (option: number) => void;
  onRetryVotes: () => void;
}

function BallotBody(props: BallotBodyProps) {
  const { isLoadingVotes, votesError, showResults, poll, results, ownOption, pendingOption, onVote, onRetryVotes } =
    props;

  // Without the vote list we cannot tell whether this device already voted, so wait for it.
  if (isLoadingVotes) {
    return (
      <div className="ballot__loading" role="status" aria-busy="true">
        <span className="spinner" aria-hidden="true" />
        <span className="visually-hidden">Loading</span>
      </div>
    );
  }
  if (showResults) {
    return votesError === null ? (
      <ResultsChart results={results} ownOption={ownOption} />
    ) : (
      <ErrorNotice message={votesError} onRetry={onRetryVotes} />
    );
  }
  // If live results fail, voting still works: the rules reject a second vote from this device.
  return <VoteOptions options={poll.options} pendingOption={pendingOption} onVote={onVote} />;
}
