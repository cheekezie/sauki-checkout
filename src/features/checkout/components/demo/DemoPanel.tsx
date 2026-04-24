import Button from '@/components/ui/Button';
import { useProcessCheckoutDemo } from '@/features/checkout/query';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { FlaskConical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChekoutDemoPayloadI } from '../../api';
import PendingBanner from '../PendingBanner';

interface props {
  channel: ChekoutDemoPayloadI['channel'];
  transactionId: string;
  amount: number;
  merchant?: string;
  customer?: string;
}

const PENDING_BANNER_DURATION = 10;

const DemoPanel = ({ channel, transactionId, amount, merchant, customer }: props) => {
  const { mutateAsync: simulate, isPending } = useProcessCheckoutDemo();
  const { verify } = usePaymentVerification({ amount, merchant, customer });
  const [showPending, setShowPending] = useState(false);
  const [simulatingStatus, setSimulatingStatus] = useState<ChekoutDemoPayloadI['status'] | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = async (status: ChekoutDemoPayloadI['status']) => {
    setSimulatingStatus(status);
    const res = await simulate({ channel, transID: transactionId, status });
    setSimulatingStatus(null);

    const verifyStatus = verify(res);

    if (verifyStatus === 'pending') triggerPendingBanner();
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

  return (
    <>
      <PendingBanner visible={showPending} />
      <div className='mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4'>
        <div className='flex items-center gap-2 mb-1 justify-center'>
          <FlaskConical className='w-4 h-4 text-amber-600' />
          <span className='text-amber-700 text-sm font-semibold'>Demo Mode</span>
        </div>
        <p className='text-amber-600 text-xsm mb-4 text-center'>
          Simulate a payment outcome without a real transaction.
        </p>
        <div className='flex gap-3'>
          <Button
            onClick={() => run('FAIL')}
            disabled={isPending}
            loading={isPending && simulatingStatus === 'FAIL'}
            loadingText='Simulating...'
            variant='danger'
            className='flex-1 py-2.5'
          >
            Simulate Fail
          </Button>
          <Button
            onClick={() => run('SUCCESS')}
            disabled={isPending}
            loading={isPending && simulatingStatus === 'SUCCESS'}
            loadingText='Simulating...'
            // variant='primary'
            className='flex-1 py-2.5 '
          >
            Simulate Success
          </Button>
        </div>
      </div>
    </>
  );
};

export default DemoPanel;
