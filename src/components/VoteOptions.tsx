const LETTER_A_CODE = 'A'.charCodeAt(0);

interface VoteOptionsProps {
  options: readonly string[];
  pendingOption: number | null;
  onVote: (option: number) => void;
}

export function VoteOptions({ options, pendingOption, onVote }: VoteOptionsProps) {
  const isSending = pendingOption !== null;
  return (
    <ul className="vote-options" aria-label="Choose one answer">
      {options.map((option, index) => (
        <li key={index}>
          <button
            type="button"
            className={`vote-option${pendingOption === index ? ' vote-option--pending' : ''}`}
            disabled={isSending}
            onClick={() => onVote(index)}
          >
            <span className="vote-option__letter" aria-hidden="true">
              {String.fromCharCode(LETTER_A_CODE + index)}
            </span>
            <span className="vote-option__label">{option}</span>
            {pendingOption === index && <span className="vote-option__status">Sending…</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}
