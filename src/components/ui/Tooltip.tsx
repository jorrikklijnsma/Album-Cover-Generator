// src/components/ui/Tooltip.tsx
import React from 'react';

interface TooltipProps {
  children: React.ReactElement; // Expects a single child element to attach the tooltip to
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = '',
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={`group/tooltip relative flex ${className}`}>
      {children}
      <div
        className={`absolute ${positionClasses[position]} pointer-events-none z-50 w-max max-w-xs rounded-md bg-neutral-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/tooltip:opacity-100`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
