// src/components/ui/Select.tsx
import React, { useId } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  options: { value: string | number; label: string; disabled?: boolean }[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  containerClassName = '',
  id,
  placeholder,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  const baseSelectStyles =
    'block w-full appearance-none rounded-lg border-0 py-2.5 pl-3 pr-10 bg-primary-dark/80 text-text-primary shadow-sm ring-1 ring-inset ring-neutral-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-accent-blue sm:text-sm sm:leading-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-text-secondary mb-1 block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`${baseSelectStyles} ${error ? 'ring-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-secondary-dark text-text-primary"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <RiArrowDownSLine className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
