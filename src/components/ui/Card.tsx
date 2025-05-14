// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  actions?: React.ReactNode; // For buttons or other elements in the card header
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  titleClassName = 'text-lg font-semibold text-text-primary mb-4',
  actions,
}) => {
  const baseCardStyles =
    'bg-secondary-dark rounded-xl shadow-xl glassmorphic border border-neutral-700 p-6';

  return (
    <div className={`${baseCardStyles} ${className}`}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className={titleClassName}>{title}</h2>}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
