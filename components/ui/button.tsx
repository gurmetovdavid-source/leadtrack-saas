import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'rounded-lg px-4 py-2 font-medium transition-colors';
  const styles = {
    primary: 'bg-primary text-white hover:bg-opacity-90',
    danger: 'bg-danger text-white hover:bg-opacity-90',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
