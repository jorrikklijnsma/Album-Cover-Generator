// src/components/ui/Button.tsx
import React from 'react';
import { RiLoader4Line } from 'react-icons/ri';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'fancy';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  hasIconAnimation?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeft,
  iconRight,
  hasIconAnimation = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'cursor-pointer font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark transition-all inline-flex items-center justify-center shadow-sm disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-accent-blue text-white hover:bg-accent-blue/90 focus:ring-accent-blue disabled:bg-accent-blue/50',
    secondary:
      'bg-accent-pink hover:bg-accent-pink/80 focus:ring-offset-primary-dark focus:ring-accent-pink disabled:bg-accent-pink-700/50 text-white ',
    fancy:
      'from-accent-pink to-accent-blue hover:from-accent-pink/80 hover:to-accent-blue/80 focus:ring-offset-secondary-dark focus:ring-accent-pink disabled:opacity-50 bg-gradient-to-r text-white ',

    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-600/50',
    ghost:
      'bg-transparent text-text-primary hover:bg-neutral-700/50 focus:ring-neutral-500 disabled:text-text-secondary',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const animatingIconStyles = {
    wrapper: 'group',
    icon: isLoading ? 'animate-bounce' : 'group-hover:animate-bounce',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${hasIconAnimation && animatingIconStyles.wrapper}`;

  return (
    <button
      type={props.type || 'button'}
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <RiLoader4Line className="mr-2 h-5 w-5 animate-spin" />}
      {!isLoading && iconLeft && (
        <span className={`mr-2 ${hasIconAnimation && animatingIconStyles.icon}`}>{iconLeft}</span>
      )}
      {children}
      {!isLoading && iconRight && (
        <span className={`ml-2 ${hasIconAnimation && animatingIconStyles.icon}`}>{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
