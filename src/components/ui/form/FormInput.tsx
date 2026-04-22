import { useController, useFormContext } from 'react-hook-form';
import Input from '../Input';
import type { InputProps } from '@/interface';

type FormInputProps = Omit<InputProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
  name: string;
  /** Optional side-effect called after RHF onChange — use for clearing related fields etc. */
  onValueChange?: (value: string) => void;
};

/**
 * Drop-in replacement for <Input> inside a <FormProvider>.
 * Reads from form context — no need to pass value/onChange/error manually.
 *
 * Usage:
 *   <FormProvider {...methods}>
 *     <FormInput name="email" label="Email" />
 *   </FormProvider>
 */
const FormInput = ({ name, onValueChange, ...props }: FormInputProps) => {
  const { control, clearErrors } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <Input
      {...props}
      name={name}
      value={field.value ?? ''}
      onChange={(value) => {
        field.onChange(value);
        clearErrors(name);
        onValueChange?.(value);
      }}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
};

export default FormInput;
