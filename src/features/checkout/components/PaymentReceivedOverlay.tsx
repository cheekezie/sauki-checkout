import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine, Check, Landmark } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  visible: boolean;
  onComplete: () => void;
}

const ICON_SWITCH_DELAY = 900;
const NAVIGATE_DELAY = 2400;

const PaymentReceivedOverlay = ({ visible, onComplete }: Props) => {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowCheck(false);
      return;
    }
    const t1 = setTimeout(() => setShowCheck(true), ICON_SWITCH_DELAY);
    const t2 = setTimeout(onComplete, NAVIGATE_DELAY);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className='flex flex-col items-center justify-center py-10'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className='flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border-2 border-green-200'
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          >
            <AnimatePresence mode='wait'>
              {!showCheck ? (
                <motion.span
                  key='inflow'
                  className='relative flex items-center justify-center'
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25 }}
                >
                  <Landmark className='w-8 h-8 text-green-500' strokeWidth={1.6} />
                  <span className='absolute -bottom-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-green-500'>
                    <ArrowDownToLine className='w-2.5 h-2.5 text-white' strokeWidth={2.5} />
                  </span>
                </motion.span>
              ) : (
                <motion.span
                  key='check'
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <Check className='w-8 h-8 text-green-500' strokeWidth={2.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            className='mt-4 text-base font-semibold text-gray-800'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            Payment received!
          </motion.p>
          <motion.p
            className='mt-1 text-sm text-gray-400'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
          >
            Completing your transaction…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentReceivedOverlay;
