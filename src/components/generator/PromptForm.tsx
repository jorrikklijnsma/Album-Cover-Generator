// src/components/generator/PromptForm.tsx
import React from 'react';
import { RiShuffleLine } from 'react-icons/ri';
import { PlaceholderKeys, placeholderVariants as allVariants } from '@/utils/placeholderVariants';

// Define types for props matching HomePage's FormState
interface FormState {
  [key: string]: string;
  ALBUM_TITLE: string;
  // ... other keys from placeholderVariants
}

interface PromptFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  placeholderVariants: typeof allVariants; // Use the imported type
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
    if (fieldName === 'ALBUM_TITLE') return; // No predefined variants for title

    const variants = placeholderVariants[fieldName as PlaceholderKeys];
    const randomIndex = Math.floor(Math.random() * variants.length);
    setFormState(prev => ({ ...prev, [fieldName]: variants[randomIndex] }));
  };

  const handleRandomizeAll = () => {
    const newFormState = { ...formState };
    (Object.keys(placeholderVariants) as PlaceholderKeys[]).forEach(key => {
      const variants = placeholderVariants[key];
      const randomIndex = Math.floor(Math.random() * variants.length);
      newFormState[key] = variants[randomIndex];
    });
    // Keep album title as is, or you could add a random word generator for it too
    setFormState(newFormState);
  };

  const formFields: { name: keyof FormState; label: string; type: 'text' | 'select' }[] = [
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
          <label
            htmlFor={field.name}
            className="text-text-secondary mb-1 block text-sm font-medium"
          >
            {field.label}
          </label>
          <div className="flex items-center space-x-2">
            {field.type === 'text' ? (
              <input
                type="text"
                name={field.name}
                id={field.name}
                value={formState[field.name]}
                onChange={handleChange}
                className="bg-primary-dark/80 text-text-primary focus:ring-accent-blue block w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-neutral-600 transition-all ring-inset placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            ) : (
              <select
                name={field.name}
                id={field.name}
                value={formState[field.name]}
                onChange={handleChange}
                className="bg-primary-dark/80 text-text-primary focus:ring-accent-blue block w-full appearance-none rounded-md border-0 bg-right bg-no-repeat px-3 py-2 pr-8 shadow-sm ring-1 ring-neutral-600 transition-all ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                {placeholderVariants[field.name as PlaceholderKeys]?.map(option => (
                  <option
                    key={option}
                    value={option}
                    className="bg-secondary-dark text-text-primary"
                  >
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.type === 'select' && (
              <button
                type="button"
                onClick={() => handleRandomize(field.name as PlaceholderKeys)}
                className="bg-accent-blue/20 hover:bg-accent-blue/40 text-accent-blue rounded-md p-2 transition-colors"
                title={`Randomize ${field.label}`}
              >
                <RiShuffleLine className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleRandomizeAll}
        className="bg-accent-pink hover:bg-opacity-80 focus:ring-offset-primary-dark focus:ring-accent-pink flex w-full items-center justify-center space-x-2 rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        <RiShuffleLine className="h-5 w-5" />
        <span>Randomize All Fields</span>
      </button>
    </form>
  );
};

export default PromptForm;
