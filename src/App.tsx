import { lazy, Suspense, useRef } from 'react';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { NotConfigured } from './components/NotConfigured';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { StatusPanel } from './components/StatusPanel';
import { useFocusOnRouteChange } from './hooks/useFocusOnRouteChange';
import { useRoute } from './hooks/useRoute';
import { isFirebaseConfigured } from './lib/firebase';
import { routeKey, type Route } from './lib/routes';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Voters never download the presenter view or its QR encoder, and presenters skip the ballot.
const PresenterPage = lazy(() =>
  import('./pages/PresenterPage').then((module) => ({ default: module.PresenterPage })),
);
const AudiencePage = lazy(() =>
  import('./pages/AudiencePage').then((module) => ({ default: module.AudiencePage })),
);

function renderRoute(route: Route) {
  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'presenter':
      // Keyed so moving between polls starts from a clean state.
      return <PresenterPage key={route.pollId} pollId={route.pollId} />;
    case 'audience':
      return <AudiencePage key={route.pollId} pollId={route.pollId} />;
    case 'not-found':
      return <NotFoundPage />;
  }
}

export function App() {
  const route = useRoute();
  const currentRouteKey = routeKey(route);
  const mainRef = useRef<HTMLElement>(null);
  useFocusOnRouteChange(currentRouteKey, mainRef);
  const isWide = route.name === 'presenter';

  return (
    <div className={`app${isWide ? ' app--wide' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AppHeader />
      <main id="main" ref={mainRef} tabIndex={-1} className="app-main">
        {isFirebaseConfigured ? (
          <RouteErrorBoundary key={currentRouteKey}>
            <Suspense fallback={<StatusPanel title="Loading…" isLoading />}>{renderRoute(route)}</Suspense>
          </RouteErrorBoundary>
        ) : (
          <NotConfigured />
        )}
      </main>
      <AppFooter />
    </div>
  );
}
