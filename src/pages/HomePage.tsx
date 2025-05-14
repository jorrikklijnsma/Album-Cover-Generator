// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { type FormState, getInitialFormState } from '@/types/generator';

import PromptForm from '@/components/generator/PromptForm';
import ImageDisplay from '@/components/generator/ImageDisplay';
import { placeholderVariants } from '@/utils/placeholderVariants';
import { callTogetherApi, type ImageGenerationResult } from '@/utils/api';
import { imageModels, calculateCost } from '@/utils/modelData';
import CostCalculatorDisplay from '@/components/generator/CostCalculatorDisplay';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Card from '@/components/ui/Card';

const COST_CONFIRMATION_THRESHOLD_CENTS = 4; // 4 cents

const HomePage: React.FC = () => {
  // Get settings from Redux store
  const {
    apiKey,
    defaultPreviewModelId,
    defaultEnhanceModelId,
    previewParamsConfig,
    enhanceParamsConfig,
  } = useAppSelector(state => state.settings);

  const initialFormState = getInitialFormState(); // Use the imported function
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  const [previewImageBase64, setPreviewImageBase64] = useState<string | null>(null);
  const [enhancedImageBase64, setEnhancedImageBase64] = useState<string | null>(null);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isGeneratingPreview, setIsGeneratingPreview] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  const buildPrompt = (currentFormState: FormState): string => {
    let prompt = `Album cover artwork featuring [VISUAL_CONCEPT]. The title "[ALBUM_TITLE]" appears [TEXT_PLACEMENT] rendered in [TYPOGRAPHY_STYLE]. [COLOR_SCHEME] creates [MOOD_ATMOSPHERE]. [ARTISTIC_STYLE] with [COMPOSITION_DETAILS]. [TECHNICAL_QUALITY].`;
    for (const key in currentFormState) {
      prompt = prompt.replace(`[${key}]`, currentFormState[key]);
    }
    return prompt;
  };

  useEffect(() => {
    setGeneratedPrompt(buildPrompt(formState));
  }, [formState]);

  const [expectedCost, setExpectedCost] = useState<number | null>(null);
  const [showCostConfirmation, setShowCostConfirmation] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const generateNewSeed = () => Math.floor(Math.random() * 4294967296);

  const handleActualGeneration = async (type: 'preview' | 'enhance') => {
    if (!apiKey) {
      // API Key from Redux
      setError('API Key not set. Please configure it in settings.');
      return;
    }
    setError(null);
    if (type === 'preview') setIsGeneratingPreview(true);
    else setIsEnhancing(true);

    const seedToUse = currentSeed && type === 'enhance' ? currentSeed : generateNewSeed();

    const currentPrompt = buildPrompt(formState);
    const modelToUse = type === 'preview' ? defaultPreviewModelId : defaultEnhanceModelId;
    const paramsToUse = type === 'preview' ? previewParamsConfig : enhanceParamsConfig;

    // Ensure currentSeed is updated with the seed being used for this generation
    setCurrentSeed(seedToUse);

    try {
      const result: ImageGenerationResult = await callTogetherApi({
        apiKey,
        prompt: currentPrompt,
        modelId: modelToUse,
        width: paramsToUse.width,
        height: paramsToUse.height,
        steps: paramsToUse.steps,
        guidance: paramsToUse.guidance,
        seed: seedToUse,
      });

      if (type === 'preview') {
        setPreviewImageBase64(result.imageDataBase64);
        setEnhancedImageBase64(null); // Clear enhanced if new preview
      } else {
        setEnhancedImageBase64(result.imageDataBase64);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during image generation.');
      console.error(err);
    } finally {
      if (type === 'preview') setIsGeneratingPreview(false);
      else setIsEnhancing(false);
    }
  };

  const preGenerationCheck = (type: 'preview' | 'enhance') => {
    const modelId = type === 'preview' ? defaultPreviewModelId : defaultEnhanceModelId;
    const params = type === 'preview' ? previewParamsConfig : enhanceParamsConfig;
    const costForOperation = calculateCost(modelId, params.width, params.height, params.steps);

    setExpectedCost(costForOperation); // Set this for the modal

    if (costForOperation !== null && costForOperation > COST_CONFIRMATION_THRESHOLD_CENTS) {
      setConfirmAction(() => () => handleActualGeneration(type));
      setShowCostConfirmation(true);
    } else {
      handleActualGeneration(type);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {!apiKey && (
            <div className="mb-4 rounded-lg bg-yellow-800/30 p-3 text-sm text-yellow-300">
              API Key not set. Please configure it in the settings panel (gear icon in header).
            </div>
          )}

          <div className="bg-primary-dark/50 mb-6 rounded-lg border border-neutral-700 p-3">
            <p className="text-text-secondary text-xs">
              Using default models & parameters configured in Settings:
            </p>
            <p className="text-text-primary text-sm">
              Preview:{' '}
              <span className="text-accent-blue font-semibold">
                {imageModels.find(m => m.id === defaultPreviewModelId)?.name ||
                  defaultPreviewModelId}
              </span>
            </p>
            <p className="text-text-primary text-sm">
              Enhance:{' '}
              <span className="text-accent-pink font-semibold">
                {imageModels.find(m => m.id === defaultEnhanceModelId)?.name ||
                  defaultEnhanceModelId}
              </span>
            </p>
          </div>

          <PromptForm
            formState={formState}
            setFormState={setFormState}
            placeholderVariants={placeholderVariants}
          />
          <Card className="bg-primary-dark/70 mt-6 !p-4">
            <h3 className="text-accent-blue mb-2 text-sm font-semibold">Generated Prompt:</h3>
            <p className="text-text-secondary text-xs break-all">{generatedPrompt}</p>
          </Card>
          {error && (
            <p className="mt-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-500">{error}</p>
          )}
        </Card>

        <div className="sticky top-24 space-y-6 lg:col-span-1">
          <ImageDisplay
            previewImageBase64={previewImageBase64}
            enhancedImageBase64={enhancedImageBase64}
            isPreviewLoading={isGeneratingPreview}
            isEnhanceLoading={isEnhancing}
            albumName={formState.ALBUM_TITLE}
            onGeneratePreview={() => preGenerationCheck('preview')}
            onEnhance={() => preGenerationCheck('enhance')}
          />
          <CostCalculatorDisplay
            activeModelId={defaultPreviewModelId}
            activeParams={previewParamsConfig}
            operationTypeLabel="Default Preview"
          />
        </div>
      </div>
      {showCostConfirmation && (
        <ConfirmationModal
          isOpen={showCostConfirmation}
          title="Cost Confirmation"
          message={`The estimated cost for this generation is ${(expectedCost! / 100).toFixed(4)} USD (${expectedCost?.toFixed(2)} cents). Do you want to proceed?`}
          onConfirm={() => {
            if (confirmAction) confirmAction();
            setShowCostConfirmation(false);
            setConfirmAction(null);
          }}
          onCancel={() => {
            setShowCostConfirmation(false);
            setConfirmAction(null);
          }}
        />
      )}
    </>
  );
};

export default HomePage;
