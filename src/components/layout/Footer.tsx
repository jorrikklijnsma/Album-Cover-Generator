// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-dark/50 mt-auto py-4 text-center">
      <div className="text-text-primary text-sm">
        <p>
          © {new Date().getFullYear()}{' '}
          <a href="https://www.forthepeopleandthefuture.com">For The People And The Future</a>.
        </p>
        <p>Powered by AI, created by Dodoyoyo Media.</p>
      </div>
    </footer>
  );
};

export default Footer;
