import { TextField } from '@/components/common/form/TextField';

// Liste déroulante native : options = [{ value, label }]
export function SelectField({ options, placeholder, ...props }) {
  return (
    <TextField {...props} as="select">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
}
