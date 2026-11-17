interface FormErrorsProps {
  id: string;
  errors: readonly string[];
}

export function FormErrors({ id, errors }: FormErrorsProps) {
  if (errors.length === 0) return null;
  return (
    <div id={id} className="form-errors" role="alert">
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
