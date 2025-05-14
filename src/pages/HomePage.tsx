// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import PromptForm from '@/components/generator/PromptForm';
import ImageDisplay from '@/components/generator/ImageDisplay';
import ApiKeyInput from '@/components/generator/ApiKeyInput';
import { placeholderVariants } from '@/utils/placeholderVariants';
import { callTogetherApi } from '@/utils/api';

// Define types for state
interface FormState {
  [key: string]: string;
  ALBUM_TITLE: string;
  VISUAL_CONCEPT: string;
  TEXT_PLACEMENT: string;
  TYPOGRAPHY_STYLE: string;
  COLOR_SCHEME: string;
  MOOD_ATMOSPHERE: string;
  ARTISTIC_STYLE: string;
  COMPOSITION_DETAILS: string;
  TECHNICAL_QUALITY: string;
}

const HomePage: React.FC = () => {
  const initialFormState: FormState = {
    ALBUM_TITLE: '',
    VISUAL_CONCEPT: placeholderVariants.VISUAL_CONCEPT[0],
    TEXT_PLACEMENT: placeholderVariants.TEXT_PLACEMENT[0],
    TYPOGRAPHY_STYLE: placeholderVariants.TYPOGRAPHY_STYLE[0],
    COLOR_SCHEME: placeholderVariants.COLOR_SCHEME[0],
    MOOD_ATMOSPHERE: placeholderVariants.MOOD_ATMOSPHERE[0],
    ARTISTIC_STYLE: placeholderVariants.ARTISTIC_STYLE[0],
    COMPOSITION_DETAILS: placeholderVariants.COMPOSITION_DETAILS[0],
    TECHNICAL_QUALITY: placeholderVariants.TECHNICAL_QUALITY[0],
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('togetherApiKey') || '');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('togetherApiKey', key);
  };

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

  const handleGenerate = async (type: 'preview' | 'enhance') => {
    if (!apiKey) {
      setError('Please enter your Together API Key.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setEnhancedImageUrl(null); // Clear enhanced if generating new preview
    if (type === 'preview') setPreviewImageUrl(null);

    // Inside HomePage.tsx, in handleGenerate function:
    const currentPrompt = buildPrompt(formState);
    console.log('Generating with prompt:', currentPrompt); // Already there

    try {
      const imageUrl = await callTogetherApi({
        apiKey,
        prompt: currentPrompt,
        generationType: type,
        referenceImageUrl: type === 'enhance' ? previewImageUrl : null,
        // Optionally, pass other parameters if you add them to UI/state:
        // width: 1024,
        // height: 1024,
        // steps: type === 'preview' ? 20 : 40, // Or get from state
        // guidance: type === 'enhance' ? 5 : undefined, // Or get from state
      });

      if (type === 'preview') {
        setPreviewImageUrl(imageUrl);
        setEnhancedImageUrl(null);
      } else {
        setEnhancedImageUrl(imageUrl);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during image generation.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
      <div className="bg-secondary-dark/30 glassmorphic space-y-6 rounded-xl border border-neutral-700 p-6 shadow-xl">
        <ApiKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />
        <PromptForm
          formState={formState}
          setFormState={setFormState}
          placeholderVariants={placeholderVariants}
        />
        <div className="bg-primary-dark mt-4 rounded-lg border border-neutral-600 p-4">
          <h3 className="text-accent-blue mb-2 text-sm font-semibold">Generated Prompt:</h3>
          <p className="text-text-secondary text-xs break-all">{generatedPrompt}</p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <ImageDisplay
        previewImageUrl={previewImageUrl}
        enhancedImageUrl={enhancedImageUrl}
        isLoading={isLoading}
        onGeneratePreview={() => handleGenerate('preview')}
        onEnhance={() => handleGenerate('enhance')}
      />
    </div>
  );
};

export default HomePage;
