// src/components/generator/PromptForm.tsx
import React from 'react';
import { RiShuffleLine } from 'react-icons/ri';
import { PlaceholderKeys, placeholderVariants as allVariants } from '@/utils/placeholderVariants';
import { type FormState } from '@/types/generator';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';

interface PromptFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  placeholderVariants: typeof allVariants;
}

const PromptForm: React.FC<PromptFormProps> = ({
  formState,
  setFormState,
  placeholderVariants,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRandomize = (fieldName: PlaceholderKeys | 'ALBUM_TITLE') => {
    if (fieldName === 'ALBUM_TITLE') return;

    const variants = placeholderVariants[fieldName as PlaceholderKeys];
    const randomIndex = Math.floor(Math.random() * variants.length);
    setFormState(prev => ({ ...prev, [fieldName]: variants[randomIndex] }));
  };

  const handleRandomizeAll = () => {
    const newFormState = { ...formState };
    (Object.keys(placeholderVariants) as Array<keyof typeof placeholderVariants>).forEach(key => {
      const variants = placeholderVariants[key as PlaceholderKeys];

      if (variants && variants.length > 0) {
        // Check if variants exist
        const randomIndex = Math.floor(Math.random() * variants.length);
        (newFormState as any)[key] = variants[randomIndex];
      }
    });
    setFormState(newFormState);
  };

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
    <form className="space-y-6">
      {formFields.map(field => (
        <div key={field.name}>
          {field.type === 'text' ? (
            <Input
              label={field.label}
              name={field.name}
              id={field.name}
              value={formState[field.name]}
              onChange={handleChange}
            />
          ) : (
            <div className="flex items-end space-x-2">
              <Select
                containerClassName="flex-grow"
                label={field.label}
                name={field.name}
                id={field.name}
                value={formState[field.name]}
                onChange={handleChange}
                options={
                  placeholderVariants[field.name as PlaceholderKeys]?.map(option => ({
                    value: option,
                    label: option,
                  })) || []
                }
              />
              <IconButton
                icon={<RiShuffleLine className="h-5 w-5" />}
                onClick={() => handleRandomize(field.name as PlaceholderKeys)}
                tooltip={`Randomize ${field.label}`}
                variant="ghost"
                className="mb-px"
              />
            </div>
          )}
        </div>
      ))}
      <Button
        onClick={handleRandomizeAll}
        iconLeft={<RiShuffleLine className="h-5 w-5" />}
        className="w-full"
        variant="secondary"
      >
        Randomize All Prompt Fields
      </Button>
    </form>
  );
};

export default PromptForm;
