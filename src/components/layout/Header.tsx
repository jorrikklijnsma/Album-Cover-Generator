// src/components/layout/Header.tsx
import React from 'react';
import { RiAlbumLine } from 'react-icons/ri'; // Example icon, or use react-icons

const Header: React.FC = () => {
  return (
    <header className="bg-secondary-dark/80 sticky top-0 z-50 shadow-lg backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-2">
          <RiAlbumLine className="text-accent-blue h-8 w-8" />
          <h1 className="text-text-primary text-2xl font-bold">
            Album Cover <span className="text-accent-blue">Generator</span>
          </h1>
        </div>
        {/* Future: Maybe API key status or user info */}
      </div>
    </header>
  );
};

export default Header;
