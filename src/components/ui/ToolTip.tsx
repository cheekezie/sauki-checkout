import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import type { TooltipProps } from "../../interface";

export const ToolTip: React.FC<TooltipProps> = ({ label, children, placement = 'right', delay = 150 }) => {
  const [visible, setVisible] = useState(true);
  let timeout: ReturnType<typeof setTimeout>;

  const show = () => {
    timeout = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  const positions = {
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
  };

  return (
    <div className='relative inline-block' onMouseEnter={show} onMouseLeave={hide}>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 whitespace-nowrap px-3 py-2 rounded-lg shadow-md text-xs font-medium bg-slate-800 text-white ${positions[placement]}`}
          >
            {label}
            <span
              className={`absolute w-2 h-2 bg-slate-800 rotate-45 ${
                placement === 'right'
                  ? 'left-[-4px] top-1/2 -translate-y-1/2'
                  : placement === 'left'
                  ? 'right-[-4px] top-1/2 -translate-y-1/2'
                  : placement === 'top'
                  ? 'bottom-[-4px] left-1/2 -translate-x-1/2'
                  : 'top-[-4px] left-1/2 -translate-x-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
