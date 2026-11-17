interface ErrorNoticeProps {
  message: string;
  onRetry: () => void;
}

/** An inline error for work that can be started again, such as a dropped live-results listener. */
export function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  return (
    <div className="notice notice--error notice--with-action" role="alert">
      <p>{message}</p>
      <button type="button" className="button button--secondary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
