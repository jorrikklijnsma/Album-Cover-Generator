// src/utils/api.ts
import Together from 'together-ai';

const PREVIEW_MODEL_ID = 'black-forest-labs/FLUX.1-schnell-Free';
const ENHANCE_MODEL_ID = 'black-forest-labs/FLUX.1.1-pro';

interface CallTogetherApiOptions {
  apiKey: string;
  prompt: string;
  generationType: 'preview' | 'enhance';
  referenceImageUrl?: string | null; // URL of the preview image for enhancement
  width?: number;
  height?: number;
  negativePrompt?: string;
  steps?: number;
  // Add other parameters from the API reference as needed
  guidance?: number; // For controlling adherence, especially for enhance
}

export async function callTogetherApi({
  apiKey,
  prompt,
  generationType,
  referenceImageUrl,
  width = 768, // Default, FLUX models often use 1024x1024
  height = 768,
  negativePrompt = 'text, watermark, blurry, ugly, deformed, noisy, malformed hands, messy, low quality, artifacts',
  steps, // Will be set based on generationType
  guidance,
}: CallTogetherApiOptions): Promise<string> {
  if (!apiKey) {
    throw new Error('API Key is required to call Together API.');
  }

  const together = new Together({ apiKey });

  let modelToUse: string;
  let apiSteps: number;
  let requestBody: Parameters<typeof together.images.create>[0];

  if (generationType === 'preview') {
    modelToUse = PREVIEW_MODEL_ID;
    apiSteps = steps || 4; // Default steps for preview
    requestBody = {
      model: modelToUse,
      prompt,
      negative_prompt: negativePrompt,
      width,
      height,
      steps: apiSteps,
      n: 1, // Generate 1 image
      response_format: 'url', // We want a URL for the image
      // guidance: guidance || 3.5, // Default guidance, adjust if needed
    };
  } else {
    // 'enhance'
    if (!referenceImageUrl) {
      throw new Error('Reference image URL is required for enhancement.');
    }
    modelToUse = ENHANCE_MODEL_ID;
    apiSteps = steps || 30; // Potentially more steps for higher quality
    requestBody = {
      model: modelToUse,
      prompt,
      negative_prompt: negativePrompt,
      width, // Should ideally match the preview image dimensions or be supported by the model
      height,
      steps: apiSteps,
      n: 1,
      image_url: referenceImageUrl, // Key parameter for using the preview as reference
      response_format: 'url',
      guidance: guidance || 5, // Potentially higher guidance to adhere to the reference image and prompt
    };
  }

  console.log(`Calling Together API with model: ${modelToUse}`, requestBody);

  try {
    const response = await together.images.create(requestBody);

    console.log('Together API Response:', response);

    if (response.data && response.data.length > 0 && response.data[0].url) {
      return response.data[0].url;
    } else if (response.error) {
      // The SDK might structure errors differently, check its documentation or typical responses
      throw new Error(
        `Together API Error: ${response.error.message || JSON.stringify(response.error)}`
      );
    } else if (!response.data || response.data.length === 0) {
      // Check for other error indications based on actual SDK behavior
      let errorMessage = 'Image generation failed: No data returned.';
      // The SDK might have specific error fields or structures
      // e.g., if response.status is 'failed' or similar
      if ((response as any).message) {
        // Check for a general message field
        errorMessage = `Image generation failed: ${(response as any).message}`;
      } else if ((response as any).detail) {
        // Some APIs use 'detail'
        errorMessage = `Image generation failed: ${(response as any).detail}`;
      }
      throw new Error(errorMessage);
    }

    throw new Error('Unexpected API response format or no image URL found.');
  } catch (error: any) {
    console.error('Error calling Together API:', error);
    if (error.response && error.response.data && error.response.data.error) {
      // Axios-like error structure
      throw new Error(
        `API Error (${error.response.status}): ${error.response.data.error.message || error.message}`
      );
    }
    if (error.message && error.message.includes('authentication')) {
      // Specific check for auth issues
      throw new Error('Authentication failed. Please check your API Key.');
    }
    // Re-throw a more generic error if specific parsing fails
    throw new Error(`Failed to generate image: ${error.message || 'Unknown error'}`);
  }
}
