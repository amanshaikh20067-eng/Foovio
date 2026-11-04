import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'lime' | 'amber' | 'rose' | 'charcoal' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'forest',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium rounded-full',
    md: 'text-sm px-3 py-1 font-semibold rounded-full',
  };

  const variantStyles = {
    forest: 'bg-forest-100 text-forest-800 border border-forest-200',
    lime: 'bg-limeAccent-100 text-forest-900 border border-limeAccent-300 font-semibold',
    amber: 'bg-amber-100 text-amber-900 border border-amber-200',
    rose: 'bg-rose-100 text-rose-800 border border-rose-200',
    charcoal: 'bg-charcoal-100 text-charcoal-800 border border-charcoal-200',
    outline: 'bg-transparent text-charcoal-700 border border-charcoal-300',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
