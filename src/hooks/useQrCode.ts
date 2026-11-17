import { useEffect, useState } from 'react';
import { renderQrCodeDataUrl } from '../lib/qrCode';
import type { Loadable } from '../lib/types';

interface QrState {
  text: string;
  result: Loadable<string>;
}

export function useQrCode(text: string): Loadable<string> {
  const [state, setState] = useState<QrState | null>(null);

  useEffect(() => {
    let isCurrent = true;
    renderQrCodeDataUrl(text)
      .then((dataUrl) => {
        if (isCurrent) setState({ text, result: { status: 'ready', data: dataUrl } });
      })
      .catch(() => {
        if (isCurrent) {
          setState({ text, result: { status: 'error', message: 'The QR code could not be drawn.' } });
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [text]);

  return state !== null && state.text === text ? state.result : { status: 'loading' };
}
