import { FirebaseError } from 'firebase/app';

export interface FirestoreErrorCopy {
  /** Shown for any error without more specific copy below. */
  fallback: string;
  /** Rules rejections mean different things per screen, so each caller words its own. Defaults to `fallback`. */
  permissionDenied?: string;
}

/** Turns SDK errors into copy a poll creator or voter can act on. */
export function describeFirestoreError(error: unknown, copy: FirestoreErrorCopy): string {
  if (!(error instanceof FirebaseError)) return copy.fallback;
  switch (error.code) {
    case 'permission-denied':
      return copy.permissionDenied ?? copy.fallback;
    case 'unavailable':
      return 'You appear to be offline. Check your connection and try again.';
    case 'resource-exhausted':
      return 'The demo has hit its free daily quota. Please try again tomorrow.';
    default:
      return copy.fallback;
  }
}
