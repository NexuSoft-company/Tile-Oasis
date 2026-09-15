/**
 * Admin Login & Dual-Layer Secret Verification View
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 *
 * Enforces:
 * - Direct Dual-Factor: Administrator Email + Master Password + Master Secret Key
 * - Brute-Force lockout protection (5 attempts maximum)
 * - Zero unauthenticated bypass: Always requires credentials to access Admin Dashboard
 */

import React, { useState } from 'react';
import {
  globalAdminAuthService,
  PRIMARY_SUPER_ADMIN_EMAIL,
  PRIMARY_SUPER_ADMIN_EMAILS,
} from '../../services/admin/AdminAuthService';
import { AdminSession } from '../../types/adminDashboard';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Palmtree,
  ArrowLeft,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: (session: AdminSession) => void;
  onExitToGame: () => void;
  initialMessage?: string;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onExitToGame,
  initialMessage,
}) => {
  const [emailInput, setEmailInput] = useState<string>(PRIMARY_SUPER_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [secretKeyInput, setSecretKeyInput] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(initialMessage || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!emailInput.trim()) {
      setErrorMessage('Please enter an authorized administrator email.');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMessage('Please enter the administrator password.');
      return;
    }
    if (!secretKeyInput.trim()) {
      setErrorMessage('Please enter the Master Secret Key.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const result = globalAdminAuthService.loginWithPasswordAndKey(
        emailInput,
        passwordInput,
        secretKeyInput
      );
      setIsLoading(false);

      if (!result.success || !result.session) {
        setErrorMessage(result.message);
        return;
      }

      setSuccessMessage('Credentials verified! Access granted to Master Admin Dashboard.');
      setTimeout(() => {
        onLoginSuccess(result.session!);
      }, 350);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Link back to Player Game */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onExitToGame}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Player Game</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 backdrop-blur-xl">
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
              <Palmtree className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center justify-center space-x-1.5 text-teal-400 text-[11px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Gateway</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Tile Oasis Admin</h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Protected by Master Password & Secret Access Key
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* 1. Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Administrator Email</span>
                <span className="text-[10px] text-teal-400 font-mono">Authorized Accounts</span>
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="shahroz.mughal.31@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-teal-400 transition-all font-mono"
                />
              </div>
            </div>

            {/* Quick Super Admin Email Selectors */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {PRIMARY_SUPER_ADMIN_EMAILS.map((email) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => setEmailInput(email)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all border ${
                    emailInput.toLowerCase() === email.toLowerCase()
                      ? 'bg-teal-500/20 border-teal-500/60 text-teal-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {email.split('@')[0]}@...
                </button>
              ))}
            </div>

            {/* 2. Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Admin Password</span>
                <span className="text-[10px] text-slate-500">Master Protected</span>
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-teal-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. Master Secret Key */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Master Secret Key</span>
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">2nd Security Layer</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  required
                  value={secretKeyInput}
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                  placeholder="Type your 8 digit master pin"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-teal-300 font-mono placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-teal-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 p-0.5"
                  title={showSecretKey ? 'Hide secret key' : 'Show secret key'}
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Default Credentials Helper Card */}
            <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-[11px] text-teal-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-teal-300">
                <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Super Admin Credentials Info</span>
              </div>
              <div className="space-y-0.5 font-mono text-[10px] text-slate-300">
                <div>
                  • Default Password: <span className="text-amber-300 font-bold select-all">Shahroz@786</span>
                </div>
                <div>
                  • Master Secret Key is hidden for security.
                </div>
              </div>
              <div className="text-[10px] text-teal-400/80 pt-0.5">
                Tip: You can customize and change both the Password and Secret Key anytime inside Admin Dashboard settings.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying Security Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock & Open Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Tile Oasis Engine v2.0.0</span>
            <span className="flex items-center space-x-1 text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AES-256 Dual Shield</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
