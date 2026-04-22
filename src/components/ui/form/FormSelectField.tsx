import type { SelectProps } from '@/interface';
import { useController, useFormContext } from 'react-hook-form';
import FormSelect from '../FormSelect';

type FormSelectFieldProps = Omit<SelectProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
  name: string;
  onSelect?: (value: string) => void; // optional side-effect hook
};

/**
 * Drop-in replacement for <FormSelect> inside a <FormProvider>.
 * Reads from form context — no need to pass value/onChange/error manually.
 *
 * Usage:
 *   <FormProvider {...methods}>
 *     <FormSelectField name="bankCode" label="Bank" options={bankOptions} />
 *   </FormProvider>
 *
 * Use `onSelect` for side-effects (e.g. clearing related fields) without
 * bypassing the RHF onChange.
 */
const FormSelectField = ({ name, onSelect, ...props }: FormSelectFieldProps) => {
  const { control, clearErrors } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <FormSelect
      {...props}
      name={name}
      value={field.value ?? ''}
      onChange={(value) => {
        field.onChange(value);
        clearErrors(name);
        onSelect?.(value);
      }}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
};

export default FormSelectField;
