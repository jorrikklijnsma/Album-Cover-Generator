// src/components/generator/PromptForm.tsx
import React, { useState } from 'react';
import { RiMenuFoldLine, RiMenuUnfoldLine, RiRefreshLine } from 'react-icons/ri';
import { PlaceholderKeys, placeholderVariants } from '@/utils/placeholderVariants';
import { type FormState } from '@/types/generator';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { AnimatePresence, motion } from 'framer-motion';

interface PromptFormProps {
  formState: FormState; // This will now hold either the select value or the text override
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  placeholderVariants: typeof placeholderVariants;
  // We'll also need separate state for the *original* select values if we want to revert
  // OR, the override input directly modifies formState[field.name]
}

const PromptForm: React.FC<PromptFormProps> = ({
  formState,
  setFormState,
  placeholderVariants,
}) => {
  // State to track which fields are in text input override mode
  // Key is field.name, value is boolean
  const [overrideMode, setOverrideMode] = useState<Record<string, boolean>>({});
  // State to store the text input values for fields in override mode
  // This is important because formState[field.name] will be updated by the text input
  // If you want to easily switch back to the select's value, you might need to store the select's value separately
  // For simplicity now, the text input will directly modify formState[field.name]
  // And if override mode is turned off, we can revert to the first placeholder variant.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // If a select changes, and it was in override mode, turn override mode off for that field
    if (e.target.tagName === 'SELECT') {
      setOverrideMode(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleRandomize = (fieldName: keyof FormState) => {
    // Ensure fieldName is a valid key for placeholderVariants
    if (!(fieldName in placeholderVariants)) return;

    const variants = placeholderVariants[fieldName as PlaceholderKeys];
    if (variants && variants.length > 0) {
      const randomIndex = Math.floor(Math.random() * variants.length);
      setFormState(prev => ({ ...prev, [fieldName]: variants[randomIndex] }));
      setOverrideMode(prev => ({ ...prev, [fieldName]: false })); // Turn off override on randomize
    }
  };

  const handleRandomizeAll = () => {
    const newFormState = { ...formState };
    const newOverrideMode = { ...overrideMode };
    (Object.keys(placeholderVariants) as PlaceholderKeys[]).forEach(key => {
      const variants = placeholderVariants[key];
      if (variants && variants.length > 0) {
        const randomIndex = Math.floor(Math.random() * variants.length);
        (newFormState as any)[key] = variants[randomIndex];
        newOverrideMode[key] = false; // Turn off all overrides
      }
    });
    setFormState(newFormState);
    setOverrideMode(newOverrideMode);
  };

  const toggleOverrideMode = (fieldName: string) => {
    const isCurrentlyOverridden = overrideMode[fieldName];
    if (isCurrentlyOverridden) {
      // If turning OFF override, revert to the first placeholder variant or a stored select value
      // For simplicity, let's revert to the first variant if available
      if (fieldName in placeholderVariants) {
        const variants = placeholderVariants[fieldName as PlaceholderKeys];
        if (variants && variants.length > 0) {
          setFormState(prev => ({ ...prev, [fieldName]: variants[0] }));
        }
      }
    }
    // If turning ON override, the current formState[fieldName] (which might be from select)
    // will be the initial value of the text input.
    setOverrideMode(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  // Form fields definition (assuming this is defined as before)
  const formFields: { name: string; label: string; type: 'text' | 'select' }[] = [
    { name: 'ALBUM_TITLE', label: 'Album Title', type: 'text' },
    { name: 'VISUAL_CONCEPT', label: 'Visual Concept', type: 'select' },
    { name: 'TEXT_PLACEMENT', label: 'Text Placement', type: 'select' },
    { name: 'TYPOGRAPHY_STYLE', label: 'Typography Style', type: 'select' },
    { name: 'COLOR_SCHEME', label: 'Color Scheme', type: 'select' },
    { name: 'MOOD_ATMOSPHERE', label: 'Mood/Atmosphere', type: 'select' },
    { name: 'ARTISTIC_STYLE', label: 'Artistic Style', type: 'select' },
    { name: 'COMPOSITION_DETAILS', label: 'Composition Details', type: 'select' },
    { name: 'TECHNICAL_QUALITY', label: 'Technical Quality', type: 'select' },
  ];

  return (
    <form className="space-y-4 md:space-y-6">
      {formFields.map(field => (
        <div key={field.name}>
          {field.type === 'text' ? ( // For ALBUM_TITLE
            <Input
              label={field.label}
              name={field.name}
              id={field.name}
              value={formState[field.name]}
              onChange={handleChange}
            />
          ) : (
            // For selectable fields with override
            <div>
              <label
                htmlFor={field.name}
                className="text-text-secondary mb-1 block text-sm font-medium"
              >
                {field.label}
              </label>
              <div className="flex items-end space-x-2">
                <AnimatePresence initial={false} mode="wait">
                  {overrideMode[field.name] ? (
                    <motion.div
                      key={`${field.name}-input`}
                      className="flex-grow"
                      initial={{ opacity: 0, width: '0%' }}
                      animate={{ opacity: 1, width: '100%' }}
                      exit={{ opacity: 0, width: '0%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <Input
                        // label={field.label} // Label is now above
                        name={field.name}
                        id={`${field.name}-override`}
                        value={formState[field.name]} // Text input directly modifies formState
                        onChange={handleChange}
                        placeholder={`Enter custom ${field.label.toLowerCase()}...`}
                        className="w-full" // Ensure it takes full width of motion.div
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${field.name}-select`}
                      className="flex-grow" // Default state, select takes most space
                      initial={{ opacity: 0, width: '0%' }}
                      animate={{ opacity: 1, width: '100%' }}
                      exit={{ opacity: 0, width: '0%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <Select
                        // label={field.label} // Label is now above
                        name={field.name}
                        id={field.name}
                        value={formState[field.name]}
                        onChange={handleChange} // This will also turn off override mode
                        options={
                          placeholderVariants[field.name as PlaceholderKeys]?.map(option => ({
                            value: option,
                            label: option,
                          })) || []
                        }
                        containerClassName="w-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle Override Button */}
                <IconButton
                  icon={
                    overrideMode[field.name] ? (
                      <RiMenuUnfoldLine className="h-5 w-5" />
                    ) : (
                      <RiMenuFoldLine className="h-5 w-5" />
                    )
                  }
                  onClick={() => toggleOverrideMode(field.name)}
                  tooltip={
                    overrideMode[field.name] ? 'Use Predefined Variants' : 'Enter Custom Value'
                  }
                  variant="ghost"
                  className="mb-px flex-shrink-0 self-end" // Align with bottom of input/select
                />
                {/* Randomize Button - only show if not in override mode for this field */}
                {!overrideMode[field.name] && (
                  <IconButton
                    icon={<RiRefreshLine className="h-5 w-5" />}
                    onClick={() => handleRandomize(field.name)}
                    tooltip={`Randomize ${field.label}`}
                    variant="ghost"
                    className="mb-px flex-shrink-0 self-end"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <Button
        type="button"
        onClick={handleRandomizeAll}
        iconLeft={<RiRefreshLine className="h-5 w-5" />} // Changed icon for consistency
        className="!mt-8 w-full" // More margin top
        variant="secondary"
      >
        Randomize All Preset Fields
      </Button>
    </form>
  );
};

export default PromptForm;
