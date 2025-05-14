// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAppDispatch } from '@/store/hooks';
import { setAuthError, setAuthLoading } from '@/store/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { RiMailLine, RiLockPasswordLine, RiUserAddLine, RiLoginBoxLine } from 'react-icons/ri';

const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));
    setLoading(true);
    setMessage(null);

    try {
      let response;
      if (isLoginView) {
        response = await supabase.auth.signInWithPassword({ email, password });
      } else {
        response = await supabase.auth.signUp({
          email,
          password,
          // options: { data: { full_name: 'Test User' } } // Optional: add initial user metadata
        });
      }

      if (response.error) {
        throw response.error;
      }

      if (!isLoginView && response.data.user && response.data.session === null) {
        setMessage(
          'Signup successful! Please check your email to verify your account before logging in.'
        );
      }
      // onAuthStateChange in App.tsx will handle setting user in Redux store for login
    } catch (error: any) {
      console.error('Auth error:', error);
      dispatch(setAuthError(error.message || 'An unexpected error occurred.'));
      setMessage(error.message || 'An unexpected error occurred.');
    } finally {
      dispatch(setAuthLoading(false));
      setLoading(false);
    }
  };

  // Optional: Social Login (e.g., Google)
  const handleGoogleLogin = async () => {
    dispatch(setAuthLoading(true));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      dispatch(setAuthError(error.message));
      dispatch(setAuthLoading(false));
    }
    // Supabase handles the redirect and onAuthStateChange will pick it up.
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <h2 className="text-text-primary mb-6 text-center text-2xl font-bold">
          {isLoginView ? 'Login to Your Account' : 'Create an Account'}
        </h2>
        {message && (
          <p
            className={`mb-4 rounded-md p-3 text-sm ${message.includes('verify') ? 'bg-yellow-800/50 text-yellow-300' : 'bg-red-800/50 text-red-300'}`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <Input
            type="email"
            label="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            iconLeft={<RiMailLine className="h-5 w-5 text-neutral-400" />}
            required
            placeholder="you@example.com"
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            iconLeft={<RiLockPasswordLine className="h-5 w-5 text-neutral-400" />}
            required
            placeholder="••••••••"
          />
          <Button type="submit" isLoading={loading} className="w-full" variant="primary">
            {isLoginView ? (
              <>
                <RiLoginBoxLine className="mr-2" /> Login
              </>
            ) : (
              <>
                <RiUserAddLine className="mr-2" /> Sign Up
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setMessage(null);
            }}
            className="text-accent-blue text-sm hover:underline"
          >
            {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>

        {/* Optional: Social Logins Separator */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-neutral-600"></div>
          <span className="text-text-secondary mx-4 flex-shrink text-xs">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-neutral-600"></div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          variant="secondary"
          className="w-full"
          iconLeft={<img src="/google-icon.svg" alt="Google" className="h-5 w-5" />}
        >
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
};

export default AuthPage;
