import { NavLink } from './NavLink';
import { homePath } from '../lib/routes';

export function AppHeader() {
  return (
    <header className="app-header">
      <NavLink to={homePath()} className="brand" aria-label="Pulse home">
        <span className="brand__mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="brand__name">Pulse</span>
      </NavLink>
      <p className="app-header__tagline">Live polls for talks, classes and meetings.</p>
    </header>
  );
}
