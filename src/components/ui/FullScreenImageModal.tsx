// src/components/ui/FullScreenImageModal.tsx
import React from 'react';
import { RiCloseLine, RiDownloadCloud2Line } from 'react-icons/ri';
import IconButton from '@/components/ui/IconButton'; // Your IconButton

interface FullScreenImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageBase64: string | null;
  imageName?: string; // For download filename
  onDownload: () => void;
}

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({
  isOpen,
  onClose,
  imageBase64,
  onDownload,
}) => {
  if (!isOpen || !imageBase64) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg transition-opacity duration-300"
      onClick={onClose} // Close when clicking backdrop
    >
      <div
        className="relative flex max-h-full max-w-full flex-col items-center justify-center"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking image/controls
      >
        {/* Image */}
        <img
          src={`data:image/png;base64,${imageBase64}`}
          alt="Full screen album cover"
          className="block max-h-[85vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
        />

        {/* Controls positioned absolutely or in a bar */}
        <div className="absolute top-2 right-2 flex space-x-2 md:top-4 md:right-4">
          <IconButton
            icon={<RiDownloadCloud2Line className="h-5 w-5 md:h-6 md:w-6" />}
            onClick={e => {
              e.stopPropagation(); // Prevent modal close
              onDownload();
            }}
            tooltip="Download Image"
            variant="ghost"
            className="bg-black/30 !p-2 text-white hover:bg-black/60 md:!p-3" // Override some IconButton styles for this context
          />
          <IconButton
            icon={<RiCloseLine className="h-5 w-5 md:h-6 md:w-6" />}
            onClick={onClose}
            tooltip="Close"
            variant="ghost"
            className="bg-black/30 !p-2 text-white hover:bg-black/60 md:!p-3"
          />
        </div>
      </div>
    </div>
  );
};

export default FullScreenImageModal;
