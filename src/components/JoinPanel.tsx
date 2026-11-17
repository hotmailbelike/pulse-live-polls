import type { Fullscreen } from '../hooks/useFullscreen';
import { useCopyToClipboard, type CopyStatus } from '../hooks/useCopyToClipboard';
import { displayUrl } from '../lib/audienceUrl';
import { QrCodeImage } from './QrCodeImage';

interface JoinPanelProps {
  audienceUrl: string;
  fullscreen: Fullscreen;
}

const COPY_LABELS: Record<CopyStatus, string> = {
  idle: 'Copy link',
  copied: 'Copied',
  failed: 'Copy failed',
};

export function JoinPanel({ audienceUrl, fullscreen }: JoinPanelProps) {
  const { status: copyStatus, copy } = useCopyToClipboard();

  return (
    <aside className="card join-panel" aria-labelledby="join-heading">
      <h2 id="join-heading" className="join-panel__heading">
        Scan to vote
      </h2>
      <QrCodeImage url={audienceUrl} />
      <p className="join-panel__url">
        or visit{' '}
        <a href={audienceUrl} target="_blank" rel="noopener noreferrer">
          {displayUrl(audienceUrl)}
        </a>
      </p>
      <div className="join-panel__actions">
        <button type="button" className="button button--secondary" onClick={() => copy(audienceUrl)}>
          {COPY_LABELS[copyStatus]}
        </button>
        {fullscreen.isSupported && (
          <button
            type="button"
            className="button button--secondary"
            onClick={fullscreen.toggle}
            aria-pressed={fullscreen.isFullscreen}
          >
            {fullscreen.isFullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
        )}
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">
        {copyStatus === 'copied' && 'Link copied to clipboard.'}
        {copyStatus === 'failed' && 'Could not copy. Select the link and copy it instead.'}
      </p>
    </aside>
  );
}
