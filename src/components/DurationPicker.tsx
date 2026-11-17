import { POLL_DURATIONS, type PollDuration } from '../lib/pollDurations';

interface DurationPickerProps {
  value: PollDuration;
  disabled: boolean;
  onChange: (duration: PollDuration) => void;
}

export function DurationPicker({ value, disabled, onChange }: DurationPickerProps) {
  return (
    <fieldset className="field">
      <legend className="field__label">Voting stays open for</legend>
      <div className="segmented">
        {POLL_DURATIONS.map((duration) => (
          <label key={duration.id} className="segmented__option">
            <input
              type="radio"
              name="duration"
              value={duration.id}
              checked={duration.id === value.id}
              disabled={disabled}
              onChange={() => onChange(duration)}
            />
            <span>{duration.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
