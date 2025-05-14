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

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useAppSelector(state => state.auth.user);
  const loading = useAppSelector(state => state.auth.loading);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
};

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user); // For conditional rendering in main layout if needed
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // src/App.tsx
  useEffect(() => {
    console.log('App.tsx: Setting up onAuthStateChange listener.');
    dispatch(checkUserSession()); // Check existing session first

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('App.tsx: onAuthStateChange triggered!', { _event, session });
      const currentUser = session?.user || null;
      dispatch(setUserAndSession({ user: currentUser, session }));
      if (currentUser) {
        console.log('App.tsx: User session established:', currentUser.email);
      } else {
        console.log('App.tsx: No user session or user logged out.');
      }
    });

    return () => {
      console.log('App.tsx: Cleaning up onAuthStateChange listener.');
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkUserSession());
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      dispatch(setUserAndSession({ user: session?.user ?? null, session }));
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <Router>
      {/* Wrap with Router */}
      <div className="bg-aurora flex min-h-screen flex-col bg-cover bg-no-repeat">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        <main className="container mx-auto flex-grow px-4 py-8">
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" replace />} />
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" replace />} />
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
