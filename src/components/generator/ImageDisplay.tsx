// src/components/generator/ImageDisplay.tsx
import React from 'react';
import { RiImageAddLine, RiSparkling2Line, RiDownloadCloud2Line } from 'react-icons/ri';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Import the spinner

interface ImageDisplayProps {
  previewImageUrl: string | null;
  enhancedImageUrl: string | null;
  isPreviewLoading: boolean; // Specific loading state for preview
  isEnhanceLoading: boolean; // Specific loading state for enhance
  onGeneratePreview: () => void;
  onEnhance: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  previewImageUrl,
  enhancedImageUrl,
  isPreviewLoading,
  isEnhanceLoading,
  onGeneratePreview,
  onEnhance,
}) => {
  const handleDownload = (url: string | null, filename: string) => {
    /* ... (no change) */
  };

  const finalImageUrl = enhancedImageUrl || previewImageUrl;
  const isLoading = isPreviewLoading || isEnhanceLoading; // General loading for image area

  return (
    <div className="bg-secondary-dark/30 glassmorphic space-y-6 rounded-xl border border-neutral-700 p-6 shadow-xl">
      <div className="bg-primary-dark relative flex aspect-square min-h-[300px] items-center justify-center overflow-hidden rounded-lg shadow-inner sm:min-h-[400px] lg:min-h-[512px]">
        {' '}
        {/* Added min-h for consistent size */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <LoadingSpinner
              text={isPreviewLoading ? 'Generating Preview...' : 'Enhancing Image...'}
              size="lg"
            />
          </div>
        )}
        {finalImageUrl && !isLoading ? ( // Only show image if not loading
          <img
            src={finalImageUrl}
            alt="Generated album cover"
            className="h-full w-full object-contain"
          />
        ) : (
          !isLoading && ( // Show placeholder only if not loading and no image
            <div className="text-text-secondary p-4 text-center">
              <RiImageAddLine className="mx-auto h-20 w-20 text-neutral-600 sm:h-24 sm:w-24" />
              <p className="mt-2 text-sm sm:text-base">Your album cover will appear here</p>
            </div>
          )
        )}
      </div>

      {enhancedImageUrl && !isEnhanceLoading && (
        <p className="text-accent-green text-center text-xs">Enhanced version loaded!</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={onGeneratePreview}
          disabled={isPreviewLoading || isEnhanceLoading} // Disable if any generation is happening
          className="border-accent-blue text-accent-blue hover:bg-accent-blue focus:ring-offset-secondary-dark focus:ring-accent-blue group flex w-full items-center justify-center space-x-2 rounded-md border px-4 py-3 text-sm font-medium shadow-sm transition-all hover:text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RiImageAddLine
            className={`h-5 w-5 ${isPreviewLoading ? 'animate-pulse' : 'group-hover:animate-pulse'}`}
          />
          <span>
            {previewImageUrl && !isPreviewLoading ? 'Re-Generate Preview' : 'Generate Preview'}
          </span>
        </button>

        <button
          onClick={onEnhance}
          disabled={isEnhanceLoading || isPreviewLoading || !previewImageUrl} // Disable if any generation or no preview
          className="from-accent-pink to-accent-blue hover:from-accent-pink/80 hover:to-accent-blue/80 focus:ring-offset-secondary-dark focus:ring-accent-pink group flex w-full items-center justify-center space-x-2 rounded-md border border-transparent bg-gradient-to-r px-4 py-3 text-sm font-medium text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RiSparkling2Line
            className={`h-5 w-5 ${isEnhanceLoading ? 'animate-bounce' : 'group-hover:animate-bounce'}`}
          />
          <span>Enhance Quality</span>
        </button>
      </div>

      {/* Download buttons (no change in logic, but disabled state might be affected by isLoading) */}
      {(previewImageUrl || enhancedImageUrl) && (
        <div className="flex flex-col gap-4 border-t border-neutral-700 pt-4 sm:flex-row">
          {previewImageUrl && (
            <button
              onClick={() => handleDownload(previewImageUrl, 'album_cover_preview.png')}
              disabled={!previewImageUrl || isLoading} // Disable if loading
              className="text-text-secondary hover:text-text-primary flex w-full items-center justify-center space-x-2 rounded-md border border-neutral-600 px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:bg-neutral-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RiDownloadCloud2Line className="h-5 w-5" />
              <span>Download Preview</span>
            </button>
          )}
          {enhancedImageUrl && (
            <button
              onClick={() => handleDownload(enhancedImageUrl, 'album_cover_enhanced.png')}
              disabled={!enhancedImageUrl || isLoading} // Disable if loading
              className="border-accent-green text-accent-green hover:bg-accent-green flex w-full items-center justify-center space-x-2 rounded-md border px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RiDownloadCloud2Line className="h-5 w-5" />
              <span>Download Enhanced</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
