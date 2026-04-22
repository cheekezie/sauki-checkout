import { AnimatePresence, motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface prop {
  visible: boolean;
}
const PendingBanner = ({ visible }: prop) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key='pending-banner'
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className='flex items-start gap-3 mt-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3'
        >
          <Clock className='w-4 h-4 text-amber-500 shrink-0 mt-0.5' />
          <p className='text-amber-700 text-sm'>
            Your payment is still being processed. Please wait a moment and try again.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PendingBanner;
