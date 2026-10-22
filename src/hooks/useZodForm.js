import { useCallback, useState } from 'react';

// Premier message d'erreur Zod pour chaque champ
function fieldErrors(zodError) {
  const errors = {};
  for (const issue of zodError.issues) {
    const field = issue.path[0];
    if (field !== undefined && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export function useZodForm(schema, initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, type, value, checked } = event.target;
      setValue(name, type === 'checkbox' ? checked : value);
    },
    [setValue]
  );

  // Valide une partie du formulaire (ex : une étape) avec un autre schéma
  const validate = (partialSchema = schema) => {
    const result = partialSchema.safeParse(values);
    setErrors(result.success ? {} : fieldErrors(result.error));
    return result.success;
  };

  const handleSubmit = (onValid) => async (event) => {
    event?.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      setErrors(fieldErrors(result.error));
      return;
    }
    setSubmitting(true);
    try {
      await onValid(result.data);
    } finally {
      setSubmitting(false);
    }
  };

  // Props à étaler sur un champ : <TextField {...field('email')} />
  const field = (name) => ({
    name,
    id: name,
    value: values[name] ?? '',
    onChange: handleChange,
    error: errors[name],
  });

  return {
    values,
    errors,
    submitting,
    setValue,
    setValues,
    setErrors,
    validate,
    handleChange,
    handleSubmit,
    field,
  };
}
