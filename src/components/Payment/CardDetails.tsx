import { useFormValidation } from '@/hooks';
import { Calendar, CreditCardIcon, Lock } from 'lucide-react';
import { useState } from 'react';
import { Button, Input } from '../ui';
import Form from '../ui/Form';

interface props {
  amount: number;
}
const CardDetails = ({ amount }: props) => {
  const [isLoading] = useState(false);
  const { formData, isValid, errors, updateField } = useFormValidation({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleSubmit = () => {};

  return (
    <div>
      <Form onSubmit={handleSubmit} isValid={isValid} className='space-y-6'>
        <Input
          label='Card Number'
          name='cardNumber'
          type='text'
          autoComplete='cc-number'
          value={formData.cardNumber as string}
          onChange={(value) => updateField('cardNumber', value)}
          placeholder='0000 0000 0000 0000'
          icon={CreditCardIcon}
          error={errors.cardNumber}
        />

        <div className='grid grid-cols-1 md:grid-cols-[60%_40%] gap-4'>
          <Input
            label='Expiry'
            name='expiry'
            type='text'
            mask='MM / YYYY'
            expiryDate={true}
            autoComplete='cc-exp'
            value={formData.expiry as string}
            onChange={(value) => updateField('expiry', value)}
            placeholder='MM / YY'
            icon={Calendar}
            error={errors.expiry}
          />

          <div className='pr-4'>
            <Input
              label='CVV'
              name='cvv'
              type='text'
              maxLength={3}
              autoComplete='cc-csc'
              value={formData.cvv as string}
              onChange={(value) => updateField('cvv', value)}
              placeholder='000'
              icon={Lock}
              error={errors.cvv}
            />
          </div>
        </div>

        <Button type='submit' disabled={isLoading} className='w-full py-4 text-base'>
          {isLoading ? 'Processing...' : 'Pay N' + amount}
        </Button>
      </Form>
    </div>
  );
};

export default CardDetails;
