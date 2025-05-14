// src/components/generator/CostCalculatorDisplay.tsx
import React from 'react';
import { imageModels } from '@/utils/modelData';
import { RiMoneyDollarCircleLine, RiInformationLine } from 'react-icons/ri';

interface CostCalculatorDisplayProps {
  cost: number | null;
  modelId: string; // To display model notes
}

const CostCalculatorDisplay: React.FC<CostCalculatorDisplayProps> = ({ cost, modelId }) => {
  const modelInfo = imageModels.find(m => m.id === modelId);

  return (
    <div className="bg-secondary-dark rounded-lg border border-neutral-600 p-4 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-md text-text-primary flex items-center font-semibold">
          <RiMoneyDollarCircleLine className="text-accent-green mr-2 h-5 w-5" />
          Estimated Cost
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
