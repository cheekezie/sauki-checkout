import { LogoDark } from '@/assets';
import CardDetails from '@/components/Payment/CardDetails';
import TransferInstructions from '@/components/Payment/TransferInstructions';
import UssdCode from '@/components/Payment/UssdCode';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  CreditCard,
  Hash,
  Landmark,
  LockKeyholeIcon,
  QrCodeIcon,
  RefreshCcwDotIcon,
  SendHorizonalIcon,
  WalletIcon,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBankList, useGetCheckoutData, useInitiatePayment } from './query';
import { ComponentLoading } from '@/components/ui';
import CheckoutSkeleton from './components/skeleton';
import { formatCurrencyWithSymbol } from '@/utils/formatCurrency';

const ALL_PAYMENT_OPTIONS = [
  { option: 'card', icon: CreditCard, title: 'Debit Card', stage: '', methodKey: 'cards' },
  { option: 'transfer', icon: SendHorizonalIcon, title: 'Transfer', stage: '', methodKey: 'transfers' },
  { option: 'ussd', icon: Hash, title: 'USSD', stage: '', methodKey: 'ussd' },
  { option: 'wallet', icon: WalletIcon, title: 'Sauki Wallet', stage: 'beta', methodKey: 'mobileMoney' },
  { option: 'bank', icon: Landmark, title: 'Bank Branch', stage: '', methodKey: null },
  { option: 'qrcode', icon: QrCodeIcon, title: 'QR Code', stage: '', methodKey: null },
] as const;

type MethodKey = 'cards' | 'transfers' | 'ussd' | 'mobileMoney';

