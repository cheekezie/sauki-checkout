import { LogoDark } from '@/assets';
import logoLight from '@/assets/logo-light.svg';
import PayForm, { type PayFormValues } from './components/PayForm';
import { useGetPaymentLinkPublic, useInitiatePayment } from './query';
import { type PaymentLink } from './api';
import { formatCurrencyWithSymbol } from '@/utils/formatCurrency';
import { AlertCircle, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ─── Skeletons ────────────────────────────────────────────────────────────────
const LeftSkeleton = () => (
  <div className='animate-pulse space-y-6'>
    <div className='h-8 w-36 bg-white/20 rounded-lg' />
    <div className='space-y-3 mt-12'>
      <div className='h-4 w-24 bg-white/20 rounded' />
      <div className='h-12 w-48 bg-white/30 rounded-lg' />
      <div className='h-4 w-32 bg-white/20 rounded mt-2' />
    </div>
    <div className='space-y-2 mt-8'>
      <div className='h-3 w-full bg-white/15 rounded' />
      <div className='h-3 w-4/5 bg-white/15 rounded' />
      <div className='h-3 w-3/5 bg-white/15 rounded' />
    </div>
  </div>
);

const RightSkeleton = () => (
  <div className='animate-pulse space-y-6'>
    <div className='space-y-2'>
      <div className='h-7 w-48 bg-slate-200 rounded' />
      <div className='h-4 w-64 bg-slate-200 rounded' />
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className='space-y-2'>
        <div className='h-3.5 w-24 bg-slate-200 rounded' />
        <div className='h-11 w-full bg-slate-200 rounded-lg' />
      </div>
    ))}
    <div className='h-11 w-full bg-slate-200 rounded-lg mt-2' />
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-green-500/20 text-green-100 border border-green-400/30',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-500/20 text-red-100 border border-red-400/30',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-slate-500/20 text-slate-100 border border-slate-400/30',
  },
};

const LinkStatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status?.toLowerCase()] ?? statusConfig.active;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

// ─── Shared states ────────────────────────────────────────────────────────────

const UnavailableBanner = ({ reason }: { reason: string }) => (
  <div className='flex flex-col items-center justify-center py-12 text-center gap-4'>
    <AlertCircle className='w-12 h-12 text-red-400' />
    <div>
      <p className='text-lg font-semibold text-gray-800'>Link Unavailable</p>
      <p className='text-sm text-muted-foreground mt-1'>{reason}</p>
    </div>
  </div>
);

// ─── Left panel details ───────────────────────────────────────────────────────

const LeftDetails = ({ link }: { link: PaymentLink }) => (
  <div className='space-y-6'>
    <div>
      <p className='text-white/60 text-xs font-medium uppercase tracking-widest mb-1'>Payment Request</p>
      <h2 className='text-white text-2xl font-bold leading-snug'>{link.title}</h2>
      {link.description && <p className='text-white/70 text-sm mt-2 leading-relaxed'>{link.description}</p>}
    </div>

    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15'>
      <p className='text-white/60 text-xs mb-1'>Amount</p>
      <p className='text-white text-4xl font-bold tracking-tight'>
        {formatCurrencyWithSymbol(link.amount, link.currency ?? 'NGN')}
      </p>
      <div className='mt-3 flex items-center gap-2'>
        <LinkStatusBadge status={link.status ?? 'active'} />
        {link.isOneTime && <span className='text-white/50 text-xs'>· Single use</span>}
      </div>
    </div>

    <div className='flex items-center gap-2 text-white/50 text-xs'>
      <Shield className='w-3.5 h-3.5' />
      <span>Secured by Sauki Pay</span>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const PayPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();

  const { data: link, isLoading, error } = useGetPaymentLinkPublic(slug);
  const { mutate, isPending } = useInitiatePayment();

  useEffect(() => {
    const label = link?.title || link?.description;
    if (label) document.title = `Pay | ${label}`;
  }, [link]);

  const onSubmit = async (values: PayFormValues) => {
    mutate({ slug, payload: values });
  };

  const isUnavailable = !isLoading && !error && !link;

  return (
    <div className='flex min-h-screen overflow-hidden'>
      {/* ── Left panel ── */}
      <div className='hidden lg:flex lg:w-2/5 bg-linear-to-br from-secondary to-secondary/80 flex-col p-10 relative overflow-hidden'>
        <div className='absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5' />
        <div className='absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/5' />

        <img src={logoLight} alt='Sauki Pay' className='w-28 h-auto relative z-10' />

        <div className='flex-1 flex flex-col justify-center relative z-10'>
          {isLoading ? (
            <LeftSkeleton />
          ) : !link ? (
            <div className='flex flex-col gap-3'>
              <AlertCircle className='w-10 h-10 text-white/60' />
              <p className='text-white/70 text-sm'>Unable to load link details.</p>
            </div>
          ) : (
            <LeftDetails link={link} />
          )}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className='flex-1 lg:w-3/5 flex flex-col min-h-screen overflow-y-auto bg-white'>
        <div className='lg:hidden flex items-center gap-3 p-6 border-b border-slate-100'>
          <img src={LogoDark} alt='Sauki Pay' className='w-24 h-auto' />
        </div>

        <main className='flex-1 flex items-center justify-center px-6 py-10'>
          <div className='w-full max-w-md'>
            {isLoading ? (
              <RightSkeleton />
            ) : error ? (
              <UnavailableBanner reason={(error as any)?.message ?? 'Could not load this payment link.'} />
            ) : isUnavailable ? (
              <UnavailableBanner reason={`This payment link is expired. It can no longer accept payments.`} />
            ) : link ? (
              <PayForm link={link} isPending={isPending} onSubmit={onSubmit} />
            ) : (
              <UnavailableBanner reason='Payment link not found.' />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PayPage;
