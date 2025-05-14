// src/components/modals/CoverDetailModal.tsx
import React from 'react';
import { SavedCover } from '@/pages/MyCoversPage'; // Import the type
import { imageModels } from '@/utils/modelData';
import Button from '@/components/ui/Button';
import {
  RiCloseLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiSettings5Line,
  RiImageLine,
  RiCalendarEventLine,
  RiNumbersLine,
  RiScalesLine,
  RiText,
} from 'react-icons/ri';

interface CoverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cover: SavedCover | null;
  // Add props for actions like onRegenerate, onDelete, etc.
  // onRegenerate: (cover: SavedCover) => void;
}

const DetailItem: React.FC<{
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
  isCode?: boolean;
  isLarge?: boolean;
  onCopy?: () => void;
}> = ({ label, value, icon, isCode, isLarge, onCopy }) => {
  if (value === null || typeof value === 'undefined' || value === '') return null;
  return (
    <div className="border-b border-neutral-700 py-2 last:border-b-0">
      <dt className="text-text-secondary flex items-center text-xs font-medium">
        {icon && <span className="mr-1.5">{icon}</span>}
        {label}
      </dt>
      {isCode ? (
        <dd
          className={`text-text-primary bg-primary-dark group relative mt-1 overflow-x-auto rounded-md p-2 text-xs ${isLarge && 'min-h-32'}`}
        >
          <pre className="text-wrap">
            <code>{String(value)}</code>
          </pre>
          {onCopy && (
            <Button
              size="sm"
              variant="ghost"
              className="!p-1opacity-0 absolute top-1 right-1 group-hover:opacity-100"
              onClick={onCopy}
              title="Copy"
            >
              <RiFileCopyLine />
            </Button>
          )}
        </dd>
      ) : (
        <dd className="text-text-primary mt-1 text-sm">{String(value)}</dd>
      )}
    </div>
  );
};

const CoverDetailModal: React.FC<CoverDetailModalProps> = ({
  isOpen,
  onClose,
  cover /*, onRegenerate */,
}) => {
  if (!isOpen || !cover) return null;

  const modelName =
    imageModels.find(m => m.id === cover.model_id)?.name ||
    cover.model_id?.split('/').pop() ||
    'Unknown';

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // alert("Copied to clipboard!"); // Or use a toast notification
        console.log('Copied:', text);
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-secondary-dark flex max-h-[90vh] w-full max-w-3xl transform flex-col rounded-xl shadow-2xl transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-700 p-4 md:p-6">
          <h3
            className="text-text-primary truncate text-lg font-semibold md:text-xl"
            title={cover.album_title || 'Cover Details'}
          >
            {cover.album_title || 'Cover Details'}
          </h3>
          <Button onClick={onClose} variant="ghost" size="sm" className="!p-2">
            <RiCloseLine className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid flex-grow grid-cols-1 gap-6 overflow-y-auto p-4 md:grid-cols-2 md:p-6">
          {/* Image Column */}
          <div className="flex flex-col items-center">
            {cover.display_image_url && (
              <img
                src={cover.display_image_url}
                alt={cover.album_title || 'Album Cover'}
                className="mb-4 aspect-square w-full max-w-md rounded-lg object-contain shadow-lg"
              />
            )}
            <a
              href={cover.display_image_url}
              target="_blank"
              rel="noopener noreferrer"
              download={`${cover.album_title || 'cover'}.png`}
            >
              <Button variant="secondary" size="sm" iconLeft={<RiExternalLinkLine />}>
                Open Image in New Tab
              </Button>
            </a>
          </div>

          {/* Details Column */}
          <dl className="space-y-1">
            <DetailItem label="Album Title" value={cover.album_title} icon={<RiText />} />
            <DetailItem label="Model" value={modelName} icon={<RiScalesLine />} />
            <DetailItem label="Seed" value={cover.seed} icon={<RiNumbersLine />} />
            <DetailItem
              label="Dimensions"
              value={`${cover.width}x${cover.height}px`}
              icon={<RiImageLine />}
            />
            <DetailItem label="Steps" value={cover.steps} icon={<RiSettings5Line />} />
            <DetailItem label="Guidance (CFG)" value={cover.guidance} icon={<RiSettings5Line />} />
            <DetailItem
              label="Generated On"
              value={new Date(cover.created_at).toLocaleString()}
              icon={<RiCalendarEventLine />}
            />
            <DetailItem
              label="Prompt"
              value={cover.prompt_text}
              isCode
              isLarge
              onCopy={() => copyToClipboard(cover.prompt_text || '')}
              icon={<RiText />}
            />

            {/* Framework Details - uncomment and add if needed */}
            {/* <h4 className="text-sm font-semibold text-accent-blue mt-4 pt-3 border-t border-neutral-700">Framework Details</h4>
                <DetailItem label="Visual Concept" value={cover.framework_visual_concept}/>
                ... add other framework fields ... */}
          </dl>
        </div>

        <div className="flex justify-end space-x-3 border-t border-neutral-700 p-4 md:p-6">
          {/* TODO: Add action buttons like Re-generate, Delete, Set as Favorite etc. */}
          {/* <Button variant="primary" onClick={() => onRegenerate(cover)} iconLeft={<RiRefreshLine/>}>Re-generate</Button> */}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoverDetailModal;
