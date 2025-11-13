import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import type { PortalProps } from "../../interface";

export const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);
  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(container);
    setMounted(true);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return mounted ? createPortal(children, container) : null;
};
