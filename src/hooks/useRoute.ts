import { useMemo, useSyncExternalStore } from 'react';
import { subscribeToNavigation } from '../lib/navigation';
import { parseRoute, type Route } from '../lib/routes';

const readPathname = () => window.location.pathname;

export function useRoute(): Route {
  const pathname = useSyncExternalStore(subscribeToNavigation, readPathname);
  return useMemo(() => parseRoute(pathname), [pathname]);
}
