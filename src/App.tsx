// src/App.tsx
import React, { JSX, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setUserAndSession, checkUserSession } from './store/authSlice';
import { supabase } from './lib/supabaseClient';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MyCoversPage from './pages/MyCoversPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SettingsPanel from './components/settings/SettingsPanel';
import LoadingSpinner from './components/ui/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useAppSelector(state => state.auth.user);
  const authLoading = useAppSelector(state => state.auth.loading); // Use auth.loading

  if (authLoading) {
    // If auth state is still being determined
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
};

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const authLoading = useAppSelector(state => state.auth.loading); // Get loading state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // checkUserSession should set auth.loading = true initially
    // and auth.loading = false when done.
    dispatch(checkUserSession());

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('App.tsx: onAuthStateChange triggered!', { _event, session });
      // setUserAndSession should also set auth.loading = false
      dispatch(setUserAndSession({ user: session?.user ?? null, session }));
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  // Render a global loading spinner if auth is still loading on initial app mount
  // This gives onAuthStateChange time to process URL hash after OAuth redirect
  if (authLoading && !user) {
    // More specifically, if loading AND no user yet established
    // Check if window.location.hash contains Supabase tokens - indicates OAuth callback
    if (
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('error_description')
    ) {
      console.log('App.tsx: Detected OAuth hash fragment, waiting for processing...');
      // We are in the process of an OAuth callback, show loading.
      // onAuthStateChange should pick this up.
      return (
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" text="Finalizing login..." />
        </div>
      );
    }
    // If no hash, and still loading for checkUserSession, might also show loader
    // but the protected routes will handle this too.
  }

  return (
    <Router>
      <div className="bg-aurora flex min-h-screen flex-col bg-cover bg-no-repeat">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        <main className="container mx-auto flex-grow px-4 py-8">
          <Routes>
            <Route
              path="/auth"
              element={
                authLoading && window.location.hash.includes('access_token') ? (
                  <div className="flex min-h-[70vh] items-center justify-center">
                    <LoadingSpinner size="lg" text="Finalizing login..." />
                  </div>
                ) : !user ? (
                  <AuthPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-covers"
              element={
                <ProtectedRoute>
                  <MyCoversPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
