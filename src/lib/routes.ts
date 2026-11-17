export type Route =
  | { name: 'home' }
  | { name: 'presenter'; pollId: string }
  | { name: 'audience'; pollId: string }
  | { name: 'not-found' };

const PRESENTER_PREFIX = 'p';
const AUDIENCE_PREFIX = 'v';
// Firestore auto ids, the only poll ids firestore.rules accepts.
const POLL_ID_PATTERN = /^[A-Za-z0-9]{20}$/;

export const homePath = () => '/';
export const presenterPath = (pollId: string) => `/${PRESENTER_PREFIX}/${pollId}`;
export const audiencePath = (pollId: string) => `/${AUDIENCE_PREFIX}/${pollId}`;

export function parseRoute(pathname: string): Route {
  const segments = pathname.split('/').filter((segment) => segment.length > 0);
  if (segments.length === 0) return { name: 'home' };

  const [prefix, pollId, ...rest] = segments;
  const isPollPath = pollId !== undefined && rest.length === 0 && POLL_ID_PATTERN.test(pollId);
  if (isPollPath && prefix === PRESENTER_PREFIX) return { name: 'presenter', pollId };
  if (isPollPath && prefix === AUDIENCE_PREFIX) return { name: 'audience', pollId };
  return { name: 'not-found' };
}

/** Identifies the view a route renders, so view-level state can be reset when it changes. */
export function routeKey(route: Route): string {
  switch (route.name) {
    case 'presenter':
    case 'audience':
      return `${route.name}:${route.pollId}`;
    case 'home':
    case 'not-found':
      return route.name;
  }
}
