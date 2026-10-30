'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, Building2, User, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Company, UserProfile } from '@/types/crm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterCompanySuccess: (company: Company, adminUser: UserProfile) => void;
  isLight?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterCompanySuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('alex.rivera@acme.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  // Registration form
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      companyId: 'comp-1',
      name: loginEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: loginEmail,
      role: 'admin',
      title: 'Enterprise Account Admin',
      avatar: loginEmail[0].toUpperCase(),
    };
    onLoginSuccess(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !companyCode || !adminName || !adminEmail) return;

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: companyName,
      code: companyCode.toUpperCase(),
      currency,
      logo: companyName[0].toUpperCase(),
      plan: 'Enterprise',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const adminUser: UserProfile = {
      id: `usr-${Date.now()}`,
      companyId: newCompany.id,
      name: adminName,
      email: adminEmail,
      role: 'admin',
      title: 'Company Workspace Administrator',
      avatar: adminName[0].toUpperCase(),
    };

    onRegisterCompanySuccess(newCompany, adminUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl transition border bg-white border-slate-200 text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base bg-gradient-to-r from-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              Open-CRM Auth Portal
            </span>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition ${
              activeTab === 'login'
                ? 'theme-btn-custom shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Account Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition ${
              activeTab === 'register'
                ? 'theme-btn-custom shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Company
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1 text-slate-700">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl pl-9 pr-3 py-2.5 border bg-slate-50 border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl pl-9 pr-3 py-2.5 border bg-slate-50 border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full theme-btn-custom font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold block mb-1 text-slate-700">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl px-3 py-2 border bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700">Company Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APEX"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 border bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700">Base Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 border bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Admin Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full rounded-xl px-3 py-2 border bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Admin Email</label>
              <input
                type="email"
                required
                placeholder="sarah@apexglobal.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full rounded-xl px-3 py-2 border bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full theme-btn-custom font-extrabold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Register Company Account</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
