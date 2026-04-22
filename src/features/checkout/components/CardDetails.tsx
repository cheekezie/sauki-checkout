import { useEffect, useRef, useState } from 'react';
import { useFormValidation } from '@/hooks';
import { useCheckCard3dsStatus, useInitiateCardPayment } from '@/features/checkout/query';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { Calendar, CreditCardIcon, KeyRound, Lock } from 'lucide-react';
import CardBrandBadge from './CardBrandBadge';
import { detectCardType } from '@/utils/cardDetection';
import { Button, Input } from '../../../components/ui';
import Form from '../../../components/ui/Form';
import { formatCurrencyWithSymbol } from '@/utils/formatCurrency';
import PendingBanner from './PendingBanner';
import ErrorBanner from './ErrorBanner';

interface props {
  amount: number;
  transactionId: string;
  merchant?: string;
  onBack?: () => void;
}

const PENDING_BANNER_DURATION = 10;

const CardDetails = ({ amount, transactionId, merchant, onBack }: props) => {
  const [view, setView] = useState<'card' | 'otp'>('card');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showPending, setShowPending] = useState(false);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { formData, isValid, errors, updateField } = useFormValidation({
    cardNumber: '',
    expiry: '',
    cvv: '',
    pin: '',
  });

  const {
    mutateAsync: initCardPayment,
    isPending: initiating,
    isError: initError,
    error,
    reset: resetInit,
  } = useInitiateCardPayment();
  const { mutateAsync: checkCard3ds, isPending: verifying } = useCheckCard3dsStatus();
  const { verify } = usePaymentVerification({ amount, merchant });

  const requiredError = (field: keyof typeof formData, label: string) => {
    if (submitAttempted && !formData[field]) return `${label} is required`;
    return errors[field];
  };

  const expiryError = () => {
    const val = formData.expiry as string;
    if (!val) return submitAttempted ? 'Expiry is required' : undefined;
    const [mm, yyyy] = val.split('/').map((s) => s.trim());
    const month = parseInt(mm, 10);
    const year = parseInt(yyyy, 10);
    if (mm.length === 2 && month > 12) return 'Month must be between 01 and 12';
    if (yyyy?.length === 4 && year < new Date().getFullYear()) return 'Card has expired';
    return errors.expiry;
  };

  const handleCardSubmit = async () => {
    const rawNumber = (formData.cardNumber as string).replace(/\s/g, '');
    const [expiryMonth = '', year = ''] = (formData.expiry as string).split('/').map((s) => s.trim());
    const expiryYear = year.slice(-2); // "26"

    const res = await initCardPayment({
      number: rawNumber,
      expiryMonth,
      expiryYear,
      cvv: formData.cvv as string,
      pin: formData.pin as string,
      transID: transactionId,
    });

    if (res.data.status) {
      setView('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted.length) return;
    e.preventDefault();
    const digits = [...pasted.split(''), ...Array(6 - pasted.length).fill('')];
    setOtp(digits);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleOtpSubmit = async () => {
    const res = await checkCard3ds({ transID: transactionId, otp: otp.join('') });
    const status = verify(res);
    if (status === 'pending') triggerPendingBanner();
  };

  const triggerPendingBanner = () => {
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    setShowPending(true);
    pendingTimer.current = setTimeout(() => setShowPending(false), PENDING_BANNER_DURATION);
  };

  useEffect(
    () => () => {
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    },
    [],
  );

  const otpComplete = otp.every((d) => d !== '');

  if (initError) {
    return (
      <ErrorBanner
        message={error.message}
        onRetry={() => {
          resetInit();
          setSubmitAttempted(false);
        }}
        onBack={onBack}
      />
    );
  }

  if (view === 'otp') {
    return (
      <div className='mt-8'>
        <p className='text-dark text-sm font-semibold mb-1'>Enter OTP</p>
        <p className='text-gray text-xsm mb-6'>Enter the 6-digit code sent to you to complete your payment.</p>
        <div className='flex gap-3 justify-center' onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                otpRefs.current[i] = el;
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className='w-11 h-13 text-center text-dark text-lg font-semibold border border-gray-light rounded-lg focus:outline-none focus:border-primary bg-off-white'
            />
          ))}
        </div>
        <Button
          type='button'
          disabled={!otpComplete || verifying}
          loading={verifying}
          loadingText='Verifying...'
          className='w-full py-4 text-base mt-8'
          onClick={handleOtpSubmit}
        >
          Verify Payment
        </Button>
        <button onClick={() => setView('card')} className='w-full text-center text-gray text-sm mt-4 hover:underline'>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div>
      <Form
        onSubmit={handleCardSubmit}
        isValid={isValid}
        onInvalid={() => setSubmitAttempted(true)}
        className='space-y-4'
      >
        <Input
          label='Card Number'
          name='cardNumber'
          type='text'
          autoComplete='cc-number'
          value={formData.cardNumber as string}
          onChange={(value) => updateField('cardNumber', value)}
          placeholder='0000 0000 0000 0000'
          icon={CreditCardIcon}
          rightElement={<CardBrandBadge type={detectCardType(formData.cardNumber as string)} />}
          error={requiredError('cardNumber', 'Card number')}
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
            error={expiryError()}
          />
          <div className='md:pr-4'>
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
              error={requiredError('cvv', 'CVV')}
            />
          </div>
        </div>

        <Input
          label='Card PIN'
          name='pin'
          type='password'
          maxLength={4}
          value={formData.pin as string}
          onChange={(value) => updateField('pin', value)}
          placeholder='••••'
          icon={KeyRound}
          error={requiredError('pin', 'Card PIN')}
        />
        <PendingBanner visible={showPending} />

        <Button
          type='submit'
          disabled={initiating}
          loading={initiating}
          loadingText='Processing...'
          className='w-full py-4 text-base mt-2'
        >
          {`Pay ${formatCurrencyWithSymbol(amount)}`}
        </Button>
      </Form>
    </div>
  );
};

export default CardDetails;
