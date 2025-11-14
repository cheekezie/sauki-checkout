import { LogoDark } from '@/assets';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Hash, HouseIcon, QrCodeIcon, SendHorizonalIcon, WalletIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentOptions = [
  {
    option: 'wallet',
    icon: WalletIcon,
    title: 'Sauki Wallet',
    stage: 'beta',
  },
  {
    option: 'card',
    icon: CreditCard,
    title: 'Debit Card',
    stage: '',
  },
  {
    option: 'bank',
    icon: HouseIcon,
    title: 'Bank Branch',
    stage: '',
  },
  {
    option: 'transfer',
    icon: SendHorizonalIcon,
    title: 'Transfer',
    stage: '',
  },
  {
    option: 'ussd',
    icon: Hash,
    title: 'USSD',
    stage: '',
  },
  {
    option: 'qrcode',
    icon: QrCodeIcon,
    title: 'QR Code',
    stage: '',
  },
];
export default function Checkout() {
  const [activeOption, setactiveOption] = useState('card');
  const navigate = useNavigate();

  const optionSelected = (option: string) => {
    setactiveOption(option);
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
      <section className='flex justify-center items-center min-h-screen' style={{ backgroundColor: '#E5E5E5' }}>
        <div className='mx-auto max-w-[733px] w-full bg-white rounded-xl'>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className=''
            >
              <div className='grid grid-cols-[240px_1fr]'>
                <div className='bg-primary px-[22px] py-8'>
                  <img src={LogoDark} alt='SaukiPay Logo' className='w-100' />
                  <div>
                    {PaymentOptions.map((item) => (
                      <div key={item.option} className='relative'>
                        <button
                          onClick={() => optionSelected(item.option)}
                          className={`w-full flex items-center gap-3 px-3 py-5 rounded-lg transition-colors text-secondary ${
                            activeOption === item.option && 'bg-secondary text-white'
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 shrink-0 text-secondary ${
                              activeOption === item.option && 'text-white'
                            }`}
                          />
                          <span className='text-sm'>{item.title}</span>
                          {item.stage && (
                            <span className='text-xsm uppercase text-red-500 absolute right-1 top-1/2 -translate-y-1/2'>
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
                  <p className='text-gray-stroke text-xsm'>
                    Lorem ipsum dolor sit amet consectetur. Pharetra dui ac quisque fringilla et magna sodales.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
