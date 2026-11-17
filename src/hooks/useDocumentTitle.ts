import { useEffect } from 'react';

const APP_NAME = 'Pulse';

export function useDocumentTitle(pageTitle: string | null): void {
  useEffect(() => {
    document.title = pageTitle === null ? `${APP_NAME} · Live polls` : `${pageTitle} · ${APP_NAME}`;
  }, [pageTitle]);
}
