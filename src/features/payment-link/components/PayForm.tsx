import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/form/FormInput';

import { formatCurrencyWithSymbol } from '@/utils/formatCurrency';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Lock, Shield } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { PaymentLink } from '../api';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required').min(7, 'Enter a valid phone number'),
});

export type PayFormValues = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

interface PayFormProps {
  link: PaymentLink;
  isPending: boolean;
  onSubmit: (values: PayFormValues) => Promise<void>;
}

const PayForm = ({ link, isPending, onSubmit }: PayFormProps) => {
  const methods = useForm<PayFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { fullName: '', email: '', phoneNumber: '' },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = methods;

  const handleFormSubmit = async (values: PayFormValues) => {
    try {
      await onSubmit(values);
    } catch (error: any) {
      setError('root', {
        message: error?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Complete Payment</h1>
        <p className='text-muted-foreground text-sm mt-1'>Fill in your details below to proceed.</p>
      </div>

      {/* Mobile payment summary */}
      <div className='lg:hidden bg-secondary/5 border border-secondary/20 rounded-xl p-4 mb-6'>
        <p className='text-xs text-muted-foreground mb-0.5'>{link.title}</p>
        <p className='text-xl font-bold text-secondary'>
          {formatCurrencyWithSymbol(link.amount, link.currency ?? 'NGN')}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate autoComplete='on' className='space-y-5'>
        <FormInput name='fullName' label='Full Name' placeholder='John Doe' required autoComplete='name' />

        <FormInput
          name='email'
          label='Email Address'
          type='email'
          placeholder='john@example.com'
          required
          autoComplete='email'
        />

        <FormInput
          name='phoneNumber'
          label='Phone Number'
          type='tel'
          placeholder='+234 800 000 0000'
          required
          autoComplete='tel'
        />

        {errors.root && (
          <div className='flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200'>
            <AlertCircle className='w-4 h-4 text-red-500 mt-0.5 shrink-0' />
            <p className='text-sm text-red-700'>{errors.root.message}</p>
          </div>
        )}

        <Button
          type='submit'
          disabled={isPending || !isValid}
          loading={isPending}
          loadingText='Processing...'
          className='w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 rounded-xl mt-2 flex items-center justify-center gap-2'
        >
          <Lock className='w-4 h-4' />
          Pay {formatCurrencyWithSymbol(link.amount, link.currency ?? 'NGN')}
        </Button>

        <p className='text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5'>
          <Shield className='w-3.5 h-3.5' />
          Your information is encrypted and secure
        </p>
      </form>
    </FormProvider>
  );
};

export default PayForm;
