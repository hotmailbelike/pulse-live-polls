export function formatVoteCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? 'vote' : 'votes'}`;
}