export default function Checkout() {
  const { ref = '' } = useParams<{ ref: string }>();

  const { data, isPending } = useGetCheckoutData(ref);

  // const { mutate, isPending } = useInitiatePayment();

  const paymentOptions = useMemo(() => {
    const methods = data?.paymentMethods;

    if (methods) {
      methods.ussd = true;
    }
    if (!methods) return [];
    return ALL_PAYMENT_OPTIONS.filter((opt) => opt.methodKey !== null && methods[opt.methodKey as MethodKey] === true);
  }, [data]);

  const firstOption = paymentOptions[0]?.option ?? '';
  const [selectedOption, setSelectedOption] = useState('');
  const [showMethodPicker, setShowMethodPicker] = useState(false);

  const activeOption = selectedOption || firstOption;

  const optionSelected = (val: string) => {
    setSelectedOption(val);
    setShowMethodPicker(false);
  };

  if (isPending) {
    return <CheckoutSkeleton />;
  }
  return (
    <>
      {/* Checkout UI */}
      <section className='flex justify-center items-center min-h-screen px-6' style={{ backgroundColor: '#E5E5E5' }}>
        <div className='mx-auto max-w-[733px] w-full mb-4'>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className=''
            >
              <div className='sm:grid grid-cols-[240px_1fr]'>
                <div className='bg-primary px-[22px] py-8'>
                  <img src={LogoDark} alt='SaukiPay Logo' className='w-30 sm:w-100 mx-auto' />
                  <div className='mt-[55px]'>
                    {paymentOptions.map((item) => (
                      <div key={item.option} className='relative'>
                        <button
                          onClick={() => optionSelected(item.option)}
                          className={`w-full items-center gap-3 relative px-3 py-5 rounded-lg hidden sm:flex transition-colors text-secondary ${
                            activeOption === item.option && 'bg-secondary flex! text-white'
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 shrink-0 text-secondary ${activeOption === item.option && 'text-white'}`}
                          />
                          <span className='text-sm'>{item.title}</span>
                          {item.stage && (
                            <span
                              className={`text-xsm uppercase bg-red-500 text-white right-10 sm:right-0
                            absolute top-1/2 -translate-y-1/2 rounded-[36px] px-2.5 py-1.5
                            ${activeOption === item.option && 'sm:right-3'}`}
                            >
                              {item.stage}
                            </span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='bg-white p-8'>
                  <div className='flex justify-between items-center mb-8'>
                    <div>
                      <img
                        src='https://dts8gjj8w0ppb.cloudfront.net/7L6UL998/logo/1689430025472-532362.png'
                        alt='Business Logo'
                        className='w-6'
                      />
                    </div>
                    <button className='text-xl text-dark'>Close</button>
                  </div>
                  <h2 className='text-dark mb-4 text-base'>Payment Summary</h2>
                  <p className='text-gray text-xsm'>
                    Below is a summary of the charges for this transaction. Please confirm the details before making
                    payment
                  </p>
                  <div className='border border-gray-light mt-4.5' />
                  <div className='my-4.5'>
                    <div className='grid grid-cols-[100px_1fr] mb-4'>
                      <span className='text-gray text-sm'>Merchant</span>
                      <span className='text-dark text-sm font-semibold truncate text-right'>{data?.businessName}</span>
                    </div>
                    <div className='grid grid-cols-[100px_1fr] mb-4'>
                      <span className='text-gray text-sm'>Customer</span>
                      <span className='text-dark text-sm font-semibold truncate text-right'>{data?.customer}</span>
                    </div>
                  </div>
                  <div className='border-2 border-gray mb-4.5' />
                  <div className='grid grid-cols-[100px_1fr] mb-4'>
                    <span className='text-gray text-sm'>Amount</span>
                    <span className='text-dark text-sm font-semibold truncate text-right'>
                      {formatCurrencyWithSymbol(data?.amount)}
                    </span>
                  </div>

                  {/* PAYMENT DETAILS */}
                  <div className='min-h-[280px]'>
                    <AnimatePresence mode='wait'>
                      <motion.div
                        key={activeOption}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <div>
                          {activeOption === 'card' && <CardDetails amount={2000} />}
                          {activeOption === 'transfer' && <TransferInstructions amount={2000} />}
                          {activeOption === 'ussd' && (
                            <UssdCode amount={data?.amount ?? 0} transactionId={data?.transID ?? ''} />
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className='flex justify-center items-center sm:hidden'>
                    <button onClick={() => setShowMethodPicker(true)} className='mt-8 text-primary flex text-base'>
                      <RefreshCcwDotIcon className='text-primary mr-3 w-5' />
                      Change payment method
                    </button>
                  </div>

                  {/* Mobile payment method picker — bottom sheet */}
                  <AnimatePresence>
                    {showMethodPicker && (
                      <>
                        <motion.div
                          key='backdrop'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className='fixed inset-0 bg-black/40 z-40 sm:hidden'
                          onClick={() => setShowMethodPicker(false)}
                        />
                        <motion.div
                          key='sheet'
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className='fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-6 pb-8 pt-4 sm:hidden'
                        >
                          <div className='flex justify-between items-center mb-4'>
                            <span className='text-dark font-semibold text-base'>Select payment method</span>
                            <button onClick={() => setShowMethodPicker(false)}>
                              <X className='w-5 h-5 text-gray-500' />
                            </button>
                          </div>
                          <div className='w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6' />
                          {paymentOptions.map((item) => (
                            <button
                              key={item.option}
                              onClick={() => optionSelected(item.option)}
                              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl mb-2 transition-colors ${
                                activeOption === item.option ? 'bg-primary text-white' : 'bg-off-white text-dark'
                              }`}
                            >
                              <item.icon
                                className={`w-5 h-5 shrink-0 ${
                                  activeOption === item.option ? 'text-white' : 'text-secondary'
                                }`}
                              />
                              <span className='text-sm font-medium'>{item.title}</span>
                              {item.stage && (
                                <span className='ml-auto text-xsm uppercase bg-red-500 text-white rounded-[36px] px-2.5 py-1'>
                                  {item.stage}
                                </span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className='text-center flex justify-center items-center mt-4 text-sm'>
                <LockKeyholeIcon className='mr-3 text-dark w-5' />
                <span className='mr-1'>Secured by</span>
                <a href='http://saukipay.net' target='_blank' rel='noopener noreferrer'>
                  Saukipay
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
