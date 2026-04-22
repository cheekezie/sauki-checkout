import { LogoIcon } from '@/assets';
import { formatCurrencyWithSymbol } from '@/utils/formatCurrency';
import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, LockKeyholeIcon, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface CheckoutStatusState {
  status: 'success' | 'fail';
  amount?: number;
  merchant?: string;
  redirectUrl?: string;
}

const REDIRECT_DELAY = 10;

export default function StatusPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutStatusState | null;

  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  const isSuccess = state?.status === 'success';

  useEffect(() => {
    if (!state?.redirectUrl) return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          window.location.href = state.redirectUrl!;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state?.redirectUrl]);

  const handleClose = () => {
    window.location.href = 'https://saukipay.net';
  };

  const handleReturnHome = () => {
    window.location.href = 'https://saukipay.net';
  };

  return (
    <section className='flex justify-center items-center min-h-screen px-6' style={{ backgroundColor: '#E5E5E5' }}>
      <div className='mx-auto max-w-[480px] w-full mb-4'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className='bg-white rounded-xl overflow-hidden'
        >
          {/* Logo header */}
          <div className='bg-primary px-8 py-5 flex justify-center'>
            <img src={LogoIcon} alt='SaukiPay' className='h-8 w-8' />
          </div>

          <div className='px-8 py-10 flex flex-col items-center text-center'>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35, ease: 'backOut' }}
            >
              {isSuccess ? (
                <CheckCircle2 className='w-16 h-16 text-green-500' strokeWidth={1.5} />
              ) : (
                <XCircle className='w-16 h-16 text-red-500' strokeWidth={1.5} />
              )}
            </motion.div>

            <h2 className='text-dark text-lg font-semibold mt-5'>
              {isSuccess ? 'Payment Successful' : 'Payment Failed'}
            </h2>
            <p className='text-gray text-sm mt-2'>
              {isSuccess
                ? 'Your payment has been confirmed and processed.'
                : 'We could not process your payment. Please try again.'}
            </p>

            {/* Summary */}
            {(state?.amount || state?.merchant) && (
              <div className='w-full mt-6 rounded-lg bg-off-white px-5 py-4 space-y-3 text-left'>
                {state.merchant && (
                  <div className='flex justify-between'>
                    <span className='text-gray text-sm'>Merchant</span>
                    <span className='text-dark text-sm font-semibold'>{state.merchant}</span>
                  </div>
                )}
                {state.amount !== undefined && (
                  <div className='flex justify-between'>
                    <span className='text-gray text-sm'>Amount</span>
                    <span className='text-dark text-sm font-semibold'>{formatCurrencyWithSymbol(state.amount)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className='w-full mt-8 space-y-3'>
              {state?.redirectUrl ? (
                <div className='flex flex-col items-center gap-2'>
                  <p className='text-gray text-sm'>
                    Redirecting in{' '}
                    <span className={`font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                      {countdown}s
                    </span>
                  </p>
                  <a
                    href={state.redirectUrl}
                    className='flex items-center gap-2 text-sm text-secondary underline underline-offset-2'
                  >
                    Go now <ExternalLink className='w-3.5 h-3.5' />
                  </a>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleReturnHome}
                    className='w-full py-3 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors'
                  >
                    Return to Home
                  </button>
                  <button
                    onClick={handleClose}
                    className='w-full py-3 rounded-lg border border-gray-200 text-dark text-sm font-semibold hover:bg-gray-50 transition-colors'
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className='text-center flex justify-center items-center mt-4 text-sm'>
          <LockKeyholeIcon className='mr-2 text-dark w-4' />
          <span className='mr-1'>Secured by</span>
          <a href='https://saukipay.net' target='_blank' rel='noopener noreferrer'>
            Saukipay
          </a>
        </div>
      </div>
    </section>
  );
}
