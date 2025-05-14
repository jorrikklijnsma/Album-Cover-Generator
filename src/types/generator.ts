// src/types/generator.ts
import { placeholderVariants } from '@/utils/placeholderVariants'; // If needed for initial state

export interface FormState {
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

// You can also move the initialFormState logic here if you want
export const getInitialFormState = (): FormState => ({
  ALBUM_TITLE: '',
  VISUAL_CONCEPT: placeholderVariants.VISUAL_CONCEPT[0],
  TEXT_PLACEMENT: placeholderVariants.TEXT_PLACEMENT[0],
  TYPOGRAPHY_STYLE: placeholderVariants.TYPOGRAPHY_STYLE[0],
  COLOR_SCHEME: placeholderVariants.COLOR_SCHEME[0],
  MOOD_ATMOSPHERE: placeholderVariants.MOOD_ATMOSPHERE[0],
  ARTISTIC_STYLE: placeholderVariants.ARTISTIC_STYLE[0],
  COMPOSITION_DETAILS: placeholderVariants.COMPOSITION_DETAILS[0],
  TECHNICAL_QUALITY: placeholderVariants.TECHNICAL_QUALITY[0],
});
