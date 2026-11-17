import type { ReactNode } from 'react';

interface StatusPanelProps {
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
  tone?: 'neutral' | 'error';
}

/** Shared loading, empty, error and closed states. */
export function StatusPanel({ title, children, isLoading = false, tone = 'neutral' }: StatusPanelProps) {
  return (
    <section
      className={`status-panel status-panel--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-busy={isLoading}
    >
      {isLoading && <span className="spinner" aria-hidden="true" />}
      <h1 className="status-panel__title">{title}</h1>
      {children}
    </section>
  );
}
