import { useEffect, useRef, type RefObject } from 'react';

/**
 * Moves focus to `targetRef` whenever `routeKey` changes after the first render, so keyboard and
 * screen reader users land on the new view instead of a control that no longer exists.
 */
export function useFocusOnRouteChange(routeKey: string, targetRef: RefObject<HTMLElement | null>): void {
  const previousKey = useRef(routeKey);

  useEffect(() => {
    if (previousKey.current === routeKey) return;
    previousKey.current = routeKey;
    targetRef.current?.focus({ preventScroll: true });
  }, [routeKey, targetRef]);
}
