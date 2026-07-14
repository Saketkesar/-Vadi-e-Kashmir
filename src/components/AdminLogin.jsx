// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await authService.loginWithEmail(email, password);
    
    setLoading(false);

    if (result.success) {
      if (result.user.email === 'admin@vadikashmir.com') {
        toast.success('Welcome back, Admin!');
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        toast.error('Access denied. Admin credentials required.');
        await authService.logout();
      }
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6eb] flex items-center justify-center p-4 font-sans relative">
      {/* Decorative Warm Accent Blur Circles */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-100/30 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Card Header & Brand Logo */}
        <div className="text-center">
          <img 
            src="/vadielogo.png" 
            alt="VadieKashmir Logo" 
            className="h-16 w-auto mx-auto object-contain mb-3" 
          />
          <h2 className="text-2xl font-serif font-extrabold italic text-stone-800 tracking-wide">
            Admin Portal
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            VadieKashmir Shop Administration
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-stone-200/80 shadow-[0_15px_35px_rgba(44,38,28,0.06)] rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-500 tracking-widest uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vadikashmir.com"
                  className="w-full bg-stone-50/60 text-stone-900 placeholder-stone-400 border border-stone-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-500 tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50/60 text-stone-900 placeholder-stone-400 border border-stone-200 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all rounded-xl duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <button
              onClick={() => window.location.hash = '#home'}
              className="text-stone-500 hover:text-amber-800 text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              ← Back to Store
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center text-[10px] text-stone-400 uppercase tracking-widest">
          Secure Monitored Connection
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
