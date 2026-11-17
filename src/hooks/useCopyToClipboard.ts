import { useCallback, useEffect, useRef, useState } from 'react';

const STATUS_RESET_MS = 2000;

export type CopyStatus = 'idle' | 'copied' | 'failed';

export function useCopyToClipboard(): { status: CopyStatus; copy: (text: string) => void } {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copy = useCallback((text: string) => {
    const showStatus = (next: CopyStatus) => {
      setStatus(next);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setStatus('idle'), STATUS_RESET_MS);
    };
    // navigator.clipboard is missing outside secure contexts, such as plain-http LAN testing.
    if (navigator.clipboard === undefined) {
      showStatus('failed');
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => showStatus('copied'),
      () => showStatus('failed'),
    );
  }, []);

  return { status, copy };
}
