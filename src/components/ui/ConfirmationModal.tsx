// src/components/ui/ConfirmationModal.tsx
import React from 'react';
import { RiAlertLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-secondary-dark w-full max-w-md transform rounded-xl p-6 shadow-2xl transition-all">
        <div className="flex items-start">
          <div className="bg-accent-pink/20 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <RiAlertLine className="text-accent-pink h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-text-primary text-lg leading-6 font-semibold" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-text-secondary text-sm">{message}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="bg-accent-pink hover:bg-accent-pink/80 focus-visible:outline-accent-pink inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2"
            onClick={onConfirm}
          >
            <RiCheckLine className="mr-1.5 h-5 w-5" />
            {confirmText}
          </button>
          <button
            type="button"
            className="bg-primary-dark text-text-primary mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-neutral-600 transition-colors ring-inset hover:bg-neutral-700 sm:col-start-1 sm:mt-0"
            onClick={onCancel}
          >
            <RiCloseLine className="mr-1.5 h-5 w-5" />
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
