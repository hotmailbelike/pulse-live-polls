import { MAX_OPTIONS, MIN_OPTIONS, OPTION_MAX_LENGTH, QUESTION_MAX_LENGTH } from './pollLimits';

export interface PollFormValues {
  question: string;
  options: string[];
}

export interface CleanPollFields {
  question: string;
  options: string[];
}

export type DraftValidation =
  | { ok: true; value: CleanPollFields }
  | { ok: false; errors: string[] };

/** Trims the form values, drops blank options and returns every problem at once. */
export function validatePollDraft(values: PollFormValues): DraftValidation {
  const question = values.question.trim();
  const options = values.options.map((option) => option.trim()).filter((option) => option.length > 0);
  const errors: string[] = [];

  if (question.length === 0) errors.push('Add a question.');
  if (question.length > QUESTION_MAX_LENGTH) {
    errors.push(`Keep the question to ${QUESTION_MAX_LENGTH} characters.`);
  }
  if (options.length < MIN_OPTIONS) errors.push(`Add at least ${MIN_OPTIONS} options.`);
  if (options.length > MAX_OPTIONS) errors.push(`Use at most ${MAX_OPTIONS} options.`);
  if (options.some((option) => option.length > OPTION_MAX_LENGTH)) {
    errors.push(`Keep each option to ${OPTION_MAX_LENGTH} characters.`);
  }

  const normalised = options.map((option) => option.toLocaleLowerCase());
  if (new Set(normalised).size !== normalised.length) errors.push('Each option must be different.');

  return errors.length === 0 ? { ok: true, value: { question, options } } : { ok: false, errors };
}
