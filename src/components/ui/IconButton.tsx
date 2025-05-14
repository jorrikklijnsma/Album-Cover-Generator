// src/components/ui/IconButton.tsx
import React from 'react';
import Tooltip from './Tooltip'; // Assuming you'll create this or use a library

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'ghost' | 'danger'; // Added variants
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  className = '',
  size = 'md',
  variant = 'ghost',
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const variantClasses = {
    primary: 'bg-accent-blue text-white hover:bg-accent-blue/90 disabled:bg-accent-blue/50',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-neutral-700/60 disabled:text-neutral-500',
    danger: 'text-red-500 hover:text-red-400 hover:bg-red-900/30 disabled:text-red-500/50',
  };

  const baseStyles =
    'cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-primary-dark focus:ring-accent-blue transition-colors disabled:cursor-not-allowed disabled:opacity-70';

  const buttonContent = (
    <button
      type="button"
      className={`${baseStyles} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span className="sr-only">{tooltip || 'icon button'}</span>
    </button>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{buttonContent}</Tooltip>;
  }

  return buttonContent;
};

export default IconButton;
