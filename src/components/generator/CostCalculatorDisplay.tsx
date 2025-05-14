// src/components/generator/CostCalculatorDisplay.tsx
import React from 'react';
import { imageModels, calculateCost } from '@/utils/modelData';
import { RiMoneyDollarCircleLine, RiInformationLine } from 'react-icons/ri';
import { GenerationParams } from '@/store/settingsSlice'; // Import GenerationParams

interface CostCalculatorDisplayProps {
  activeModelId: string; // The model ID to calculate cost for
  activeParams: GenerationParams; // The parameters to use for calculation
  operationTypeLabel?: string; // e.g., "For Preview" or "For Enhance"
}

const CostCalculatorDisplay: React.FC<CostCalculatorDisplayProps> = ({
  activeModelId,
  activeParams,
  operationTypeLabel = 'For Next Operation', // Default label
}) => {
  const modelInfo = imageModels.find(m => m.id === activeModelId);
  const cost = modelInfo
    ? calculateCost(activeModelId, activeParams.width, activeParams.height, activeParams.steps)
    : null;

  return (
    <div className="bg-secondary-dark rounded-lg border border-neutral-600 p-4 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-md text-text-primary flex items-center font-semibold">
          <RiMoneyDollarCircleLine className="text-accent-green mr-2 h-5 w-5" />
          Estimated Cost{' '}
          <span className="text-text-secondary ml-1 text-xs">({operationTypeLabel})</span>
        </h3>
        {cost !== null ? (
          <p className={`text-lg font-bold ${cost > 0 ? 'text-accent-pink' : 'text-accent-green'}`}>
            {cost === 0 ? 'Free' : `${(cost / 100).toFixed(4)} USD`}
            {cost > 0 && (
              <span className="text-text-secondary ml-1 text-xs">({cost.toFixed(2)} cents)</span>
            )}
          </p>
        ) : (
          <p className="text-text-secondary text-sm">Unavailable</p>
        )}
      </div>
      {modelInfo?.notes && (
        <p className="text-text-secondary mt-1 flex items-start text-xs">
          <RiInformationLine className="text-accent-blue mt-0.5 mr-1 h-4 w-4 flex-shrink-0" />
          <span>{modelInfo.notes}</span>
        </p>
      )}
      <p className="text-text-secondary mt-2 text-xs">
        Note: Pro models require credits and Build Tier 2+. Costs are estimates.
      </p>
    </div>
  );
};

export default CostCalculatorDisplay;
