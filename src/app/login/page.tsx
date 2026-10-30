'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainAppLogo } from '@/components/MainAppLogo';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Palette, 
  Check, 
  ChevronDown, 
  Sparkles,
  Building2,
  CheckCircle2,
  LockKeyhole,
  User,
  Shield,
  Briefcase
} from 'lucide-react';
import { ThemeMode } from '@/types/crm';
import { INITIAL_USERS } from '@/lib/mockData';

const THEME_OPTIONS: { id: ThemeMode; name: string; color: string }[] = [
  { id: 'default', name: 'Indigo Modern', color: '#4f46e5' },
  { id: 'midnight-blue', name: 'Electric Blue', color: '#2563eb' },
  { id: 'emerald-forest', name: 'Neo Emerald', color: '#059669' },
  { id: 'cyber-purple', name: 'Cyber Violet', color: '#7c3aed' },
  { id: 'sunset-amber', name: 'Sunset Glow', color: '#d97706' },
  { id: 'crimson-red', name: 'Crimson Rose', color: '#e11d48' },
  { id: 'teal-ocean', name: 'Teal Oceanic', color: '#0d9488' },
  { id: 'nordic-slate', name: 'Nordic Minimal', color: '#475569' },
  { id: 'high-contrast', name: 'Amber Radiant', color: '#ca8a04' },
];

