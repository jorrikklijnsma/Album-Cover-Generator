// src/components/generator/ImageDisplay.tsx
import React, { useState } from 'react'; // Added useState
import {
  RiImageAddLine,
  RiSparkling2Line,
  RiDownloadCloud2Line,
  RiFullscreenLine, // Icon for fullscreen
} from 'react-icons/ri';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button'; // Use your Button component
import IconButton from '@/components/ui/IconButton'; // Use your IconButton component
import FullScreenImageModal from '@/components/ui/FullScreenImageModal'; // Import the new modal

interface ImageDisplayProps {
  previewImageBase64: string | null;
  enhancedImageBase64: string | null;
  isPreviewLoading: boolean;
  isEnhanceLoading: boolean;
  albumName?: string;
  onGeneratePreview: () => void;
  onEnhance: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  previewImageBase64,
  enhancedImageBase64,
  isPreviewLoading,
  isEnhanceLoading,
  albumName,
  onGeneratePreview,
  onEnhance,
}) => {
  const [isFullScreenImageOpen, setIsFullScreenImageOpen] = useState(false);

  const handleDownload = (base64Data: string | null, baseFilename: string) => {
    if (!base64Data) return;
    const finalFilename = albumName
      ? `${albumName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${baseFilename}.png`
      : `${baseFilename}.png`;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const finalImageDataBase64 = enhancedImageBase64 || previewImageBase64;
  const isLoading = isPreviewLoading || isEnhanceLoading;

  const openFullScreen = () => {
    if (finalImageDataBase64) {
      setIsFullScreenImageOpen(true);
    }
  };

  return (
    <>
      <div className="bg-secondary-dark/30 glassmorphic space-y-6 rounded-xl border border-neutral-700 p-4 shadow-xl md:p-6">
        {/* Image Container - Responsive */}
        <div className="bg-primary-dark relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg shadow-inner">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <LoadingSpinner
                text={isPreviewLoading ? 'Generating Preview...' : 'Enhancing Image...'}
                size="lg"
              />
            </div>
          )}
          {finalImageDataBase64 && !isLoading ? (
            <>
              <img
                src={`data:image/png;base64,${finalImageDataBase64}`}
                alt={albumName || 'Generated album cover'}
                className="block max-h-full max-w-full cursor-pointer object-contain"
                onClick={openFullScreen} // Open fullscreen on image click
              />
              <div className="absolute top-2 right-2 opacity-50 transition-opacity hover:opacity-100">
                <IconButton
                  icon={<RiFullscreenLine className="h-5 w-5" />}
                  onClick={openFullScreen}
                  tooltip="View Fullscreen"
                  variant="ghost"
                  className="bg-black/20 text-white hover:bg-black/50"
                />
              </div>
            </>
          ) : (
            !isLoading && (
              <div className="text-text-secondary p-4 text-center">
                <RiImageAddLine className="mx-auto h-16 w-16 text-neutral-600 md:h-20 md:w-20" />
                <p className="mt-2 text-xs md:text-sm">Your album cover will appear here</p>
              </div>
            )
          )}
        </div>

        {/* Status Text */}
        {enhancedImageBase64 &&
          !isEnhanceLoading &&
          !isPreviewLoading && ( // Ensure not to show during preview loading
            <p className="text-accent-green text-center text-xs">Enhanced version loaded!</p>
          )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            onClick={onGeneratePreview}
            disabled={isLoading}
            iconLeft={<RiImageAddLine className="h-5 w-5" />}
            isLoading={isPreviewLoading} // Pass loading state to Button
            variant="secondary" // Use your Button variants
            className="w-full"
          >
            {previewImageBase64 && !isPreviewLoading ? 'Re-Generate Preview' : 'Generate Preview'}
          </Button>

          <Button
            onClick={onEnhance}
            disabled={isLoading || !previewImageBase64}
            iconLeft={<RiSparkling2Line className="h-5 w-5" />}
            isLoading={isEnhanceLoading} // Pass loading state to Button
            hasIconAnimation
            variant="fancy" // Use your Button variants
            className="w-full"
          >
            Enhance Quality
          </Button>
        </div>

        {/* Download Buttons */}
        {(previewImageBase64 || enhancedImageBase64) && ( // Simplified condition
          <div className="flex flex-col gap-3 border-t border-neutral-700 pt-4 sm:flex-row">
            {previewImageBase64 && (
              <Button
                onClick={() => handleDownload(previewImageBase64, 'preview')}
                disabled={isLoading}
                iconLeft={<RiDownloadCloud2Line className="h-5 w-5" />}
                variant="ghost"
                className="text-text-secondary hover:text-text-primary w-full border border-neutral-600 hover:border-neutral-500"
              >
                Download Preview
              </Button>
            )}
            {enhancedImageBase64 && ( // Show download for enhanced only if it exists
              <Button
                onClick={() => handleDownload(enhancedImageBase64, 'enhanced')}
                disabled={isLoading}
                iconLeft={<RiDownloadCloud2Line className="h-5 w-5" />}
                variant="ghost"
                className="border-accent-green text-accent-green hover:bg-accent-green w-full border hover:text-white"
              >
                Download Enhanced
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <FullScreenImageModal
        isOpen={isFullScreenImageOpen}
        onClose={() => setIsFullScreenImageOpen(false)}
        imageBase64={finalImageDataBase64}
        onDownload={() => handleDownload(finalImageDataBase64, albumName || 'album_cover')}
      />
    </>
  );
};

export default ImageDisplay;
