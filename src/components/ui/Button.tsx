import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingText?: string;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 border border-transparent disabled:hover:bg-primary',
  secondary:
    'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 border border-transparent disabled:hover:bg-secondary',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent disabled:hover:bg-red-600',
  ghost: 'bg-transparent text-foreground-700 hover:bg-border-100 focus:ring-primary/20 disabled:hover:bg-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Spinner = () => (
  <svg
    className='animate-spin w-4 h-4 shrink-0'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
  </svg>
);

const Button = ({
  children,
  className = '',
  fullWidth = true,
  variant = 'secondary',
  size = 'md',
  loading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50';

  const classes = [fullWidth ? 'w-full' : '', baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button {...props} disabled={disabled || loading} className={classes}>
      {loading && <Spinner />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
};

export default Button;
