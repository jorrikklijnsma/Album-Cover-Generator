// src/store/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { imageModels, ModelParameterConstraints } from '@/utils/modelData';

// Helper to get default constraints or fallback
const getDefaultConstraints = (modelId?: string): ModelParameterConstraints => {
  const model = imageModels.find(m => m.id === modelId);
  if (model) return model.constraints;
  // Fallback constraints if no model or model has no constraints (should not happen with good modelData)
  return {
    steps: { min: 1, max: 100, default: 20 },
    width: { min: 256, max: 1024, default: 1024, step: 64 },
    height: { min: 256, max: 1024, default: 1024, step: 64 },
    guidance: { min: 1, max: 20, default: 7, step: 0.5 },
  };
};

export interface GenerationParams {
  width: number;
  height: number;
  steps: number;
  guidance: number;
}

export interface SettingsState {
  apiKey: string | null;
  defaultPreviewModelId: string;
  defaultEnhanceModelId: string;
  previewParamsConfig: GenerationParams;
  enhanceParamsConfig: GenerationParams;
  // To store the constraints of the currently selected default models
  previewModelConstraints: ModelParameterConstraints;
  enhanceModelConstraints: ModelParameterConstraints;
}

// Find initial models - ensure they exist in imageModels
const initialPreviewModel =
  imageModels.find(m => m.id === 'black-forest-labs/FLUX.1-schnell-Free') ||
  imageModels.find(m => !m.isPro)!;
const initialEnhanceModel =
  imageModels.find(m => m.id === 'black-forest-labs/FLUX.1.1-pro') ||
  imageModels.find(m => m.isPro)!;

const initialState: SettingsState = {
  apiKey: null,
  defaultPreviewModelId: initialPreviewModel.id,
  defaultEnhanceModelId: initialEnhanceModel.id,
  previewParamsConfig: {
    // CORRECTED: Extract default values
    width: initialPreviewModel.constraints.width.default,
    height: initialPreviewModel.constraints.height.default,
    steps: initialPreviewModel.constraints.steps.default,
    guidance: initialPreviewModel.constraints.guidance.default,
  },
  enhanceParamsConfig: {
    // CORRECTED: Extract default values
    width: initialEnhanceModel.constraints.width.default,
    height: initialEnhanceModel.constraints.height.default,
    steps: initialEnhanceModel.constraints.steps.default,
    guidance: initialEnhanceModel.constraints.guidance.default,
  },
  previewModelConstraints: initialPreviewModel.constraints,
  enhanceModelConstraints: initialEnhanceModel.constraints,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string | null>) => {
      state.apiKey = action.payload;
      // Optionally, save to localStorage here too if you want persistence without backend yet
      if (action.payload) localStorage.setItem('togetherApiKey_redux', action.payload);
      else localStorage.removeItem('togetherApiKey_redux');
    },
    setDefaultPreviewModel: (state, action: PayloadAction<string>) => {
      const newModelId = action.payload;
      const model = imageModels.find(m => m.id === newModelId);
      if (model) {
        state.defaultPreviewModelId = newModelId;
        state.previewModelConstraints = model.constraints;
        state.previewParamsConfig = {
          // Reset params to new model's defaults
          width: model.constraints.width.default,
          height: model.constraints.height.default,
          steps: model.constraints.steps.default,
          guidance: model.constraints.guidance.default,
        };
      }
    },
    setDefaultEnhanceModel: (state, action: PayloadAction<string>) => {
      const newModelId = action.payload;
      const model = imageModels.find(m => m.id === newModelId);
      if (model) {
        state.defaultEnhanceModelId = newModelId;
        state.enhanceModelConstraints = model.constraints;
        state.enhanceParamsConfig = {
          // Reset params to new model's defaults
          width: model.constraints.width.default,
          height: model.constraints.height.default,
          steps: model.constraints.steps.default,
          guidance: model.constraints.guidance.default,
        };
      }
    },
    // Actions to update specific parameters for preview
    updatePreviewParam: (
      state,
      action: PayloadAction<{ param: keyof GenerationParams; value: number }>
    ) => {
      const { param, value } = action.payload;
      const constraint = state.previewModelConstraints[param as keyof ModelParameterConstraints]; // Type assertion
      if (constraint && value >= constraint.min && value <= constraint.max) {
        state.previewParamsConfig[param] = value;
      } else {
        console.warn(`Value ${value} for ${param} is out of bounds for preview model.`);
        // Optionally clamp value: state.previewParamsConfig[param] = Math.max(constraint.min, Math.min(constraint.max, value));
      }
    },
    // Actions to update specific parameters for enhance
    updateEnhanceParam: (
      state,
      action: PayloadAction<{ param: keyof GenerationParams; value: number }>
    ) => {
      const { param, value } = action.payload;
      const constraint = state.enhanceModelConstraints[param as keyof ModelParameterConstraints];
      if (constraint && value >= constraint.min && value <= constraint.max) {
        state.enhanceParamsConfig[param] = value;
      } else {
        console.warn(`Value ${value} for ${param} is out of bounds for enhance model.`);
      }
    },
    // Load settings (e.g., from localStorage on app start)
    loadSettings: state => {
      const storedApiKey = localStorage.getItem('togetherApiKey_redux');
      if (storedApiKey) {
        state.apiKey = storedApiKey;
      }
      // Could add more persisted settings here if needed (e.g., last used models)
    },
  },
});

export const {
  setApiKey,
  setDefaultPreviewModel,
  setDefaultEnhanceModel,
  updatePreviewParam,
  updateEnhanceParam,
  loadSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
