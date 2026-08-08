'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import api from '@/utils/api';
import { Lock, User, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AuthPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Login flow
        const res = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showToast(`Welcome back, ${res.data.user.username}!`, 'success');
        router.push('/dashboard');
      } else {
        // Register flow
        await api.post('/auth/register', { username, password });
        showToast('Registration successful! Please log in.', 'success');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Authentication failed';
      showToast(Array.isArray(message) ? message[0] : message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const res = await api.post('/auth/guest');
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      showToast('Logged in as Guest User!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      showToast('Guest Login failed. Make sure the backend is running!', 'error');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background transition-colors duration-300">
      {/* Top Header & Theme Selector */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <label className="text-xs font-semibold text-muted-foreground mr-1">Theme:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="text-xs p-1.5 rounded-lg border border-border bg-card text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer shadow-sm"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="soft-blue">Soft Blue</option>
          <option value="emerald">Emerald</option>
          <option value="sunset">Sunset</option>
        </select>
      </div>

      {/* Main Auth Card Container */}
      <div className="w-full max-w-md bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
        
        {/* Banner area */}
        <div className="bg-gradient-to-r from-primary to-blue-600 p-8 text-white text-center relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="p-3 bg-white/10 rounded-xl mb-1">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">ZenTask</h1>
            <p className="text-sm text-white/80">Organize and execute with clarity</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border bg-muted/30">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3.5 text-center text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
              isLogin
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3.5 text-center text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
              !isLogin
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Or
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Guest Login Button */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="w-full py-3 px-4 rounded-xl border border-primary text-primary font-semibold bg-primary/5 hover:bg-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {guestLoading ? (
              <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Guest Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
