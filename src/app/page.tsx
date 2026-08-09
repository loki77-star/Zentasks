'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import api from '@/utils/api';
import { Lock, User, Sparkles, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => {
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
        const res = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showToast(`Welcome back, ${res.data.user.username}!`, 'success');
        router.push('/dashboard');
      } else {
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background transition-colors duration-500 overflow-hidden relative">
      {/* Premium Background Decorative Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Theme Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 right-6 flex items-center gap-2 z-10"
      >
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-1">Theme:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="text-[10px] p-1.5 rounded-lg border border-border bg-card text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer shadow-sm font-bold uppercase tracking-wider"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="soft-blue">Soft Blue</option>
          <option value="emerald">Emerald</option>
          <option value="sunset">Sunset</option>
        </select>
      </motion.div>

      {/* Main Centered Auth Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden relative z-10"
      >
        
        {/* Banner area with sunset/theme gradient */}
        <div className="bg-gradient-to-r from-primary to-blue-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 8 }}
              className="p-3 bg-white/10 rounded-xl mb-1 cursor-pointer"
            >
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
            </motion.div>
            <h1 className="text-2xl font-extrabold tracking-tight">ZenTask</h1>
            <p className="text-xs text-white/80 font-medium">Organize and execute with clarity</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border bg-muted/20 relative">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className="flex-1 py-3.5 text-center text-xs font-bold transition-all duration-300 cursor-pointer relative z-10 text-foreground uppercase tracking-wider"
          >
            Sign In
            {isLogin && (
              <motion.div 
                layoutId="activeTabBorder"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className="flex-1 py-3.5 text-center text-xs font-bold transition-all duration-300 cursor-pointer relative z-10 text-foreground uppercase tracking-wider"
          >
            Create Account
            {!isLogin && (
              <motion.div 
                layoutId="activeTabBorder"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/80">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-xs font-semibold"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/80">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-xs font-semibold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-xs mt-6"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Or
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Guest Login Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="w-full py-3 px-4 rounded-xl border border-primary text-primary font-bold bg-primary/5 hover:bg-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
          >
            {guestLoading ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Instant Guest Login
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
