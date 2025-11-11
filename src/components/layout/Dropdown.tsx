import { motion } from 'framer-motion';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DropdownProps } from '../../interface';

const Dropdown: React.FC<DropdownProps> = ({ triggerRef, isOpen, onClose, children, placement = 'bottom' }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; actualPlacement: string } | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  // Compute dropdown position BEFORE render to prevent flicker
  useLayoutEffect(() => {
    if (!triggerRef.current || !isOpen) {
      setPosition(null);
      setIsPositioned(false);
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Decide placement dynamically
    const preferredPlacement =
      placement === 'auto'
        ? rect.bottom + 250 > viewportHeight // if not enough space below
          ? 'top'
          : 'bottom'
        : placement;

    const gap = 10; // space between trigger and dropdown
    const triggerWidth = rect.width;
    const dropdownWidth = Math.max(triggerWidth, 300); // ensure minimum 300px width

    let top = 0;
    let left = 0;

    switch (preferredPlacement) {
      case 'top':
        top = rect.top - 250 - gap;
        left = rect.left;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left;
        break;
      case 'right':
        top = rect.top;
        left = rect.right + gap;
        break;
      case 'left':
        top = rect.top;
        left = rect.left - dropdownWidth - gap;
        break;
    }

    // Prevent overflow on small screens
    top = Math.max(8, Math.min(top, viewportHeight - 280));
    left = Math.max(8, Math.min(left, viewportWidth - dropdownWidth - 8));

    setPosition({ top, left, width: dropdownWidth, actualPlacement: preferredPlacement });
    setIsPositioned(true);
  }, [isOpen, triggerRef, placement]);
  // Outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // Don't render until position is calculated
  if (!isOpen || !position || !isPositioned) return null;

  return createPortal(
    <>
      {/* 🔲 Backdrop */}
      <motion.div
        className='fixed inset-0 z-40 bg-black/40'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* 🩶 Dropdown */}
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: position.actualPlacement === 'top' ? -8 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position.actualPlacement === 'top' ? -8 : 8 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          width: position.width,
          zIndex: 50,
        }}
        className='bg-white shadow-xl border border-slate-200/60 rounded-xl overflow-hidden'
      >
        {children}
      </motion.div>
    </>,
    document.body
  );
};

export default Dropdown;
