import type { ReactNode } from 'react';
import type React from 'react';

interface prop {
  children: ReactNode;
  className?: string;
  isValid?: boolean;
  onSubmit: (ev: React.FormEvent) => void;
  onInvalid?: () => void;
}
const Form = ({ children, onSubmit, isValid, onInvalid, className }: prop) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValid === false) {
      onInvalid?.();
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export default Form;
