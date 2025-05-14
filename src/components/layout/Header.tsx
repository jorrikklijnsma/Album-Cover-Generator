// src/components/layout/Header.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout as performLogout, setAuthError } from '@/store/authSlice'; // Renamed to avoid conflict
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import {
  RiAlbumLine,
  RiArtboardLine,
  RiLogoutBoxRLine,
  RiSettings3Line,
  RiUserLine,
} from 'react-icons/ri';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      dispatch(setAuthError(error.message)); // Optional: dispatch error to store
    } else {
      dispatch(performLogout()); // Update UI immediately via Redux
    }
  };

  return (
    <header className="bg-secondary-dark/80 sticky top-0 z-50 shadow-lg backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <RouterLink to="/">
          <div className="flex items-center space-x-3">
            <RiAlbumLine className="text-accent-blue h-8 w-8" />
            <h1 className="text-text-primary text-xl font-bold md:text-2xl">
              Album Cover <span className="text-accent-blue">Generator</span>
            </h1>
          </div>
        </RouterLink>
        <div className="flex items-center space-x-2 md:space-x-3">
          {user && (
            <>
              <RouterLink to="/my-covers">
                <IconButton
                  icon={<RiArtboardLine className="h-5 w-5 md:h-6 md:w-6" />}
                  tooltip="My Covers"
                  variant="ghost"
                />
              </RouterLink>
              <IconButton
                icon={<RiSettings3Line className="h-5 w-5 md:h-6 md:w-6" />}
                onClick={onOpenSettings}
                tooltip="Settings"
                variant="ghost"
              />
            </>
          )}
          {user ? (
            <>
              <span className="text-text-secondary hidden text-sm md:block">
                {user.email?.split('@')[0]}
              </span>
              <Button
                onClick={handleLogout}
                variant="secondary"
                size="sm"
                iconLeft={<RiLogoutBoxRLine />}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" iconLeft={<RiUserLine />}>
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
