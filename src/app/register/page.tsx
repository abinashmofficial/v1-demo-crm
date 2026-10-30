'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainAppLogo } from '@/components/MainAppLogo';
import { 
  Building2, 
  Database, 
  Upload, 
  AppWindow, 
  CheckCircle2, 
  Palette, 
  Check, 
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Server,
  Key,
  Globe,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ThemeMode, PostgresDbConfig, Company, UserProfile } from '@/types/crm';
import { INITIAL_APPS } from '@/lib/mockData';

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

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Step 1: General Company Info
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [plan, setPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Starter');

  // Step 2: PostgreSQL Database Config
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState<number | ''>(5432);
  const [dbName, setDbName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [sslMode, setSslMode] = useState<'disable' | 'require'>('disable');
  const [enableMailOtp, setEnableMailOtp] = useState<boolean>(false);
  const [mailHost, setMailHost] = useState('smtp.gmail.com');
  const [mailPort, setMailPort] = useState<number | ''>(587);
  const [mailUser, setMailUser] = useState('');
  const [mailPassword, setMailPassword] = useState('');
  const [dbStatus, setDbStatus] = useState<'idle' | 'testing' | 'connected'>('idle');

  // Step 3: Logo Upload & Branding
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Step 4: Demo Data Apps Selection
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  // Step 5: Admin Account Credentials
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

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

  const isLight = true;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [dbErrorMsg, setDbErrorMsg] = useState<string | null>(null);

  const handleTestPostgresConnection = async () => {
    setDbStatus('testing');
    setDbErrorMsg(null);

    try {
      const response = await fetch('/api/test-postgres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: dbHost,
          port: Number(dbPort) || 5432,
          database: dbName,
          user: dbUser,
          password: dbPassword,
          ssl: sslMode === 'require',
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDbStatus('connected');
      } else {
        setDbStatus('idle');
        setDbErrorMsg(data.error || 'Connection failed. Verify host, credentials & database existence.');
      }
    } catch (err: any) {
      setDbStatus('idle');
      setDbErrorMsg(err.message || 'Network error attempting to contact PostgreSQL.');
    }
  };

  const toggleAppSelection = (appId: string) => {
    setSelectedApps((prev) => 
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      setStepError('Please complete all Admin Credentials fields.');
      return;
    }

    setIsSubmitting(true);
    setStepError(null);

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: companyName,
      code: companyCode.toUpperCase(),
      currency,
      logo: companyName[0]?.toUpperCase() || 'C',
      customLogoUrl: logoPreview || undefined,
      plan,
      createdAt: new Date().toISOString(),
      selectedDemoApps: selectedApps,
      dbConfig: {
        host: dbHost,
        port: Number(dbPort) || 5432,
        dbName,
        dbUser,
        dbPassword,
        sslMode,
        status: 'Connected',
      },
    };

    const newAdminUser: UserProfile = {
      id: `usr-admin-${Date.now()}`,
      name: adminName,
      email: adminEmail,
      role: 'admin',
      companyId: newCompany.id,
      avatar: adminName[0]?.toUpperCase() || 'A',
      title: 'Company Administrator',
      permissions: {
        canInstallApps: true,
        canUninstallApps: true,
        canUploadModules: true,
      },
    };

    try {
      const response = await fetch('/api/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: newCompany,
          adminUser: newAdminUser,
          dbConfig: newCompany.dbConfig,
          selectedApps: selectedApps,
          mailConfig: {
            enableMailOtp,
            mailHost,
            mailPort: Number(mailPort) || 587,
            mailUser,
            mailPassword,
          },
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        setStepError(resData.error || 'Failed to save company registration details to PostgreSQL.');
        setIsSubmitting(false);
        return;
      }
    } catch (err: any) {
      console.error('Registration persistence error:', err);
    }

    localStorage.setItem('open_crm_current_user_id', newAdminUser.id);
    localStorage.setItem('open_crm_active_company_id', newCompany.id);
    localStorage.setItem('open_crm_registered_company', JSON.stringify(newCompany));
    localStorage.setItem('open_crm_db_config', JSON.stringify(newCompany.dbConfig));
    localStorage.setItem('open_crm_enable_mail_otp', enableMailOtp ? 'true' : 'false');
    router.push('/');
  };

  const [maxCompletedStep, setMaxCompletedStep] = useState<number>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  const canAdvanceFromStep = (targetStep: number): boolean => {
    setStepError(null);
    if (targetStep >= 2) {
      if (!companyName.trim() || !companyCode.trim()) {
        setStepError('Please complete Step 1 (Company Legal Name & Code) before proceeding.');
        return false;
      }
    }
    if (targetStep >= 3) {
      if (!dbHost.trim() || !dbName.trim() || !dbUser.trim()) {
        setStepError('Please complete Step 2 (PostgreSQL Host, Database Name & User) before proceeding.');
        return false;
      }
    }
    if (targetStep >= 4) {
      // Step 3 is optional logo upload
    }
    if (targetStep >= 5) {
      if (selectedApps.length === 0) {
        setStepError('Please select at least 1 enterprise demo app in Step 4 before proceeding to Admin Setup.');
        return false;
      }
    }
    return true;
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
      setStepError(null);
    } else if (targetStep <= maxCompletedStep) {
      setStep(targetStep);
      setStepError(null);
    } else {
      if (canAdvanceFromStep(step + 1)) {
        setStep(step + 1);
        setMaxCompletedStep((prev) => Math.max(prev, step + 1));
      }
    }
  };

  const handleNextStep = (nextStep: number) => {
    if (canAdvanceFromStep(nextStep)) {
      setStep(nextStep);
      setMaxCompletedStep((prev) => Math.max(prev, nextStep));
    }
  };

  return (
    <div 
      suppressHydrationWarning 
      className={`min-h-screen relative flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-slate-50 text-slate-900 transition-colors duration-300 theme-${mounted ? colorTheme : 'default'}`}
    >
      {/* Top Header Floating Bar */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 z-50">
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Theme</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 top-9 w-48 border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 bg-white animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">Color Palette</p>
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    handleSelectTheme(t.id);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
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

      <div className="max-w-2xl w-full rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl border border-slate-200 bg-white my-auto">
        <div className="flex flex-col items-center text-center space-y-2">
          <MainAppLogo size="lg" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-2">
            Register Company Workspace
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-sm">
            Configure your enterprise tenant, database connections, and administrative account.
          </p>
        </div>

        {/* 5-Step Stepper & Progressing Design */}
        <div className="relative py-2">
          <div className="flex items-center justify-between relative z-10">
            {[
              { stepNum: 1, label: 'Company' },
              { stepNum: 2, label: 'Postgres' },
              { stepNum: 3, label: 'Branding' },
              { stepNum: 4, label: 'Apps' },
              { stepNum: 5, label: 'Admin' },
            ].map((item, idx) => {
              const isCompleted = step > item.stepNum;
              const isCurrent = step === item.stepNum;
              return (
                <div 
                  key={item.stepNum} 
                  onClick={() => handleStepClick(item.stepNum)}
                  className="flex flex-col items-center cursor-pointer group space-y-1.5"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : isCurrent
                        ? 'theme-btn-custom ring-4 ring-indigo-500/20 text-white scale-110'
                        : 'bg-slate-200 text-slate-500 border border-slate-300'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4 text-white" /> : item.stepNum}
                  </div>
                  <span className={`text-[10px] font-extrabold transition ${
                    isCurrent 
                      ? 'theme-svg-custom font-black scale-105' 
                      : isCompleted 
                        ? 'text-emerald-600' 
                        : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Connecting Track Line */}
          <div className="absolute top-6 left-5 right-5 h-1 bg-slate-200 -z-0 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 transition-all duration-500" 
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {stepError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold animate-shake">
            {stepError}
          </div>
        )}

        {/* STEP 1: General Company Information */}
        {step === 1 && (
          <div className="space-y-4 text-xs animate-fade-in">
            <h3 className="font-extrabold text-sm border-b pb-2 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span>Step 1: General Company Information</span>
            </h3>

            <div>
              <label className="font-bold block mb-1">Company Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Enterprise Global"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Company Code Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ACME"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Enterprise Subscription Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Starter', 'Pro', 'Enterprise'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={`p-3 rounded-xl border font-bold text-center transition ${
                      plan === p
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleNextStep(2)}
                className="px-6 py-2.5 rounded-xl theme-btn-custom font-extrabold shadow-md flex items-center space-x-2 text-xs"
              >
                <span>Continue to PostgreSQL Config</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PostgreSQL Database Configuration */}
        {step === 2 && (
          <div className="space-y-4 text-xs animate-fade-in">
            <h3 className="font-extrabold text-sm border-b pb-2 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-cyan-500" />
                <span>Step 2: PostgreSQL Database Connection Settings</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-500 font-bold">
                PostgreSQL Engine
              </span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="font-bold block mb-1">Postgres Host</label>
                <div className="relative">
                  <Server className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type="text"
                    placeholder="localhost or postgres.internal"
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                    className="w-full rounded-xl pl-9 pr-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Port</label>
                <input
                  type="number"
                  placeholder="5432"
                  value={dbPort}
                  onChange={(e) => setDbPort(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold block mb-1">Database Name</label>
                <input
                  type="text"
                  placeholder="openerp_company_db"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Database User</label>
                <input
                  type="text"
                  placeholder="postgres"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Database Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>
            </div>

            {dbErrorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                {dbErrorMsg}
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-300">
              <div>
                <span className="font-extrabold text-xs block">SSL Mode</span>
                <span className="text-[10px] opacity-70">Enable SSL encryption for database instance.</span>
              </div>
              <button
                type="button"
                onClick={() => setSslMode(sslMode === 'require' ? 'disable' : 'require')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  sslMode === 'require' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {sslMode === 'require' ? 'SSL Enabled' : 'SSL Disabled'}
              </button>
            </div>

            <div className="space-y-3 p-3.5 rounded-xl bg-slate-100 border border-slate-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs block">Mail OTP Authentication Configuration</span>
                  <span className="text-[10px] opacity-70">Enable to require 6-digit email OTP codes on login. If disabled, users log in directly using email & password.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableMailOtp(!enableMailOtp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    enableMailOtp ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {enableMailOtp ? 'Mail OTP Yes' : 'Mail OTP No'}
                </button>
              </div>

              {enableMailOtp && (
                <div className="pt-3 border-t border-slate-200 space-y-3 animate-fade-in">
                  <h4 className="font-extrabold text-xs theme-svg-custom">Company SMTP Mail Server Settings</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="font-bold block mb-1">SMTP Host</label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com or mail.company.com"
                        value={mailHost}
                        onChange={(e) => setMailHost(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 border font-semibold focus:outline-none bg-white border-slate-300 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Port</label>
                      <input
                        type="number"
                        placeholder="587"
                        value={mailPort}
                        onChange={(e) => setMailPort(e.target.value ? Number(e.target.value) : '')}
                        className="w-full rounded-xl px-4 py-2.5 border font-semibold focus:outline-none bg-white border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1">Mail Account / User</label>
                      <input
                        type="text"
                        placeholder="noreply@company.com"
                        value={mailUser}
                        onChange={(e) => setMailUser(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 border font-semibold focus:outline-none bg-white border-slate-300 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Mail Password / App Secret</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={mailPassword}
                        onChange={(e) => setMailPassword(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 border font-semibold focus:outline-none bg-white border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestPostgresConnection}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-extrabold text-xs flex items-center space-x-2 shadow-md hover:bg-cyan-500 transition"
              >
                {dbStatus === 'testing' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Testing Connection...</span>
                  </>
                ) : dbStatus === 'connected' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>PostgreSQL Connected!</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Test Postgres Connection</span>
                  </>
                )}
              </button>

              {dbStatus === 'connected' && (
                <span className="text-xs font-extrabold text-emerald-600 flex items-center space-x-1">
                  <span>✓ Verified Database Handshake</span>
                </span>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border font-bold flex items-center space-x-2 text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Company Info</span>
              </button>

              <button
                type="button"
                onClick={() => handleNextStep(3)}
                className="px-6 py-2.5 rounded-xl theme-btn-custom font-extrabold shadow-md flex items-center space-x-2 text-xs"
              >
                <span>Continue to Logo Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Uploadable Company Logo & Branding */}
        {step === 3 && (
          <div className="space-y-4 text-xs animate-fade-in">
            <h3 className="font-extrabold text-sm border-b pb-2 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-purple-500" />
              <span>Step 3: Uploadable Company Logo & Branding</span>
            </h3>

            <div className="text-center py-6 space-y-4 bg-slate-100 p-6 rounded-2xl border border-dashed border-slate-300">
              {logoPreview ? (
                <div className="space-y-3">
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-24 h-24 mx-auto rounded-2xl object-cover shadow-xl border-2 border-indigo-500"
                  />
                  <p className="text-xs font-bold text-emerald-600">
                    Logo Image Ready for Database Storage!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-extrabold text-3xl shadow-inner border border-indigo-200">
                    {companyName[0] || 'C'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">Upload Corporate Logo</h4>
                    <p className="text-[11px] opacity-70">PNG, JPG, or SVG logos up to 5MB.</p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="company-logo-upload"
              />
              <label
                htmlFor="company-logo-upload"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold cursor-pointer shadow-md hover:bg-indigo-500 transition text-xs"
              >
                <Upload className="w-4 h-4" />
                <span>{logoPreview ? 'Change Logo Image' : 'Select Logo File'}</span>
              </label>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border font-bold flex items-center space-x-2 text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => handleNextStep(4)}
                className="px-6 py-2.5 rounded-xl theme-btn-custom font-extrabold shadow-md flex items-center space-x-2 text-xs"
              >
                <span>Continue to Select Apps</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Select Pre-Populated Apps & Modules */}
        {step === 4 && (
          <div className="space-y-4 text-xs animate-fade-in">
            <h3 className="font-extrabold text-sm border-b pb-2 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <AppWindow className="w-4 h-4 text-emerald-500" />
                <span>Step 4: Select Pre-Populated Demo Apps</span>
              </span>
              <span className="text-[10px] font-bold opacity-70">
                {selectedApps.length} Apps Selected
              </span>
            </h3>

            <p className="text-[11px] opacity-70">
              Select which enterprise apps to install and pre-populate with starter dataset records:
            </p>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-none">
              {INITIAL_APPS.filter(a => a.id !== 'settings' && a.id !== 'board').map((app) => {
                const isSelected = selectedApps.includes(app.id);
                return (
                  <div
                    key={app.id}
                    onClick={() => toggleAppSelection(app.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 font-bold'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-400'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-xs">{app.name}</h4>
                        <p className="text-[10px] opacity-70">{app.description}</p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 font-bold">
                      {app.category}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl border font-bold flex items-center space-x-2 text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => handleNextStep(5)}
                className="px-6 py-2.5 rounded-xl theme-btn-custom font-extrabold shadow-md flex items-center space-x-2 text-xs"
              >
                <span>Continue to Admin Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Administrator Account Credentials */}
        {step === 5 && (
          <form onSubmit={handleFinishRegistration} className="space-y-4 text-xs animate-fade-in">
            <h3 className="font-extrabold text-sm border-b pb-2 flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-500" />
              <span>Step 5: Workspace Administrator Credentials</span>
            </h3>

            <div>
              <label className="font-bold block mb-1">Admin Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Admin Work Email</label>
              <input
                type="email"
                required
                placeholder="sarah.j@acmeglobal.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Admin Account Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border font-semibold focus:outline-none bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1.5">
              <h4 className="font-extrabold text-xs flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Workspace Deployment Summary</span>
              </h4>
              <p className="text-[11px] opacity-70">
                Company <strong className="text-indigo-600">{companyName} ({companyCode})</strong> will be provisioned on PostgreSQL database <strong className="text-cyan-600 font-mono">{dbName}</strong> with {selectedApps.length} pre-populated enterprise modules.
              </p>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl border font-bold flex items-center space-x-2 text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl theme-btn-custom font-extrabold shadow-xl flex items-center space-x-2 text-xs disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Provisioning PostgreSQL Tables & Creating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Deploy Company Workspace</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-xs opacity-80 pt-2 border-t border-slate-200">
          <span>Already have an account? </span>
          <button
            onClick={() => router.push('/login')}
            className="theme-svg-custom font-bold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
