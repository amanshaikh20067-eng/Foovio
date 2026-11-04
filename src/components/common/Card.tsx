import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'forest' | 'subtle' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-white border border-charcoal-200/80 shadow-soft-sm rounded-2xl',
    forest: 'bg-forest-600 text-white border border-forest-500 shadow-soft-md rounded-2xl',
    subtle: 'bg-cream-200/70 border border-charcoal-200/60 rounded-2xl',
    elevated: 'bg-white border border-charcoal-200 shadow-soft-md hover:shadow-soft-lg transition-shadow duration-300 rounded-2xl',
    glass: 'glass-panel rounded-2xl shadow-soft-sm',
  };

  return (
    <div className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};
