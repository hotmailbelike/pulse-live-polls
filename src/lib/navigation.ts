const NAVIGATION_EVENT = 'pulse:navigate';

/** Client-side navigation without a router dependency; the app only has three routes. */
export function navigate(path: string): void {
  if (path === window.location.pathname) return;
  window.history.pushState(null, '', path);
  window.scrollTo(0, 0);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}

export function subscribeToNavigation(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener(NAVIGATION_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(NAVIGATION_EVENT, onChange);
  };
}
