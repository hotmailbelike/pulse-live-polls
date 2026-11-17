import { CreatePollForm } from '../components/CreatePollForm';
import { HowItWorks } from '../components/HowItWorks';
import { useCreatePoll } from '../hooks/useCreatePoll';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { buildDemoPoll } from '../lib/demoPoll';

export function HomePage() {
  useDocumentTitle(null);
  const { pendingSource, error, submit } = useCreatePoll();
  const isBusy = pendingSource !== null;

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="hero__title">
          Ask the room. <span className="hero__accent">See it answer live.</span>
        </h1>
        <p className="hero__lede">
          Create a poll in seconds, put the QR code on screen and watch the results move as people vote
          from their phones. No accounts, no app to install.
        </p>
        <button
          type="button"
          className="button button--secondary"
          disabled={isBusy}
          onClick={() => void submit(buildDemoPoll(), 'demo')}
        >
          {pendingSource === 'demo' ? 'Starting demo…' : 'Try a demo poll'}
        </button>
      </section>

      <section className="create" aria-labelledby="create-heading">
        <h2 id="create-heading" className="section-heading">
          Create a poll
        </h2>
        <CreatePollForm
          isSubmitting={pendingSource === 'form'}
          isDisabled={isBusy}
          submitError={error}
          onSubmit={(draft) => void submit(draft, 'form')}
        />
      </section>

      <HowItWorks />
    </div>
  );
}
