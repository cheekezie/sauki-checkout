import { AlertTriangle, Check, Clock, Copy } from 'lucide-react';
import { Button, ComponentLoading } from '../../../components/ui';
import { useCheckTransferStatus, useInitiateTransferPayment } from '@/features/checkout/query';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { useEffect, useRef, useState } from 'react';
import PendingBanner from './PendingBanner';
import ErrorBanner from './ErrorBanner';
import DemoPanel from './demo/DemoPanel';
import { formatCurrency } from '@/utils/formatCurrency';

const PENDING_BANNER_DURATION = 6000;

interface props {
  amount: number;
  transactionId: string;
  merchant?: string;
  customer?: string;
  onBack?: () => void;
  expiryMinutes?: number;
}

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const TransferInstructions = ({ amount, transactionId, merchant, customer, onBack, expiryMinutes = 30 }: props) => {
  const { verify } = usePaymentVerification({ amount, merchant, customer });
  const [showPending, setShowPending] = useState(false);
  const [accCopied, setAccCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(expiryMinutes * 60);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data,
    isPending: initiating,
    isFetching,
    error,
    isError,
    refetch,
  } = useInitiateTransferPayment(transactionId);
  const { mutateAsync: checkTransferStatus, isPending: checking } = useCheckTransferStatus();

  const accountDetails = data?.bankDetails;
  const isExpired = secondsLeft <= 0;

  useEffect(() => {
    if (!accountDetails) return;
    setSecondsLeft(expiryMinutes * 60);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [accountDetails, expiryMinutes]);

  const triggerPendingBanner = () => {
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    setShowPending(true);
    pendingTimer.current = setTimeout(() => setShowPending(false), PENDING_BANNER_DURATION);
  };

  const checkStatus = async () => {
    setShowPending(false);
    const res = await checkTransferStatus(transactionId);
    const status = verify(res);
    if (status === 'pending') triggerPendingBanner();
  };

  const copyAccount = async () => {
    await navigator.clipboard.writeText(accountDetails?.accountNumber ?? '');
    setAccCopied(true);
    setTimeout(() => setAccCopied(false), 2000);
  };

  const copyAmount = async () => {
    await navigator.clipboard.writeText(amount.toString());
    setAmountCopied(true);
    setTimeout(() => setAmountCopied(false), 2000);
  };

  if (initiating || isFetching) {
    return (
      <div className='flex justify-center py-8 items-center'>
        <ComponentLoading className='min-h-8!' />
      </div>
    );
  }

  if (isError || (!initiating && !accountDetails)) {
    return <ErrorBanner onRetry={refetch} onBack={onBack} message={error?.message} />;
  }

  return (
    <div>
      <div className='grid grid-cols-[100px_1fr] border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Bank</span>
        <span className='text-dark text-sm font-semibold truncate text-right'>{accountDetails?.bankName}</span>
      </div>
      <div className='grid grid-cols-[120px_1fr] items-center border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Account Number</span>
        <span className='text-dark text-sm font-semibold truncate text-right flex items-center justify-end'>
          {accountDetails?.accountNumber}
          <button className='ml-3' onClick={() => copyAccount()}>
            {accCopied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4 text-gray' />}
          </button>
        </span>
      </div>
      <div className='grid grid-cols-[130px_1fr] border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Account Name</span>
        <span className='text-dark text-sm font-semibold truncate text-right'>{accountDetails?.accountName}</span>
      </div>
      <div className='grid grid-cols-[100px_1fr] items-center border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Amount</span>
        <span className='text-dark text-sm font-semibold truncate text-right flex items-center justify-end'>
          {formatCurrency(amount)}
          <button className='ml-3' onClick={() => copyAmount()}>
            {amountCopied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4 text-gray' />}
          </button>
        </span>
      </div>

      <div
        className={`flex items-center justify-center gap-1.5 mt-6 text-xsm px-3 ${isExpired ? 'text-red-500' : secondsLeft <= 300 ? 'text-amber-500' : 'text-gray'}`}
      >
        <Clock className='w-3.5 h-3.5 shrink-0' />
        {isExpired ? (
          'This account has expired. Please go back and try again.'
        ) : (
          <span>
            Expires in <span className='font-semibold tabular-nums'>{formatTime(secondsLeft)}</span> — valid for this
            transaction only.
          </span>
        )}
      </div>

      <PendingBanner visible={showPending} />

      <Button
        type='submit'
        disabled={checking}
        loading={checking}
        loadingText='Checking...'
        className='w-full py-4 text-base mt-4'
        onClick={checkStatus}
      >
        I have sent the money
      </Button>
    </div>
  );
};

export default TransferInstructions;
