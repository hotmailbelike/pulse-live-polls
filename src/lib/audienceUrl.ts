import { audiencePath } from './routes';

export function buildAudienceUrl(pollId: string): string {
  return `${window.location.origin}${audiencePath(pollId)}`;
}

/** The URL without its scheme, short enough to read off a projector. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
