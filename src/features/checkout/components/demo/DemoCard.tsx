import { Calendar, CreditCardIcon, KeyRound, Lock } from 'lucide-react';
import { Input } from '../../../../components/ui';
import DemoPanel from './DemoPanel';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { useProcessCheckoutDemo } from '../../query';

const PREFILL = {
  cardNumber: '5078 8000 1001 5040 631',
  expiry: '12 / 26',
  cvv: '100',
  pin: '1234',
};

interface props {
  amount: number;
  transactionId: string;
  merchant?: string;
  customer?: string;
}

const DemoCard = ({ amount, transactionId, merchant, customer }: props) => {
  return (
    <div className='space-y-4 mt-2'>
      <Input
        label='Card Number'
        name='cardNumber'
        type='text'
        value={PREFILL.cardNumber}
        onChange={() => {}}
        placeholder='0000 0000 0000 0000'
        icon={CreditCardIcon}
        disabled
      />

      <div className='grid grid-cols-1 sm:grid-cols-[60%_40%] gap-4'>
        <Input
          label='Expiry'
          name='expiry'
          type='text'
          value={PREFILL.expiry}
          onChange={() => {}}
          placeholder='MM / YY'
          icon={Calendar}
          disabled
        />
        <div className='sm:pr-4'>
          <Input
            label='CVV'
            name='cvv'
            type='text'
            value={PREFILL.cvv}
            onChange={() => {}}
            placeholder='000'
            icon={Lock}
            disabled
          />
        </div>
      </div>

      <Input
        label='Card PIN'
        name='pin'
        type='password'
        value={PREFILL.pin}
        onChange={() => {}}
        placeholder='••••'
        icon={KeyRound}
        disabled
      />

      <DemoPanel channel='CARD' transactionId={transactionId} amount={amount} merchant={merchant} customer={customer} />
    </div>
  );
};

export default DemoCard;