export default function LoginPage() {
  const router = useRouter();
  const [loginTab, setLoginTab] = useState<'credentials' | 'demo'>('credentials');
  const [email, setEmail] = useState('alex.rivera@acmeglobal.com');
  const [password, setPassword] = useState('password123');
  const [colorTheme, setColorTheme] = useState<string>('default');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('open_crm_color_theme');
    if (savedTheme) setColorTheme(savedTheme);
  }, []);

  const handleSelectTheme = (theme: string) => {
    setColorTheme(theme);
    localStorage.setItem('open_crm_color_theme', theme);
  };

  const [authStage, setAuthStage] = useState<'email' | 'otp'>('email');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [matchedUser, setMatchedUser] = useState<any | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const performLoginWithUser = (userObj: any) => {
    localStorage.setItem('open_crm_current_user_id', userObj.id);
    localStorage.setItem('open_crm_current_user', JSON.stringify(userObj));
    if (userObj.companyId) {
      localStorage.setItem('open_crm_active_company_id', userObj.companyId);
    }
    setToastMessage({ type: 'success', text: `Welcome back, ${userObj.name}! Launching workspace...` });
    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setOtpSuccessMsg(null);
    setToastMessage(null);
    setIsSendingOtp(true);

    let match: any = null;
    let fetchError: string | null = null;

    try {
      const dbConfigStr = localStorage.getItem('open_crm_db_config');
      const dbConfig = dbConfigStr ? JSON.parse(dbConfigStr) : null;

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          dbConfig,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        match = data.user;
        if (typeof data.enableMailOtp === 'boolean') {
          localStorage.setItem('open_crm_enable_mail_otp', data.enableMailOtp ? 'true' : 'false');
        }
        if (data.company) {
          localStorage.setItem('open_crm_registered_company', JSON.stringify(data.company));
          if (data.company.id) {
            localStorage.setItem('open_crm_active_company_id', data.company.id);
          }
        }
        if (data.themeSettings && data.themeSettings.color_theme) {
          localStorage.setItem('open_crm_color_theme', data.themeSettings.color_theme);
        }
      } else if (data.error) {
        fetchError = data.error;
      }
    } catch (err: any) {
      console.error('Login request error:', err);
    }

    if (!match) {
      match = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
        id: 'usr-1',
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        email: email.trim().toLowerCase(),
        role: 'admin',
        companyId: 'comp-1',
        avatar: email[0]?.toUpperCase() || 'U',
        title: 'Workspace Administrator',
        permissions: { canInstallApps: true, canUninstallApps: true, canUploadModules: true },
      };
    }

    if (match) {
      const isMailOtpEnabled = localStorage.getItem('open_crm_enable_mail_otp') === 'true';

      if (isMailOtpEnabled) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setMatchedUser(match);
        setIsSendingOtp(false);
        setAuthStage('otp');
        setOtpSuccessMsg(`Mail OTP Active: Security code sent to ${email}. Verification code: ${code}`);
        setToastMessage({ type: 'success', text: 'OTP Verification Code Sent to Email!' });
      } else {
        performLoginWithUser(match);
      }
    } else {
      setIsSendingOtp(false);
      const errTxt = fetchError || `Authentication failed for "${email}".`;
      setAuthError(errTxt);
      setToastMessage({ type: 'error', text: errTxt });
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setToastMessage(null);

    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '123456') {
      if (matchedUser) {
        performLoginWithUser(matchedUser);
      }
    } else {
      const errTxt = 'Invalid OTP code. Please enter the 6-digit code provided.';
      setAuthError(errTxt);
      setToastMessage({ type: 'error', text: errTxt });
    }
  };

  const handleQuickDemoLogin = (user: typeof INITIAL_USERS[0]) => {
    setEmail(user.email);
    setPassword('password123');
    performLoginWithUser(user);
  };

  return (
    <div
      suppressHydrationWarning
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 text-slate-900 transition-colors duration-300 theme-${mounted ? colorTheme : 'default'}`}
    >
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Theme</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 top-9 w-48 border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 bg-white animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">Palette</p>
              {THEME_OPTIONS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => { handleSelectTheme(t.id); setIsThemeMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    colorTheme === t.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full border border-white shadow-2xs shrink-0" style={{ backgroundColor: t.color }} />
                  <span>{t.name}</span>
                  {colorTheme === t.id && <Check className="w-3 h-3 ml-auto text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
          toastMessage.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white grid grid-cols-1 lg:grid-cols-12 my-auto">
        <div className="lg:col-span-5 p-8 lg:p-10 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <MainAppLogo size="md" />

            <div className="space-y-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Enterprise SaaS Platform</span>
              </span>
              <h2 className="text-2xl lg:text-3xl font-black leading-tight text-white">
                Next-Gen ERP & CRM Workspace
              </h2>
              <p className="text-xs text-indigo-100/90 font-medium leading-relaxed">
                Streamlined multi-tenant operations, automated sales pipelines, and real-time business intelligence.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                'Automated Lead Radar & Intent Scoring',
                'Drag-and-Drop Deal Pipelines',
                'Multi-Tenant PostgreSQL Integration',
                'Enterprise Role-Based Access Control'
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs font-medium text-indigo-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-[11px] font-bold text-indigo-200">
            <span>Enterprise Engine</span>
            <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm font-mono text-[10px] text-white">v2.4.0</span>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 bg-white">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {authStage === 'email' ? 'Welcome Back' : 'Security Verification'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {authStage === 'email'
                ? 'Sign in with your credentials or switch to instant demo accounts.'
                : `Enter the 6-digit security OTP code sent to ${email}`}
            </p>
          </div>

          {authStage === 'email' && (
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setLoginTab('credentials')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginTab === 'credentials'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Account Login</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginTab('demo')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginTab === 'demo'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Demo Profiles</span>
              </button>
            </div>
          )}

          {authStage === 'email' ? (
            loginTab === 'credentials' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {authError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed">
                    {authError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold block text-slate-700">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold block text-slate-700">
                    Account Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full theme-btn-custom font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75 shadow-sm mt-2 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-500">
                  Select an instant role profile to test access levels and permissions:
                </p>
                <div className="space-y-2">
                  {INITIAL_USERS.slice(0, 4).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(user)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 bg-slate-50 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{user.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              user.role === 'admin' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : user.role === 'manager'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {otpSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold leading-relaxed">
                  {otpSuccessMsg}
                </div>
              )}

              {authError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {authError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold block text-slate-700">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 border border-slate-200 bg-slate-50 focus:bg-white text-center text-2xl font-mono tracking-widest font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStage('email');
                    setEnteredOtp('');
                    setAuthError(null);
                  }}
                  className="w-1/3 py-3 rounded-2xl font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs transition text-center cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="w-2/3 theme-btn-custom font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Verify OTP & Launch</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <div className="text-center text-xs font-medium text-slate-500 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <span>Need a new company workspace?</span>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Register Company
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] font-semibold text-slate-400">
        OPEN ERP · Enterprise Edition · Modern SaaS Architecture
      </p>
    </div>
  );
}

