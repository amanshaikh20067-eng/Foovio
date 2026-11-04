import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'lime';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-forest-600 hover:bg-forest-700 text-white shadow-soft-sm hover:shadow-soft-md',
    secondary: 'bg-cream-200 hover:bg-cream-300 text-charcoal-800 border border-charcoal-200',
    outline: 'bg-transparent border border-forest-600 text-forest-700 hover:bg-forest-50',
    ghost: 'bg-transparent hover:bg-cream-200 text-charcoal-700',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-soft-sm',
    lime: 'bg-limeAccent-400 hover:bg-limeAccent-500 text-forest-900 font-bold shadow-soft-sm hover:shadow-glow-green',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};
