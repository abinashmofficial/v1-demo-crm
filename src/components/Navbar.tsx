'use client';

import React, { useState } from 'react';
import { Company, UserProfile, ThemeMode } from '@/types/crm';
import { 
  Search, 
  Sparkles, 
  Settings, 
  ChevronDown, 
  Building2, 
  LogOut, 
  Palette, 
  Check, 
  Menu, 
  LogIn,
  SlidersHorizontal,
  Bell
} from 'lucide-react';
import { MainAppLogo } from '@/components/MainAppLogo';
import { AuthModal } from '@/components/AuthModal';

interface NavbarProps {
  activeApp: string;
  onOpenAiModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  companies: Company[];
  activeCompany: Company;
  onSelectCompany: (company: Company) => void;

  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onLogout: () => void;

  mode?: 'light' | 'dark';
  onToggleMode?: () => void;
  colorTheme: string;
  onSelectTheme: (theme: string) => void;
  onNavigateToSettings: () => void;
  onToggleMobileSidebar?: () => void;
  onRegisterCompany?: (company: Company, adminUser: UserProfile) => void;
  isAuthenticated?: boolean;
  layoutMode?: 'default' | 'windows';
  onToggleLayoutMode?: () => void;
}

const THEME_OPTIONS: { id: ThemeMode; name: string; color: string; bg: string }[] = [
  { id: 'default', name: 'Indigo Modern', color: '#4f46e5', bg: 'bg-indigo-600' },
  { id: 'midnight-blue', name: 'Electric Blue', color: '#2563eb', bg: 'bg-blue-600' },
  { id: 'emerald-forest', name: 'Neo Emerald', color: '#059669', bg: 'bg-emerald-600' },
  { id: 'cyber-purple', name: 'Cyber Violet', color: '#7c3aed', bg: 'bg-purple-600' },
  { id: 'sunset-amber', name: 'Sunset Glow', color: '#d97706', bg: 'bg-amber-600' },
  { id: 'crimson-red', name: 'Crimson Rose', color: '#e11d48', bg: 'bg-rose-600' },
  { id: 'teal-ocean', name: 'Teal Oceanic', color: '#0d9488', bg: 'bg-teal-600' },
  { id: 'nordic-slate', name: 'Nordic Minimal', color: '#475569', bg: 'bg-slate-600' },
  { id: 'high-contrast', name: 'Amber Radiant', color: '#ca8a04', bg: 'bg-yellow-600' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiModal,
  searchQuery,
  setSearchQuery,
  activeCompany,
  currentUser,
  onSelectUser,
  onLogout,
  colorTheme,
  onSelectTheme,
  onNavigateToSettings,
  onToggleMobileSidebar,
  onRegisterCompany,
  isAuthenticated = true,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all">
      {/* Left: Mobile Toggle + Logo + Company Badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <MainAppLogo size="md" onClick={onNavigateToSettings} />

        {/* Company Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 text-xs font-semibold text-slate-800 shadow-2xs">
          {activeCompany.customLogoUrl ? (
            <img src={activeCompany.customLogoUrl} alt={activeCompany.name} className="w-4 h-4 rounded object-cover" />
          ) : (
            <div className="w-4 h-4 rounded bg-indigo-100 flex items-center justify-center">
              <Building2 className="w-3 h-3 text-indigo-600" />
            </div>
          )}
          <span className="font-bold text-slate-800 truncate max-w-[150px]">{activeCompany.name}</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-extrabold bg-indigo-100/70 text-indigo-700">
            {activeCompany.code}
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, deals, invoices, modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl pl-10 pr-12 py-2 text-xs border border-slate-200 bg-slate-50/70 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-2xs"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded border border-slate-300/60 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Color Themes Palette */}
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            title="Theme Palette"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 shadow-2xs"
          >
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="hidden lg:inline text-slate-700">Theme</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 bg-white animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Color Theme Presets</p>
              </div>
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTheme(t.id);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    colorTheme === t.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white" style={{ backgroundColor: t.color }} />
                    <span>{t.name}</span>
                  </div>
                  {colorTheme === t.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <>
            <button
              onClick={() => window.location.href = '/login'}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs"
            >
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => window.location.href = '/register'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Register Company</span>
            </button>
          </>
        ) : (
          <>
            {/* AI Copilot Action */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 text-left transition-opacity hover:opacity-90"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.avatar}
                </div>
                <div className="hidden xl:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{currentUser.title}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 bg-white animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                      {currentUser.role} Account
                    </div>
                  </div>
                  
                  <div className="pt-1 space-y-1">
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigateToSettings();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                        <span>System Settings</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(usr) => onSelectUser(usr)}
        onRegisterCompanySuccess={(comp, admin) => {
          if (onRegisterCompany) onRegisterCompany(comp, admin);
        }}
        isLight={true}
      />
    </header>
  );
};

