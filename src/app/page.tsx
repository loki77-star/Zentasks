'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import api from '@/utils/api';
import { Lock, User, Sparkles, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="flex min-h-screen flex-col lg:flex-row bg-background text-foreground transition-colors duration-500 overflow-hidden relative">
      
      {/* 1. Left Side Hero Panel (Premium SaaS Presentation) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-600 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden">
        
        {/* Animated background blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" 
        />

        {/* Brand logo header */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">ZenTask</span>
        </div>

        {/* Hero copy */}
        <div className="space-y-6 max-w-lg relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Manage your work <br />
            with absolute clarity.
          </h1>
          <p className="text-base text-white/75 font-medium leading-relaxed">
            Organize tasks, map dependencies, checklist subtasks, and swap themes dynamically. Experience a modern, highly optimized SaaS task workflow built for high-performance builders.
          </p>

          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-primary bg-sky-300 flex items-center justify-center text-[10px] font-bold text-slate-800">JD</div>
              <div className="w-8 h-8 rounded-full border-2 border-primary bg-emerald-300 flex items-center justify-center text-[10px] font-bold text-slate-800">AS</div>
              <div className="w-8 h-8 rounded-full border-2 border-primary bg-amber-300 flex items-center justify-center text-[10px] font-bold text-slate-800">MK</div>
            </div>
            <span className="text-xs text-white/80 font-bold">Trusted by 5,000+ creators</span>
          </div>
        </div>

        {/* Bottom copyright/footer */}
        <div className="text-xs text-white/50 font-semibold relative z-10">
          © 2026 ZenTask Workspace. All rights reserved.
        </div>
      </div>

      {/* 2. Right Side Authentication Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        
        {/* Mobile Brand Header */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-extrabold tracking-tight text-sm">ZenTask</span>
        </div>

        {/* Top Theme selector */}
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

        {/* Centered Glassmorphic card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border space-y-7 relative"
        >
          {/* Header */}
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {isLogin ? 'Sign in to ZenTask' : 'Create your workspace'}
            </h2>
            <p className="text-xs text-muted-foreground font-semibold leading-normal">
              {isLogin ? 'Enter your details below to login.' : 'Set up a new credential set to sign up.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div className="space-y-4">
              
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-xs font-semibold"
                    required
                  />
                </div>
              </div>

            </div>

            {/* Action button */}
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

            {/* Guest Trigger */}
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

          {/* Toggle Tab Footer */}
          <div className="text-center pt-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
