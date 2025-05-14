// src/utils/api.ts
import Together from 'together-ai';
import { imageModels } from './modelData';

export interface ImageGenerationResult {
  imageDataBase64: string; // Changed from imageUrl
  seed: number; // We will now always send and thus "know" the seed
}

interface CallTogetherApiOptions {
  apiKey: string;
  prompt: string;
  modelId: string;
  referenceImageUrl?: string | null; // This will be base64 if enhancing a preview
  referenceImageSeed?: number | null; // If you want to pass the seed of the reference image
  width: number;
  height: number;
  steps: number;
  guidance: number;
  seed: number; // Client-generated seed
  negativePrompt?: string;
}

export async function callTogetherApi({
  apiKey,
  prompt,
  modelId,
  // referenceImageUrl, // This parameter needs to be re-thought if it's for img2img from base64
  width,
  height,
  steps,
  guidance,
  seed, // Now a required parameter
  negativePrompt = 'text, watermark, blurry, ugly, deformed, noisy, malformed hands, messy, low quality, artifacts',
}: CallTogetherApiOptions): Promise<ImageGenerationResult> {
  if (!apiKey) throw new Error('API Key is required.');

  const together = new Together({ apiKey });

  const selectedModelInfo = imageModels.find(m => m.id === modelId);
  if (!selectedModelInfo) {
    throw new Error(`Model with ID ${modelId} not found in configuration.`);
  }

  const requestBody: Parameters<typeof together.images.create>[0] = {
    model: modelId,
    prompt,
    negative_prompt: negativePrompt,
    width,
    height,
    steps,
    n: 1,
    response_format: 'base64',
    guidance,
    seed, // Pass the client-generated seed
  };

  // Handling referenceImageUrl for img2img models (like FLUX.1-canny, FLUX.1-depth, or Pro for refinement)
  // The 'image_url' parameter in Together API expects a URL.
  // If you have a base64 preview and want to use it as a reference for a Pro model (img2img style),
  // you'd typically upload the base64 preview to a temporary host (or your own backend that returns a URL)
  // and then pass *that* URL to `image_url`.
  // For simplicity now, if `referenceImageUrl` is provided and it's a base64 string,
  // we'll assume the selected `modelId` *cannot* directly take base64 for `image_url`.
  // This part needs careful handling based on how Pro models use `image_url`.
  // If FLUX Pro models can take a previous image as a style reference via URL, this is where it'd go.
  // For now, let's remove `referenceImageUrl` from this direct API call and handle img2img chaining separately if needed.
  // Or, if `FLUX.1.1-pro` uses `image_url` for refinement from a URL, we'd need the preview to be a URL.
  // Given the CORS issue, getting a URL from the preview model is problematic without a proxy.
  // Sticking to base64 output simplifies the preview stage.
  // "Enhance" might mean "re-generate with same seed and prompt on a Pro model with more steps".

  console.log(`Calling Together API with model: ${modelId}`, requestBody);

  try {
    const response = await together.images.create(requestBody);
    console.log('Together API Response:', response);

    if (response.data && response.data.length > 0 && response.data[0].b64_json) {
      return {
        imageDataBase64: response.data[0].b64_json,
        seed: seed, // Return the seed we sent
      };
    } else if ((response as any).error) {
      throw new Error(
        `Together API Error: ${(response as any).error.message || JSON.stringify((response as any).error)}`
      );
    } else if (!response.data || response.data.length === 0) {
      let errorMessage = 'Image generation failed: No data returned from API.';
      if ((response as any).message) {
        errorMessage = `Image generation failed: ${(response as any).message}`;
      } else if ((response as any).detail) {
        errorMessage = `Image generation failed: ${(response as any).detail}`;
      } else if ((response as any).status_code && (response as any).status_code !== 200) {
        // Check for HTTP status if available
        errorMessage = `Image generation failed with status ${(response as any).status_code}.`;
      }
      throw new Error(errorMessage);
    }
    throw new Error('Unexpected API response or no base64 image data found.');
  } catch (error: any) {
    console.error('Error calling Together API:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(
        `API Error (${error.response.status}): ${error.response.data.error.message || error.message}`
      );
    }
    if (
      error.message?.toLowerCase().includes('authentication failed') ||
      error.message?.toLowerCase().includes('api key')
    ) {
      throw new Error(
        'Authentication failed. Please check your API Key and account balance/tier if using Pro models.'
      );
    }
    if (error.message?.toLowerCase().includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    throw new Error(`Failed to generate image: ${error.message || 'Unknown error'}`);
  }
}
