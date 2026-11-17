interface CharacterCountProps {
  id: string;
  length: number;
  max: number;
}

const NEAR_LIMIT_RATIO = 0.85;

export function CharacterCount({ id, length, max }: CharacterCountProps) {
  const isNearLimit = length >= max * NEAR_LIMIT_RATIO;
  return (
    <span id={id} className={`char-count${isNearLimit ? ' char-count--near' : ''}`}>
      {length}/{max}
    </span>
  );
}
