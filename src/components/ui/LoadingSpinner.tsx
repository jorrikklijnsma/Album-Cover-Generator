// src/components/ui/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Generating...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`border-accent-blue animate-spin rounded-full border-solid border-t-transparent ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-text-secondary mt-3 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
