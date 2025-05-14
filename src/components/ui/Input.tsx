// src/components/ui/Input.tsx
import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  error,
  iconLeft,
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const baseInputStyles =
    'block w-full rounded-lg border-0 py-2.5 px-3 bg-primary-dark/80 text-text-primary shadow-sm ring-1 ring-inset ring-neutral-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-accent-blue sm:text-sm sm:leading-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const iconPadding = iconLeft ? 'pl-10' : 'px-3';

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-text-secondary mb-1 block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {iconLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {iconLeft}
          </div>
        )}
        <input
          type={type}
          id={inputId}
          className={`${baseInputStyles} ${iconPadding} ${error ? 'ring-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
