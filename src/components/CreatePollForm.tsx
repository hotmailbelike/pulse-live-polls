import { useRef, useState, type FormEvent } from 'react';
import { CharacterCount } from './CharacterCount';
import { DurationPicker } from './DurationPicker';
import { FormErrors } from './FormErrors';
import { OptionFields } from './OptionFields';
import { DEFAULT_DURATION, type PollDuration } from '../lib/pollDurations';
import { MIN_OPTIONS, QUESTION_MAX_LENGTH } from '../lib/pollLimits';
import type { OptionDraft, PollDraft } from '../lib/types';
import { validatePollDraft } from '../lib/validatePollDraft';

interface CreatePollFormProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  submitError: string | null;
  onSubmit: (draft: PollDraft) => void;
}

const QUESTION_INPUT_ID = 'poll-question';
const QUESTION_COUNT_ID = 'poll-question-count';
const ERRORS_ID = 'create-poll-errors';

function createEmptyOptions(nextKey: () => number): OptionDraft[] {
  return Array.from({ length: MIN_OPTIONS }, () => ({ key: nextKey(), value: '' }));
}

export function CreatePollForm({ isSubmitting, isDisabled, submitError, onSubmit }: CreatePollFormProps) {
  const keyCounter = useRef(0);
  const nextKey = () => {
    keyCounter.current += 1;
    return keyCounter.current;
  };

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<OptionDraft[]>(() => createEmptyOptions(nextKey));
  const [duration, setDuration] = useState<PollDuration>(DEFAULT_DURATION);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const errors = submitError === null ? validationErrors : [...validationErrors, submitError];
  const isLocked = isSubmitting || isDisabled;

  const updateOption = (index: number, value: string) => {
    setOptions((current) => current.map((option, i) => (i === index ? { ...option, value } : option)));
  };
  const addOption = () => setOptions((current) => [...current, { key: nextKey(), value: '' }]);
  const removeOption = (index: number) => {
    setOptions((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validatePollDraft({ question, options: options.map((option) => option.value) });
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);
    onSubmit({ ...validation.value, durationMs: duration.ms });
  };

  return (
    <form
      className="card create-form"
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={errors.length > 0 ? ERRORS_ID : undefined}
    >
      <div className="field">
        <div className="field__label-row">
          <label className="field__label" htmlFor={QUESTION_INPUT_ID}>
            Question
          </label>
          <CharacterCount id={QUESTION_COUNT_ID} length={question.length} max={QUESTION_MAX_LENGTH} />
        </div>
        <textarea
          id={QUESTION_INPUT_ID}
          className="input input--question"
          value={question}
          maxLength={QUESTION_MAX_LENGTH}
          rows={2}
          placeholder="What should we cover next?"
          disabled={isLocked}
          aria-describedby={QUESTION_COUNT_ID}
          onChange={(event) => setQuestion(event.target.value.replace(/\n/g, ' '))}
        />
      </div>

      <OptionFields
        options={options}
        disabled={isLocked}
        onChange={updateOption}
        onAdd={addOption}
        onRemove={removeOption}
      />

      <DurationPicker value={duration} disabled={isLocked} onChange={setDuration} />

      <FormErrors id={ERRORS_ID} errors={errors} />

      <button type="submit" className="button button--primary button--block" disabled={isLocked}>
        {isSubmitting ? 'Creating poll…' : 'Create poll'}
      </button>
    </form>
  );
}
