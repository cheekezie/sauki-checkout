import { LogoDark } from '@/assets';
import CardDetails from '@/components/Payment/CardDetails';
import TransferInstructions from '@/components/Payment/TransferInstructions';
import UssdCode from '@/components/Payment/UssdCode';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronDown,
  CreditCard,
  Hash,
  Landmark,
  LockKeyholeIcon,
  QrCodeIcon,
  RedoIcon,
  RefreshCcwDotIcon,
  SendHorizonalIcon,
  WalletIcon,
} from 'lucide-react';
import { useState } from 'react';

const PaymentOptions = [
  {
    option: 'wallet',
    icon: WalletIcon,
    title: 'Sauki Wallet',
    stage: 'beta',
    active: false,
  },
  {
    option: 'card',
    icon: CreditCard,
    title: 'Debit Card',
    stage: '',
    active: true,
  },
  {
    option: 'bank',
    icon: Landmark,
    title: 'Bank Branch',
    stage: '',
    active: false,
  },
  {
    option: 'transfer',
    icon: SendHorizonalIcon,
    title: 'Transfer',
    stage: '',
    active: true,
  },
  {
    option: 'ussd',
    icon: Hash,
    title: 'USSD',
    stage: '',
    active: true,
  },
  {
    option: 'qrcode',
    icon: QrCodeIcon,
    title: 'QR Code',
    stage: '',
    active: false,
  },
];
export default function Checkout() {
  const [option, setactiveOption] = useState('card');
  const [optionActive, setoptionActive] = useState(true);
  //   const navigate = useNavigate();

  const optionSelected = (val: string) => {
    const paymentOption = PaymentOptions.find((p) => p.option === val);
    setactiveOption(val);
    setoptionActive(paymentOption?.active ?? false);
  };
  return (
    <>
      {/* <section className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='px-4 mx-auto max-w-md w-full bg-white rounded-xl p-6 relative'>
          <div className='flex justify-between items-center'>
            <img
              src='https://dts8gjj8w0ppb.cloudfront.net/7L6UL998/logo/1689430025472-532362.png'
              alt='Business Logo'
              className='w-16 '
            />

            <span>6th February, 2024</span>
          </div>

          <div className='mt-10 text-center'>
            <h2 className='text-xl font-semibold text-gray-800'>Invoice</h2>

            <div className='mt-6 space-y-3 text-left'>
              <p className='text-gray-600'>
                <span className='font-medium text-gray-800'>Merchant:</span> Sauki Resources
              </p>

              <p className='text-gray-600'>
                <span className='font-medium text-gray-800'>Description:</span> Wallet Top-up Service
              </p>

              <p className='text-gray-600'>
                <span className='font-medium text-gray-800'>Amount Due:</span> ₦25,000
              </p>
            </div>


            <button
              onClick={() => setShowCheckout(true)}
              className='mt-8 w-full py-3 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors'
            >
              Pay ₦25,000 Now
            </button>
          </div>
        </div>
      </section> */}

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
                    {PaymentOptions.map((item) => (
                      <div key={item.option} className='relative'>
                        <button
                          onClick={() => optionSelected(item.option)}
                          className={`w-full items-center gap-3 relative px-3 py-5 rounded-lg hidden sm:flex transition-colors text-secondary ${
                            option === item.option && 'bg-secondary flex! text-white'
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 shrink-0 text-secondary ${option === item.option && 'text-white'}`}
                          />
                          <span className='text-sm'>{item.title}</span>
                          {item.stage && (
                            <span
                              className={`text-xsm uppercase bg-red-500 text-white right-10 sm:right-0
                            absolute top-1/2 -translate-y-1/2 rounded-[36px] px-2.5 py-1.5 
                            ${option === item.option && 'sm:right-3'}`}
                            >
                              {item.stage}
                            </span>
                          )}
                          <ChevronDown
                            className={`w-5 h-5 text-secondary absolute block sm:hidden top-1/2 -translate-y-1/2 right-3 ${
                              option === item.option && 'text-white'
                            }`}
                          />
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
                      <span className='text-gray text-sm'>Merchant ID</span>
                      <span className='text-dark text-sm font-semibold truncate text-right'>7Central Inc.</span>
                    </div>
                    <div className='grid grid-cols-[100px_1fr] mb-4'>
                      <span className='text-gray text-sm'>Description</span>
                      <span className='text-dark text-sm font-semibold truncate text-right'>Port clearance duty</span>
                    </div>
                  </div>
                  <div className='border-2 border-gray mb-4.5' />
                  <div className='grid grid-cols-[100px_1fr] mb-4'>
                    <span className='text-gray text-sm'>Amount</span>
                    <span className='text-dark text-sm font-semibold truncate text-right'>N200,000.00</span>
                  </div>

                  {/* PAYMENT DETAILS */}
                  {!optionActive && (
                    <div className='bg-off-white py-8 px-6 text-center rounded-2xl flex flex-col justify-center items-center'>
                      <AlertTriangle className='text-orange-400' />
                      <p className='text-dark mt-4'>Payment option not available</p>
                    </div>
                  )}
                  {optionActive && (
                    <div>
                      {option === 'card' && <CardDetails amount={2000} />}
                      {option === 'transfer' && <TransferInstructions amount={2000} />}
                      {option === 'ussd' && <UssdCode amount={2000} />}
                    </div>
                  )}

                  <div className='flex justify-center items-center sm:hidden'>
                    <button className='mt-8 text-primary flex text-base'>
                      <RefreshCcwDotIcon className='text-primary mr-3 w-5' />
                      Change payment method
                    </button>
                  </div>
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
