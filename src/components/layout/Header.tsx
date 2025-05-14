// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { RiAlbumLine, RiSettings3Line } from 'react-icons/ri';
import SettingsPanel from '@/components/settings/SettingsPanel'; // New component
// ...
const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <>
      <header className="bg-secondary-dark/80 sticky top-0 z-50 shadow-lg backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <RiAlbumLine className="text-accent-blue h-8 w-8" />
            <h1 className="text-text-primary text-2xl font-bold">
              Album Cover <span className="text-accent-blue">Generator</span>
            </h1>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-text-secondary hover:text-text-primary rounded-md p-2 transition-colors hover:bg-neutral-700"
            title="Settings"
          >
            <RiSettings3Line className="h-6 w-6" />
          </button>
        </div>
      </header>
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;
