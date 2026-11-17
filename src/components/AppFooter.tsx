const PORTFOLIO_URL = 'https://abdullah-omar-portfolio.netlify.app/';
const SOURCE_URL = 'https://github.com/hotmailbelike/pulse-live-polls';

export function AppFooter() {
  return (
    <footer className="app-footer">
      <p>
        Built by{' '}
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
          Abdullah Omar
        </a>
      </p>
      <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
        Source
      </a>
    </footer>
  );
}
