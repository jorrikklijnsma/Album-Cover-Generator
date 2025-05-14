// src/components/generator/ApiKeyInput.tsx
import React, { useState } from 'react';
import { RiKey2Line, RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onChange }) => {
  const [showKey, setShowKey] = useState(false);
  return (
    <div>
      <label htmlFor="apiKey" className="text-text-secondary mb-1 block text-sm font-medium">
        Together API Key
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <RiKey2Line className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type={showKey ? 'text' : 'password'}
          name="apiKey"
          id="apiKey"
          className="bg-primary-dark/80 text-text-primary focus:ring-accent-blue block w-full rounded-md border-0 py-2.5 pl-10 shadow-sm ring-1 ring-neutral-600 transition-all ring-inset placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Enter your API Key"
          value={apiKey}
          onChange={e => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="hover:text-accent-blue absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
          aria-label={showKey ? 'Hide API Key' : 'Show API Key'}
        >
          {showKey ? <RiEyeCloseLine className="h-5 w-5" /> : <RiEyeLine className="h-5 w-5" />}
        </button>
      </div>
      <p className="text-text-secondary mt-1 text-xs">
        Your API key is stored locally in your browser.
      </p>
    </div>
  );
};

export default ApiKeyInput;
