import { DEFAULT_DURATION } from './pollDurations';
import type { PollDraft } from './types';

export function buildDemoPoll(): PollDraft {
  return {
    question: 'Which framework do you reach for first?',
    options: ['React', 'Vue', 'Svelte', 'Angular', 'Solid', 'Plain HTML, thanks'],
    durationMs: DEFAULT_DURATION.ms,
  };
}
