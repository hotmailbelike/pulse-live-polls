import { NavLink } from '../components/NavLink';
import { StatusPanel } from '../components/StatusPanel';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { homePath } from '../lib/routes';

export function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <StatusPanel title="Page not found">
      <p className="status-panel__body">There is nothing at this address.</p>
      <NavLink to={homePath()} className="button button--primary">
        Go to Pulse
      </NavLink>
    </StatusPanel>
  );
}
