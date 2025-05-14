// src/components/settings/SettingsPanel.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setApiKey,
  setDefaultPreviewModel,
  setDefaultEnhanceModel,
  updatePreviewParam,
  updateEnhanceParam,
  GenerationParams, // Ensure this is exported from settingsSlice
} from '@/store/settingsSlice';
import { imageModels } from '@/utils/modelData';

// Import your UI components
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { RiCloseLine, RiEyeCloseLine, RiEyeLine, RiKey2Line } from 'react-icons/ri';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);

  const [showKey, setShowKey] = useState(false);

  // Local state for input fields to avoid dispatching on every keystroke
  // Initialize with Redux state
  const [localApiKey, setLocalApiKey] = useState(settings.apiKey || '');
  const [selectedDefaultPreviewModel, setSelectedDefaultPreviewModel] = useState(
    settings.defaultPreviewModelId
  );
  const [selectedDefaultEnhanceModel, setSelectedDefaultEnhanceModel] = useState(
    settings.defaultEnhanceModelId
  );

  const [localPreviewParams, setLocalPreviewParams] = useState<GenerationParams>(
    settings.previewParamsConfig
  );
  const [localEnhanceParams, setLocalEnhanceParams] = useState<GenerationParams>(
    settings.enhanceParamsConfig
  );

  // Update local state if Redux state changes (e.g., on initial load or external update)
  useEffect(() => {
    setLocalApiKey(settings.apiKey || '');
    setSelectedDefaultPreviewModel(settings.defaultPreviewModelId);
    setSelectedDefaultEnhanceModel(settings.defaultEnhanceModelId);
    setLocalPreviewParams(settings.previewParamsConfig);
    setLocalEnhanceParams(settings.enhanceParamsConfig);
  }, [settings]);

  const handleSaveApiKey = () => {
    dispatch(setApiKey(localApiKey.trim() || null));
    alert('API Key saved!'); // Or some other feedback
  };

  const handleDefaultPreviewModelChange = (modelId: string) => {
    setSelectedDefaultPreviewModel(modelId);
    dispatch(setDefaultPreviewModel(modelId)); // This will reset params in Redux state
    // The useEffect above will then update localPreviewParams
  };

  const handleDefaultEnhanceModelChange = (modelId: string) => {
    setSelectedDefaultEnhanceModel(modelId);
    dispatch(setDefaultEnhanceModel(modelId)); // This will reset params in Redux state
  };

  // Handler for parameter inputs for PREVIEW
  const handlePreviewParamChange = (param: keyof GenerationParams, value: string) => {
    const numValue = parseFloat(value); // Or parseInt depending on param
    if (!isNaN(numValue)) {
      // Update local state first for responsiveness
      setLocalPreviewParams(prev => ({ ...prev, [param]: numValue }));
      // Then dispatch to Redux (could be debounced or on blur/save)
      dispatch(updatePreviewParam({ param, value: numValue }));
    }
  };
  // Handler for parameter inputs for ENHANCE (similar to above)
  const handleEnhanceParamChange = (param: keyof GenerationParams, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setLocalEnhanceParams(prev => ({ ...prev, [param]: numValue }));
      dispatch(updateEnhanceParam({ param, value: numValue }));
    }
  };

  if (!isOpen) return null;

  const previewModelOptions = imageModels
    .filter(m => !m.isPro)
    .map(m => ({ value: m.id, label: m.name }));
  const enhanceModelOptions = imageModels
    .filter(m => m.isPro)
    .map(m => ({ value: m.id, label: m.name }));

  const currentPreviewConstraints = settings.previewModelConstraints;
  const currentEnhanceConstraints = settings.enhanceModelConstraints;

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-secondary-dark h-full w-full max-w-lg transform space-y-6 overflow-y-auto p-6 shadow-2xl transition-transform"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside panel
      >
        <div className="flex items-center justify-between border-b border-neutral-700 pb-4">
          <h2 className="text-text-primary text-xl font-semibold">Settings</h2>
          <Button onClick={onClose} variant="ghost" size="sm" className="!p-2">
            <RiCloseLine className="h-6 w-6" />
          </Button>
        </div>

        <Card title="API Configuration" className="!bg-primary-dark/30">
          <Input
            label="Together API Key"
            type={showKey ? 'text' : 'password'}
            value={localApiKey}
            onChange={e => setLocalApiKey(e.target.value)}
            iconLeft={<RiKey2Line className="h-5 w-5 text-neutral-400" />}
            placeholder="Enter your Together API Key"
            name="apiKey"
            id="apiKey"
          />
          <div className="flex gap-4">
            <Button
              onClick={() => setShowKey(!showKey)}
              className="mt-3 w-full"
              variant="secondary"
              size="sm"
              iconRight={showKey ? <RiEyeCloseLine /> : <RiEyeLine />}
            >
              {showKey ? 'Show Api key' : 'Hide API Key'}
            </Button>
            <Button onClick={handleSaveApiKey} className="mt-3 w-full" size="sm">
              Save API Key
            </Button>
          </div>
        </Card>

        <Card title="Default Preview Settings" className="!bg-primary-dark/30">
          <Select
            label="Default Preview Model"
            options={previewModelOptions}
            value={selectedDefaultPreviewModel}
            onChange={e => handleDefaultPreviewModelChange(e.target.value)}
            containerClassName="mb-4"
          />
          {currentPreviewConstraints && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Width (px)"
                type="number"
                value={localPreviewParams.width.toString()}
                min={currentPreviewConstraints.width.min}
                max={currentPreviewConstraints.width.max}
                step={currentPreviewConstraints.width.step}
                onChange={e => handlePreviewParamChange('width', e.target.value)}
              />
              <Input
                label="Height (px)"
                type="number"
                value={localPreviewParams.height.toString()}
                min={currentPreviewConstraints.height.min}
                max={currentPreviewConstraints.height.max}
                step={currentPreviewConstraints.height.step}
                onChange={e => handlePreviewParamChange('height', e.target.value)}
              />
              <Input
                label="Steps"
                type="number"
                value={localPreviewParams.steps.toString()}
                min={currentPreviewConstraints.steps.min}
                max={currentPreviewConstraints.steps.max}
                onChange={e => handlePreviewParamChange('steps', e.target.value)}
              />
              <Input
                label="Guidance (CFG)"
                type="number"
                value={localPreviewParams.guidance.toString()}
                min={currentPreviewConstraints.guidance.min}
                max={currentPreviewConstraints.guidance.max}
                step={currentPreviewConstraints.guidance.step}
                onChange={e => handlePreviewParamChange('guidance', e.target.value)}
              />
            </div>
          )}
        </Card>

        <Card title="Default Enhance Settings" className="!bg-primary-dark/30">
          <Select
            label="Default Enhance Model"
            options={enhanceModelOptions}
            value={selectedDefaultEnhanceModel}
            onChange={e => handleDefaultEnhanceModelChange(e.target.value)}
            containerClassName="mb-4"
          />
          {currentEnhanceConstraints && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Width (px)"
                type="number"
                value={localEnhanceParams.width.toString()}
                min={currentEnhanceConstraints.width.min}
                max={currentEnhanceConstraints.width.max}
                step={currentEnhanceConstraints.width.step}
                onChange={e => handleEnhanceParamChange('width', e.target.value)}
              />
              <Input
                label="Height (px)"
                type="number"
                value={localEnhanceParams.height.toString()}
                min={currentEnhanceConstraints.height.min}
                max={currentEnhanceConstraints.height.max}
                step={currentEnhanceConstraints.height.step}
                onChange={e => handleEnhanceParamChange('height', e.target.value)}
              />
              <Input
                label="Steps"
                type="number"
                value={localEnhanceParams.steps.toString()}
                min={currentEnhanceConstraints.steps.min}
                max={currentEnhanceConstraints.steps.max}
                onChange={e => handleEnhanceParamChange('steps', e.target.value)}
              />
              <Input
                label="Guidance (CFG)"
                type="number"
                value={localEnhanceParams.guidance.toString()}
                min={currentEnhanceConstraints.guidance.min}
                max={currentEnhanceConstraints.guidance.max}
                step={currentEnhanceConstraints.guidance.step}
                onChange={e => handleEnhanceParamChange('guidance', e.target.value)}
              />
            </div>
          )}
        </Card>

        {/* Add a main "Save All Settings" button or rely on onBlur/onChange dispatches */}
        <Button onClick={onClose} variant="secondary" className="mt-6 w-full">
          Close Settings
        </Button>
      </div>
    </div>
  );
};
export default SettingsPanel;
