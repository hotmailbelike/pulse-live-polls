import { useEffect, useRef } from 'react';
import { CharacterCount } from './CharacterCount';
import { MAX_OPTIONS, MIN_OPTIONS, OPTION_MAX_LENGTH } from '../lib/pollLimits';
import type { OptionDraft } from '../lib/types';

interface OptionFieldsProps {
  options: readonly OptionDraft[];
  disabled: boolean;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

type PendingFocus = { kind: 'option'; key: number } | { kind: 'last' } | null;

export function OptionFields({ options, disabled, onChange, onAdd, onRemove }: OptionFieldsProps) {
  const canRemove = options.length > MIN_OPTIONS;
  const canAdd = options.length < MAX_OPTIONS;
  const inputsByKey = useRef(new Map<number, HTMLInputElement>());
  const pendingFocus = useRef<PendingFocus>(null);

  // Removing a row, or adding the last allowed one, unmounts the focused button. Focus moves to the
  // input that takes its place (or the new one) so keyboard users keep their position in the form.
  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null) return;
    pendingFocus.current = null;
    const focusKey = target.kind === 'option' ? target.key : options.at(-1)?.key;
    if (focusKey !== undefined) inputsByKey.current.get(focusKey)?.focus();
  }, [options]);

  const removeOption = (index: number) => {
    const neighbor = options[index + 1] ?? options[index - 1];
    pendingFocus.current = neighbor === undefined ? null : { kind: 'option', key: neighbor.key };
    onRemove(index);
  };

  const addOption = () => {
    pendingFocus.current = { kind: 'last' };
    onAdd();
  };

  return (
    <fieldset className="field">
      <legend className="field__label">
        Options <span className="field__hint">{MIN_OPTIONS} to {MAX_OPTIONS}</span>
      </legend>
      <ol className="option-fields">
        {options.map((option, index) => {
          const position = index + 1;
          const inputId = `option-${position}`;
          const countId = `${inputId}-count`;
          return (
            <li key={option.key} className="option-fields__row">
              <label className="visually-hidden" htmlFor={inputId}>
                Option {position}
              </label>
              <div className="input-with-count">
                <input
                  ref={(element) => {
                    if (element === null) inputsByKey.current.delete(option.key);
                    else inputsByKey.current.set(option.key, element);
                  }}
                  id={inputId}
                  className="input"
                  value={option.value}
                  maxLength={OPTION_MAX_LENGTH}
                  placeholder={`Option ${position}`}
                  disabled={disabled}
                  aria-describedby={countId}
                  onChange={(event) => onChange(index, event.target.value)}
                />
                <CharacterCount id={countId} length={option.value.length} max={OPTION_MAX_LENGTH} />
              </div>
              {canRemove && (
                <button
                  type="button"
                  className="icon-button"
                  disabled={disabled}
                  onClick={() => removeOption(index)}
                  aria-label={`Remove option ${position}`}
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {canAdd && (
        <button type="button" className="button button--ghost" disabled={disabled} onClick={addOption}>
          + Add option
        </button>
      )}
    </fieldset>
  );
}
