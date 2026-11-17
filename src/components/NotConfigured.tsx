import { StatusPanel } from './StatusPanel';

export function NotConfigured() {
  return (
    <StatusPanel title="Pulse is not configured yet">
      <p className="status-panel__body">
        This build has no Firebase project attached. Copy <code>.env.example</code> to{' '}
        <code>.env.local</code>, add your Firebase web app settings, then restart the dev server.
      </p>
    </StatusPanel>
  );
}
