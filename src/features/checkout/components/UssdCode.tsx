import { useEffect, useRef, useState } from 'react';
import { Button, ComponentLoading, Select } from '../../../components/ui';
import { Check, Clock, Copy, Info, Landmark } from 'lucide-react';
import { useCheckUssdStatus, useGetBankList, useInitiateUssdPayment } from '@/features/checkout/query';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { AnimatePresence, motion } from 'framer-motion';
import PendingBanner from './PendingBanner';
import ErrorBanner from './ErrorBanner';

interface prop {
  amount: number;
  transactionId: string;
  merchant?: string;
  onBack?: () => void;
}

const PENDING_BANNER_DURATION = 6000;

const UssdCode = ({ amount, transactionId, merchant, onBack }: prop) => {
  const [code, setCode] = useState('');
  const [bank, setBank] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isPending: isLoadingBanks, isError: bankError } = useGetBankList();
  const { mutateAsync: mutateUssd, isPending: initiating, isError: initError, error, reset: resetUssd } = useInitiateUssdPayment();
  const { mutateAsync: mutateCheckStatus, isPending: checking } = useCheckUssdStatus();
  const { verify } = usePaymentVerification({ amount, merchant });

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bankChanged = async (val: string) => {
    setBank(val);
    const selected = data?.find((d) => d.code === val);
    const res = await mutateUssd({
      bankCode: val,
      bank: selected?.name ?? '',
      transID: transactionId,
    });

    if (res.data.status) {
      setCode(res.data.ussdCode);
      setMessage(res.data.supportMessage);
    }
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

  const checkStatus = async () => {
    setShowPending(false);
    const res = await mutateCheckStatus(transactionId);
    const status = verify(res);
    if (status === 'pending') triggerPendingBanner();
  };

  if (isLoadingBanks || initiating) {
    return (
      <div className='flex justify-center py-8 items-center'>
        <ComponentLoading className='min-h-8!' />
      </div>
    );
  }

  if (initError) {
    return (
      <ErrorBanner
        message={error.message}
        onRetry={() => {
          resetUssd();
          setBank('');
        }}
        onBack={onBack}
      />
    );
  }

  return (
    <div className='mt-10'>
      <Select
        label='Bank'
        name='Bank'
        labelKey='name'
        valueKey='code'
        value={bank}
        onChange={(value) => bankChanged(value)}
        options={data ?? []}
        placeholder='-- Please select --'
        icon={Landmark}
        disabled={initiating || checking}
      />
      {code && (
        <div className='flex mt-8 justify-center items-center border-b border-b-gray-light bg-off-white px-5 py-4'>
          <span className='text-dark text-sm font-semibold'>{code}</span>
          <button onClick={copyCode} className='ml-3'>
            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4 text-gray' />}
          </button>
        </div>
      )}
      {message && (
        <div className='flex items-start gap-3 mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3'>
          <Info className='w-4 h-4 text-blue-500 shrink-0 mt-0.5' />
          <p className='text-blue-700 text-sm'>{message}</p>
        </div>
      )}

      <PendingBanner visible={showPending} />

      {code && (
        <Button
          type='submit'
          disabled={checking}
          loading={checking}
          loadingText='Checking...'
          className='w-full py-4 text-base mt-8'
          onClick={checkStatus}
        >
          I have sent the money
        </Button>
      )}
    </div>
  );
};

export default UssdCode;
