import { LogoIcon } from '@/assets';
import { formatCurrencyWithSymbol } from '@/utils/formatCurrency';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { CheckCircle2, Download, ExternalLink, LockKeyholeIcon, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface CheckoutStatusState {
  status: string;
  amount?: number;
  merchant?: string;
  customer?: string;
  redirectUrl?: string;
}

const REDIRECT_DELAY = 10;
const CIRCUMFERENCE = 2 * Math.PI * 20; // r=20

export default function StatusPage() {
  const location = useLocation();
  const state = location.state as CheckoutStatusState | null;

  const [countdown, setCountdown] = useState(REDIRECT_DELAY);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSuccess = state?.status === 'success';
  const hasRedirect = Boolean(state?.redirectUrl);

  useEffect(() => {
    if (!hasRedirect) return;

    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current!);
          window.location.href = state!.redirectUrl!;
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hasRedirect]);

  const downloadReceipt = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const date = new Date().toLocaleString('en-NG', { dateStyle: 'long', timeStyle: 'short' });

    // Header band
    doc.setFillColor(20, 64, 73); // secondary
    doc.rect(0, 0, W, 72, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 212, 125); // primary
    doc.text('SaukiPay', W / 2, 44, { align: 'center' });

    // Title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Receipt', W / 2, 112, { align: 'center' });

    // Status badge background
    doc.setFillColor(209, 250, 229);
    doc.roundedRect(W / 2 - 64, 124, 128, 24, 12, 12, 'F');
    doc.setFontSize(10);
    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Successful', W / 2, 140, { align: 'center' });

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(48, 168, W - 48, 168);

    // Rows
    const rows: [string, string][] = [];
    if (state?.merchant) rows.push(['Merchant', state.merchant]);
    if (state?.customer) rows.push(['Customer', state.customer]);
    if (state?.amount !== undefined) rows.push(['Amount Paid', formatCurrencyWithSymbol(state.amount)]);
    rows.push(['Date', date]);
    rows.push(['Status', 'Successful']);

    let y = 196;
    rows.forEach(([label, value]) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(label, 48, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text(value, W - 48, y, { align: 'right' });
      doc.setDrawColor(243, 244, 246);
      doc.line(48, y + 10, W - 48, y + 10);
      y += 36;
    });

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text('This is an automatically generated receipt. Please keep it for your records.', W / 2, y + 40, { align: 'center' });
    doc.text('saukipay.net', W / 2, y + 56, { align: 'center' });

    doc.save(`saukipay-receipt-${Date.now()}.pdf`);
  };

  const progress = hasRedirect ? ((REDIRECT_DELAY - countdown) / REDIRECT_DELAY) * CIRCUMFERENCE : 0;

  return (
    <section className='flex justify-center items-center min-h-screen px-6' style={{ backgroundColor: '#E5E5E5' }}>
      <div className='mx-auto max-w-[480px] w-full my-4'>
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
            {/* Status icon */}
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
            {(state?.amount || state?.merchant || state?.customer) && (
              <div className='w-full mt-6 rounded-lg bg-off-white px-5 py-4 space-y-3 text-left'>
                {state.merchant && (
                  <div className='flex justify-between'>
                    <span className='text-gray text-sm'>Merchant</span>
                    <span className='text-dark text-sm font-semibold'>{state.merchant}</span>
                  </div>
                )}
                {state.customer && (
                  <div className='flex justify-between'>
                    <span className='text-gray text-sm'>Customer</span>
                    <span className='text-dark text-sm font-semibold'>{state.customer}</span>
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
            <div className='w-full mt-8'>
              {hasRedirect ? (
                <div className='flex flex-col items-center gap-5'>
                  {/* Countdown ring */}
                  <div className='relative flex items-center justify-center'>
                    <svg width='52' height='52' className='-rotate-90'>
                      <circle cx='26' cy='26' r='20' fill='none' stroke='#e5e7eb' strokeWidth='3' />
                      <circle
                        cx='26'
                        cy='26'
                        r='20'
                        fill='none'
                        stroke={isSuccess ? '#22c55e' : '#ef4444'}
                        strokeWidth='3'
                        strokeLinecap='round'
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={CIRCUMFERENCE - progress}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <span
                      className='absolute text-sm font-bold tabular-nums'
                      style={{ color: isSuccess ? '#16a34a' : '#dc2626' }}
                    >
                      {countdown}
                    </span>
                  </div>

                  <p className='text-gray text-sm'>
                    Redirecting you in{' '}
                    <span className={`font-semibold tabular-nums ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                      {countdown}s
                    </span>
                  </p>

                  <a
                    href={state!.redirectUrl}
                    className='flex items-center gap-1.5 text-sm text-secondary underline underline-offset-2'
                  >
                    Go now <ExternalLink className='w-3.5 h-3.5' />
                  </a>
                </div>
              ) : (
                <div className='space-y-3'>
                  {isSuccess && (
                    <button
                      onClick={downloadReceipt}
                      className='w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors'
                    >
                      <Download className='w-4 h-4' />
                      Download Receipt
                    </button>
                  )}
                  <button
                    onClick={() => {
                      window.location.href = 'https://saukipay.net';
                    }}
                    className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                      isSuccess
                        ? 'border border-gray-200 text-dark hover:bg-gray-50'
                        : 'bg-secondary text-white hover:bg-secondary/90'
                    }`}
                  >
                    Return Home
                  </button>
                </div>
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
