import { useCallback, useSyncExternalStore, type RefObject } from 'react';

function subscribeToFullscreen(onChange: () => void): () => void {
  document.addEventListener('fullscreenchange', onChange);
  return () => document.removeEventListener('fullscreenchange', onChange);
}

const readIsFullscreen = () => document.fullscreenElement !== null;

export interface Fullscreen {
  /** False on browsers without the Fullscreen API, such as Safari on iPhone. */
  isSupported: boolean;
  isFullscreen: boolean;
  toggle: () => void;
}

export function useFullscreen(target: RefObject<HTMLElement | null>): Fullscreen {
  const isFullscreen = useSyncExternalStore(subscribeToFullscreen, readIsFullscreen);
  const isSupported = document.fullscreenEnabled === true;

  const toggle = useCallback(() => {
    // A rejected request (for example, blocked by an iframe policy) leaves the page as it was.
    const ignoreRejection = () => undefined;
    if (document.fullscreenElement !== null) {
      document.exitFullscreen().catch(ignoreRejection);
      return;
    }
    target.current?.requestFullscreen().catch(ignoreRejection);
  }, [target]);

  return { isSupported, isFullscreen, toggle };
}
