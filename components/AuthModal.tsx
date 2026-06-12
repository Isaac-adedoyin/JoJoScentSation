'use client';

import { useState, useEffect } from 'react';
import { useAuthModal } from './AuthModalProvider';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthModal() {
  const { isOpen, view, openAuthModal, closeAuthModal } = useAuthModal();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens or view changes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, view]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      setError('Invalid login credentials.');
      setIsLoading(false);
      return;
    }

    const session = await getSession();
    closeAuthModal();
    if (session?.user?.role === 'admin') {
      router.push('/dashboard');
    }
    router.refresh();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (data.success) {
      // Auto-login after successful signup
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (res?.error) {
        setError('Account created, but automatic login failed. Please try logging in manually.');
        setIsLoading(false);
        openAuthModal('login');
        return;
      }

      closeAuthModal();
      router.refresh();
    } else {
      setError(data.error || 'Unable to create account.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('If an account exists with this email, a reset link has been sent.');
      } else {
        setError(data.error || 'Unable to process request.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (view === 'login') return handleLogin(e);
    if (view === 'signup') return handleSignup(e);
    if (view === 'forgot-password') return handleForgotPassword(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md" 
        onClick={closeAuthModal}
        aria-hidden="true"
      />
      
      <div 
        className="relative mx-4 w-full max-w-md transform overflow-hidden rounded-[2rem] border border-border-subtle bg-surface p-8 shadow-sm transition-all sm:p-10"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={closeAuthModal}
          className="absolute right-6 top-6 text-text-muted transition hover:text-gold"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-serif text-3xl text-text-primary text-center">
          {view === 'login' ? 'Welcome back' 
            : view === 'signup' ? 'Create an account' 
            : 'Reset Password'}
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          {view === 'login' ? 'Enter your details to access your account.' 
            : view === 'signup' ? 'Join JoJoScentSation to access exclusive fragrances.'
            : 'Enter your email to receive a password reset link.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {view === 'signup' && (
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-full border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                placeholder="Your full name"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-full border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
              placeholder="Enter your email"
            />
          </div>
          {view !== 'forgot-password' && (
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted">Password</label>
                {view === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => openAuthModal('forgot-password')} 
                    className="text-[10px] uppercase tracking-[0.1em] text-gold hover:text-gold"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-border bg-surface px-5 py-3.5 pr-12 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {error && <p className="text-center text-sm text-[#D96B6B]">{error}</p>}
          {successMsg && <p className="text-center text-sm text-gold">{successMsg}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-6 w-full rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
          >
            {isLoading ? 'Please wait...' 
              : view === 'login' ? 'Log in' 
              : view === 'signup' ? 'Sign up' 
              : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          {view === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button 
                type="button"
                onClick={() => openAuthModal('signup')} 
                className="font-medium text-gold underline underline-offset-2 transition hover:text-gold"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              {view === 'forgot-password' ? 'Remember your password?' : 'Already have an account?'} {' '}
              <button 
                type="button"
                onClick={() => openAuthModal('login')} 
                className="font-medium text-gold underline underline-offset-2 transition hover:text-gold"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
