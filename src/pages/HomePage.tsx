// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { type FormState, getInitialFormState } from '@/types/generator';
import { useAppSelector } from '@/store/hooks';
import PromptForm from '@/components/generator/PromptForm';
import ImageDisplay from '@/components/generator/ImageDisplay';
import { placeholderVariants } from '@/utils/placeholderVariants';
import { callTogetherApi, type ImageGenerationResult } from '@/utils/api';
import { imageModels, calculateCost } from '@/utils/modelData';
import CostCalculatorDisplay from '@/components/generator/CostCalculatorDisplay';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Card from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { base64ToBlob } from '@/utils/imageUtils'; // Import the helper
import Button from '@/components/ui/Button'; // Your Button component
import { RiSaveLine } from 'react-icons/ri';

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

  const initialFormState = getInitialFormState();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  const [previewImageBase64, setPreviewImageBase64] = useState<string | null>(null);
  const [enhancedImageBase64, setEnhancedImageBase64] = useState<string | null>(null);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isGeneratingPreview, setIsGeneratingPreview] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  const user = useAppSelector(state => state.auth.user);
  const [isSavingCover, setIsSavingCover] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

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

  const handleSaveCover = async () => {
    if (!user) {
      setError('You must be logged in to save covers.');
      return;
    }

    const imageToSaveBase64 = enhancedImageBase64 || previewImageBase64;
    if (!imageToSaveBase64) {
      setError('No image generated to save.');
      return;
    }
    if (!currentSeed) {
      setError('Image seed is not available. Cannot save reliably.');
      // Or allow saving without seed but with a warning.
      return;
    }

    setIsSavingCover(true);
    setSaveError(null);
    setSaveSuccessMessage(null);

    const currentModelId = enhancedImageBase64 ? defaultEnhanceModelId : defaultPreviewModelId;
    const currentParams = enhancedImageBase64 ? enhanceParamsConfig : previewParamsConfig;
    const sanitizedAlbumTitle =
      formState.ALBUM_TITLE.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled_album';
    const fileExtension = 'png'; // Assuming PNG from base64
    const fileName = `${Date.now()}_${sanitizedAlbumTitle}_${currentSeed}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`; // Path in Supabase storage: user_id/filename.png

    try {
      // 1. Upload image to Supabase Storage
      const imageBlob = base64ToBlob(imageToSaveBase64);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('album-covers')
        .upload(filePath, imageBlob, {
          cacheControl: '3600', // Optional
          upsert: false, // Don't upsert if file exists, generate unique name instead
        });

      if (uploadError) throw uploadError;
      if (!uploadData) throw new Error('Upload failed, no data returned.');

      // 2. Save metadata to Supabase Database
      const coverMetadata = {
        user_id: user.id,
        album_title: formState.ALBUM_TITLE || 'Untitled',
        prompt_text: generatedPrompt,
        model_id: currentModelId,
        seed: currentSeed,
        width: currentParams.width,
        height: currentParams.height,
        steps: currentParams.steps,
        guidance: currentParams.guidance,
        image_storage_path: uploadData.path, // Use the path returned by storage
        // Framework params
        framework_visual_concept: formState.VISUAL_CONCEPT,
        framework_text_placement: formState.TEXT_PLACEMENT,
        framework_typography_style: formState.TYPOGRAPHY_STYLE,
        framework_color_scheme: formState.COLOR_SCHEME,
        framework_mood_atmosphere: formState.MOOD_ATMOSPHERE,
        framework_artistic_style: formState.ARTISTIC_STYLE,
        framework_composition_details: formState.COMPOSITION_DETAILS,
        framework_technical_quality: formState.TECHNICAL_QUALITY,
      };

      const { error: insertError } = await supabase
        .from('generated_covers')
        .insert([coverMetadata]);

      if (insertError) throw insertError;

      setSaveSuccessMessage('Cover saved successfully!');
      // Optionally, clear the image or show a "Saved!" state
      // setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving cover:', error);
      setSaveError(error.message || 'Failed to save cover.');
    } finally {
      setIsSavingCover(false);
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
          {(previewImageBase64 || enhancedImageBase64) && user && (
            <Card className="!bg-primary-dark/50 !p-4">
              <Button
                onClick={handleSaveCover}
                isLoading={isSavingCover}
                disabled={isSavingCover}
                iconLeft={<RiSaveLine className="h-5 w-5" />}
                className="w-full"
                variant="primary"
              >
                Save to My Covers
              </Button>
              {saveError && <p className="mt-2 text-center text-xs text-red-400">{saveError}</p>}
              {saveSuccessMessage && (
                <p className="mt-2 text-center text-xs text-green-400">{saveSuccessMessage}</p>
              )}
            </Card>
          )}
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
