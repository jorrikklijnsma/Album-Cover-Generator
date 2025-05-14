// src/utils/modelData.ts
export interface ModelParameterConstraints {
  steps: { min: number; max: number; default: number };
  width: { min: number; max: number; default: number; step: number };
  height: { min: number; max: number; default: number; step: number };
  guidance: { min: number; max: number; default: number; step: number };
  // Add other relevant parameters like supported resolutions if fixed
}

export interface ImageModel {
  id: string;
  name: string;
  organization: string;
  defaultStepsForPricing?: number;
  pricePerMegapixel: number;
  notes?: string;
  isPro: boolean;
  constraints: ModelParameterConstraints;
}

export const imageModels: ImageModel[] = [
  {
    id: 'black-forest-labs/FLUX.1-schnell-Free',
    name: 'Flux.1 [schnell] (Free)',
    organization: 'Black Forest Labs',
    pricePerMegapixel: 0, // Free
    notes: 'Free model, 10 img/min rate limit. Reduced performance.',
    isPro: false,
    constraints: {
      steps: { min: 1, max: 4, default: 4 }, // Guessed defaults, check API
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
  {
    id: 'black-forest-labs/FLUX.1-schnell',
    name: 'Flux.1 [schnell] (Turbo)',
    organization: 'Black Forest Labs',
    defaultStepsForPricing: 4,
    pricePerMegapixel: 0.003 * 100, // $0.003 -> 0.3 cents per MP
    notes: 'Paid Turbo endpoint.',
    isPro: false,
    constraints: {
      steps: { min: 1, max: 12, default: 4 }, // Max steps might be low for this model
      width: { min: 64, max: 1792, default: 1024, step: 32 },
      height: { min: 64, max: 1792, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.0, step: 0.1 }, // Example
    },
  },
  {
    id: 'black-forest-labs/FLUX.1-dev',
    name: 'Flux.1 Dev',
    organization: 'Black Forest Labs',
    defaultStepsForPricing: 28,
    pricePerMegapixel: 0.025 * 100, // $0.025 -> 2.5 cents per MP
    isPro: false,
    constraints: {
      steps: { min: 1, max: 50, default: 28 }, // Max steps might be low for this model
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
  {
    // Assuming LoRA has its own model ID if you want to list it separately
    id: 'black-forest-labs/FLUX.1-dev-lora', // Verify this model ID if different
    name: 'Flux.1 Dev (LoRA)',
    organization: 'Black Forest Labs',
    defaultStepsForPricing: 28,
    pricePerMegapixel: 0.035 * 100, // $0.035 -> 3.5 cents per MP
    isPro: false, // Or true if it's considered a pro feature
    constraints: {
      steps: { min: 1, max: 50, default: 28 }, // Max steps might be low for this model
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
  {
    id: 'black-forest-labs/FLUX.1-canny',
    name: 'Flux.1 Canny',
    organization: 'Black Forest Labs',
    defaultStepsForPricing: 28,
    pricePerMegapixel: 0.025 * 100, // $0.025 -> 2.5 cents per MP
    notes: 'ControlNet-style model, uses image_url for Canny edge detection map.',
    isPro: false, // Typically not 'Pro' in the sense of build tier, but advanced usage
    constraints: {
      steps: { min: 1, max: 50, default: 28 }, // Max steps might be low for this model
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
  {
    id: 'black-forest-labs/FLUX.1-depth',
    name: 'Flux.1 Depth',
    organization: 'Black Forest Labs',
    defaultStepsForPricing: 28,
    pricePerMegapixel: 0.025 * 100, // $0.025 -> 2.5 cents per MP
    notes: 'ControlNet-style model, uses image_url for depth map.',
    isPro: false,
    constraints: {
      steps: { min: 1, max: 50, default: 28 }, // Max steps might be low for this model
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
  {
    id: 'black-forest-labs/FLUX.1-redux',
    name: 'Flux.1 Redux',
    organization: 'Black Forest Labs',
    defaultStepsForPricing: 28,
    pricePerMegapixel: 0.025 * 100, // $0.025 -> 2.5 cents per MP
    isPro: false,
    constraints: {
      steps: { min: 1, max: 50, default: 28 }, // Max steps might be low for this model
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
  {
    id: 'black-forest-labs/FLUX.1.1-pro',
    name: 'Flux 1.1 [pro]',
    organization: 'Black Forest Labs',
    // defaultStepsForPricing: undefined, // Price is flat per MP, steps don't change it for this one
    pricePerMegapixel: 0.04 * 100, // $0.040 -> 4.0 cents per MP
    notes:
      'Pro model. Limited to Build Tier 2+. Requires credits. Step count does not alter price.',
    isPro: true,
    constraints: {
      steps: { min: 10, max: 50, default: 28 }, // Higher default/max for pro
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
  {
    id: 'black-forest-labs/FLUX.1-pro',
    name: 'Flux.1 [pro]',
    organization: 'Black Forest Labs',
    defaultStepsForPricing: 50, // This Pro model DOES have steps in its pricing
    pricePerMegapixel: 0.05 * 100, // $0.050 -> 5.0 cents per MP
    notes: 'Pro model. Limited to Build Tier 2+. Requires credits.',
    isPro: true,
    constraints: {
      steps: { min: 10, max: 50, default: 28 }, // Higher default/max for pro
      width: { min: 256, max: 1440, default: 1024, step: 32 },
      height: { min: 256, max: 1440, default: 1024, step: 32 },
      guidance: { min: 1, max: 10, default: 3.5, step: 0.1 },
    },
  },
];

// Updated Function to calculate cost
export function calculateCost(
  modelId: string,
  width: number,
  height: number,
  stepsUsed: number
): number | null {
  const model = imageModels.find(m => m.id === modelId);
  if (!model) {
    console.warn(`Model ${modelId} not found for cost calculation.`);
    return null;
  }

  if (model.pricePerMegapixel === 0) {
    return 0; // Free model
  }

  const megapixels = (width * height) / 1_000_000;
  let cost = megapixels * model.pricePerMegapixel;

  // Cost adjustment for steps:
  // "Costs are adjusted based on the number of steps used only if you go above the default steps.
  // If you use more steps, the cost increases proportionally...
  // If you use fewer steps, the cost does not decrease and is based on the default rate."
  if (model.defaultStepsForPricing && stepsUsed > model.defaultStepsForPricing) {
    cost = cost * (stepsUsed / model.defaultStepsForPricing);
  }
  // For models like FLUX.1.1-pro where defaultStepsForPricing is undefined, steps don't alter cost.

  return cost;
}
