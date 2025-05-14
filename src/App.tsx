// src/App.tsx
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { setUserAndSession, checkUserSession } from './store/authSlice';
import { supabase } from './lib/supabaseClient';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SettingsPanel from './components/settings/SettingsPanel';
import { useAppSelector } from './store/hooks';
import { useState } from 'react';

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Check initial session
    dispatch(checkUserSession());

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      dispatch(setUserAndSession({ user: currentUser, session }));
      // If user logs in/out, you might want to re-fetch settings or profile
    });

    return () => {
      // authListener?.unsubscribe();
    };
  }, [dispatch]);

  return (
    <div className="bg-aurora flex min-h-screen flex-col bg-cover bg-no-repeat">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} /> {/* Pass handler for settings */}
      <main className="container mx-auto flex-grow px-4 py-8">
        {user ? <HomePage /> : <AuthPage />}
      </main>
      <Footer />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
