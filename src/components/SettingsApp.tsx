'use client';

import React, { useState } from 'react';
import { 
  Company, 
  UserProfile, 
  ModuleSettings, 
  ThemeMode, 
  UserRole,
  AppDefinition 
} from '@/types/crm';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Palette, 
  Plus, 
  Save, 
  Sun, 
  Moon, 
  Globe, 
  SlidersHorizontal,
  FileSpreadsheet,
  UserPlus
} from 'lucide-react';

interface SettingsAppProps {
  companies: Company[];
  activeCompany: Company;
  onSelectCompany: (company: Company) => void;
  onCreateCompany: (newCompany: Company) => void;

  users: UserProfile[];
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onImportUsers: (newUsers: UserProfile[]) => void;
  onAddUser: (newUser: UserProfile) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;

  themeMode: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;

  settings: ModuleSettings;
  onUpdateSettings: (newSettings: ModuleSettings) => void;

  apps: AppDefinition[];
  onToggleInstallApp: (appId: string) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  companies,
  activeCompany,
  onSelectCompany,
  onCreateCompany,
  users,
  currentUser,
  onSelectUser,
  onImportUsers,
  onAddUser,
  onUpdateUser,
  themeMode,
  onThemeChange,
  settings,
  onUpdateSettings,
  apps,
  onToggleInstallApp,
}) => {
  const [activeTab, setActiveTab] = useState<
    'company' | 'users' | 'theme' | 'module_settings' | 'permissions'
  >('company');

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState<boolean>(false);
  const [compName, setCompName] = useState('');
  const [compCode, setCompCode] = useState('');
  const [compCurrency, setCompCurrency] = useState('USD ($)');

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');
  const [userPasswordError, setUserPasswordError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [userTitle, setUserTitle] = useState('');

  const [editingPermissionsUser, setEditingPermissionsUser] = useState<UserProfile | null>(null);
  const [localSettings, setLocalSettings] = useState<ModuleSettings>(settings);

  const canAdmin = currentUser.role === 'admin';
  const isLight = themeMode === 'light';

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdmin) return;
    if (!compName.trim() || !compCode.trim()) return;

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: compName,
      code: compCode.toUpperCase(),
      currency: compCurrency,
      logo: 'Building2',
      plan: 'Enterprise',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateCompany(newCompany);
    setIsCompanyModalOpen(false);
    setCompName('');
    setCompCode('');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdmin) return;
    setUserPasswordError(null);

    if (!userName.trim() || !userEmail.trim()) return;

    if (!userPassword) {
      setUserPasswordError('Password is required.');
      return;
    }

    if (userPassword.length < 6) {
      setUserPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (userPassword !== userConfirmPassword) {
      setUserPasswordError('Password and Confirm Password do not match.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: userName.trim(),
      email: userEmail.trim().toLowerCase(),
      role: userRole,
      companyId: activeCompany.id,
      avatar: userName.slice(0, 2).toUpperCase(),
      title: userTitle.trim() || 'Team Member',
      password: userPassword,
      permissions: {
        canInstallApps: userRole === 'admin',
        canUninstallApps: userRole === 'admin',
        canUploadModules: userRole === 'admin',
      },
    };

    onAddUser(newUser);
    setIsUserModalOpen(false);
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    setUserConfirmPassword('');
    setUserPasswordError(null);
    setUserTitle('');
  };

  const handleCsvUserImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const mockImportedUsers: UserProfile[] = [
      {
        id: `usr-${Date.now()}-1`,
        name: 'David Miller',
        email: 'd.miller@' + activeCompany.name.toLowerCase().replace(/\s+/g, '') + '.com',
        role: 'user',
        companyId: activeCompany.id,
        avatar: 'DM',
        title: 'Account Representative',
      },
      {
        id: `usr-${Date.now()}-2`,
        name: 'Jessica Taylor',
        email: 'j.taylor@' + activeCompany.name.toLowerCase().replace(/\s+/g, '') + '.com',
        role: 'manager',
        companyId: activeCompany.id,
        avatar: 'JT',
        title: 'Regional Sales Manager',
      },
    ];

    onImportUsers(mockImportedUsers);
  };

  const handleSaveSettings = () => {
    if (!canAdmin) return;
    onUpdateSettings(localSettings);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden p-6 sm:p-8 shadow-xl transition duration-300 theme-hero-custom text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 text-xs font-bold border backdrop-blur-md bg-white/20 text-white border-white/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Workspace Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm text-white">
              System & Organization Settings
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Manage multi-tenant company accounts, user RBAC permissions, theme preferences, and module configurations.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold whitespace-nowrap transition ${
            activeTab === 'company'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold whitespace-nowrap transition ${
            activeTab === 'users'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Import</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold whitespace-nowrap transition ${
            activeTab === 'theme'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance & Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('module_settings')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold whitespace-nowrap transition ${
            activeTab === 'module_settings'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Separate Module Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold whitespace-nowrap transition ${
            activeTab === 'permissions'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Install Permissions & Access</span>
        </button>
      </div>

      {activeTab === 'company' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Multi-Tenant Company Accounts</h3>
              <p className="text-xs text-slate-600">Switch active organization or register a new company profile.</p>
            </div>
            {canAdmin && (
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="theme-btn-custom font-extrabold px-4 py-2 text-xs flex items-center space-x-2 transition shadow-md self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Create New Company</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {companies.map((comp) => {
              const isActive = activeCompany.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => onSelectCompany(comp)}
                  className={`p-5 sm:p-6 transition cursor-pointer flex flex-col justify-between space-y-4 shadow-lg hover:shadow-xl ${
                    isActive
                      ? 'theme-card-custom ring-2 ring-indigo-500'
                      : 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {comp.customLogoUrl ? (
                        <img
                          src={comp.customLogoUrl}
                          alt={comp.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-300 shadow-md"
                        />
                      ) : (
                        <div className="w-10 h-10 theme-span-custom flex items-center justify-center font-bold">
                          <Building2 className="w-5 h-5 theme-svg-custom" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{comp.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono text-slate-500">Code: {comp.code}</span>
                          {comp.dbConfig && (
                            <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600">
                              Postgres ({comp.dbConfig.dbName})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] px-2.5 py-0.5 theme-btn-custom font-extrabold shadow-sm">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="pt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>Currency: <strong className="font-mono text-slate-900">{comp.currency}</strong></span>
                    <span className="theme-span-custom px-2 py-0.5 text-[10px] font-extrabold">{comp.plan}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Users & Profile Management</h3>
              <p className="text-xs text-slate-600">
                Import users via CSV/JSON or assign Admin, Manager, and Standard User roles for {activeCompany.name}.
              </p>
            </div>

            {canAdmin && (
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer theme-span-custom font-bold px-4 py-2 text-xs flex items-center space-x-2 transition shadow-sm">
                  <FileSpreadsheet className="w-4 h-4 theme-svg-custom" />
                  <span>Import Users CSV</span>
                  <input type="file" accept=".csv,.json" onChange={handleCsvUserImport} className="hidden" />
                </label>

                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="theme-btn-custom font-extrabold px-4 py-2 text-xs flex items-center space-x-2 transition shadow-md"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Add User</span>
                </button>
              </div>
            )}
          </div>

          <div className="shadow-lg overflow-x-auto theme-card-custom">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="font-extrabold theme-span-custom border-b">
                <tr>
                  <th className="p-4 uppercase tracking-wider text-[11px]">User Name</th>
                  <th className="p-4 uppercase tracking-wider text-[11px]">Email</th>
                  <th className="p-4 uppercase tracking-wider text-[11px]">Designation</th>
                  <th className="p-4 uppercase tracking-wider text-[11px]">Role</th>
                  <th className="p-4 uppercase tracking-wider text-[11px] text-right">Switch Active Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr.id} className="transition duration-150 border-b border-slate-100">
                    <td className="p-4 font-extrabold flex items-center space-x-3 text-slate-900">
                      <div className="w-8 h-8 theme-span-custom flex items-center justify-center text-xs font-bold">
                        {usr.avatar}
                      </div>
                      <span>{usr.name}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">{usr.email}</td>
                    <td className="p-4 font-medium text-slate-700">{usr.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase theme-span-custom">
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {canAdmin && (
                        <button
                          onClick={() => setEditingPermissionsUser(usr)}
                          className="px-3 py-1 font-extrabold text-[11px] rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition inline-flex items-center space-x-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>User-Permissions</span>
                        </button>
                      )}

                      {currentUser.id === usr.id ? (
                        <span className="text-[10px] theme-span-custom px-3 py-1 font-extrabold">
                          Logged In
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectUser(usr)}
                          className="theme-btn-custom px-3 py-1 font-extrabold text-[11px] transition shadow-sm"
                        >
                          Switch Profile Log In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Color Palette & Appearance</h3>
            <p className="text-xs text-slate-600">Select your preferred modern light theme palette for all screens in your workspace.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { id: 'default', name: 'Indigo Modern', desc: 'Clean Indigo Brand Palette', color: '#4f46e5', bg: 'bg-indigo-600' },
              { id: 'midnight-blue', name: 'Electric Blue', desc: 'Vibrant Corporate Sapphire', color: '#2563eb', bg: 'bg-blue-600' },
              { id: 'emerald-forest', name: 'Neo Emerald', desc: 'Lush Emerald & Mint Gradient', color: '#059669', bg: 'bg-emerald-600' },
              { id: 'cyber-purple', name: 'Cyber Violet', desc: 'Vibrant Purple Accent', color: '#7c3aed', bg: 'bg-purple-600' },
              { id: 'sunset-amber', name: 'Sunset Glow', desc: 'Warm Amber & Gold Accent', color: '#d97706', bg: 'bg-amber-600' },
              { id: 'crimson-red', name: 'Crimson Rose', desc: 'Bold Crimson Scarlet Accent', color: '#e11d48', bg: 'bg-rose-600' },
              { id: 'teal-ocean', name: 'Teal Oceanic', desc: 'Crisp Oceanic Teal Atmosphere', color: '#0d9488', bg: 'bg-teal-600' },
              { id: 'nordic-slate', name: 'Nordic Minimal', desc: 'Cool Slate Monokai Theme', color: '#475569', bg: 'bg-slate-600' },
              { id: 'high-contrast', name: 'Amber Radiant', desc: 'High Visibility Amber Gold', color: '#ca8a04', bg: 'bg-yellow-600' },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => onThemeChange(t.id as ThemeMode)}
                className={`p-6 cursor-pointer transition flex flex-col justify-between space-y-4 rounded-2xl shadow-sm hover:shadow-md ${
                  themeMode === t.id
                    ? 'theme-card-custom ring-2 ring-indigo-600'
                    : 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${t.bg} shadow-xs`} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t.desc}</p>
                  </div>
                </div>
                <div className={`w-full h-8 ${t.bg} rounded-xl opacity-90`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'module_settings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">All Apps Configuration & Settings</h3>
              <p className="text-xs text-slate-600">Configure parameters, notifications, and workflow rules for every installed application module.</p>
            </div>
            {canAdmin ? (
              <button
                onClick={handleSaveSettings}
                className="theme-btn-custom font-extrabold px-5 py-2.5 text-xs flex items-center space-x-2 shadow-lg transition self-start sm:self-auto"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save All Settings</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                🔒 Admin-Only Configuration
              </div>
            )}
          </div>

          {!canAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <span>🔒 Module settings are read-only for standard users. Only Administrators have permission to modify system configuration.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className={`p-5 space-y-4 shadow-sm rounded-2xl theme-card-custom transition ${
                  !app.installed ? 'opacity-50 grayscale border border-dashed border-slate-300' : 'hover:shadow-md'
                }`}
              >
                <fieldset disabled={!app.installed || !canAdmin} className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-slate-100">
                      <SlidersHorizontal className="w-4 h-4 theme-svg-custom" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold truncate max-w-[160px] text-slate-900">{app.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{app.category}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 font-mono font-bold rounded-full ${
                    app.installed ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'
                  }`}>
                    {app.installed ? 'Installed' : 'Not Installed'}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  {app.id === 'leads' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto-Assign Inbound Leads</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Min AI Intent Score Threshold</label>
                        <input type="number" defaultValue={75} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none" />
                      </div>
                    </>
                  )}

                  {app.id === 'deals' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Drag & Drop Stage Transitions</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Require Closed-Lost Reason</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                    </>
                  )}

                  {app.id === 'contacts' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto Deduplicate Contacts</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Default Contact Access Scope</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>Organization Wide</option>
                          <option>Team Members Only</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'invoices' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto Send Invoice Reminders</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Default Tax Rate (VAT)</label>
                        <input type="text" defaultValue="0% Standard" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none" />
                      </div>
                    </>
                  )}

                  {app.id === 'inventory' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Low Stock Reorder Alerts</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Default Warehouse Hub</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>Main Distribution Hub</option>
                          <option>Warehouse A (North)</option>
                          <option>Warehouse B (South)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'helpdesk' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Enforce Ticket SLA Timers</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Max SLA Resolution Target</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>2 Hours Urgent</option>
                          <option>24 Hours Standard</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'hr_employees' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto Geofence Attendance Clock-In</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Leave Approval Workflow</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>Direct Manager Signoff</option>
                          <option>HR Director Approval</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'project_tasks' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto Sync GitHub / GitLab Commits</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Sprint Velocity Period</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>2 Weeks Agile Sprint</option>
                          <option>1 Month Release Cycle</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'student_lms' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto Issue Certificates upon 100%</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Minimum Passing Grade</label>
                        <input type="text" defaultValue="80% Minimum" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none" />
                      </div>
                    </>
                  )}

                  {app.id === 'client_portal' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Allow Client Self-Service Billing</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Custom Portal Theme Branding</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>Corporate White Label</option>
                          <option>Brand Accent Portal</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'mrp_manufacturing' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto Schedule Production Routing</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">OEE Target Threshold</label>
                        <input type="text" defaultValue="90% Target OEE" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none" />
                      </div>
                    </>
                  )}

                  {app.id === 'purchase_procurement' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Require 3-Way Bill Matching</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">PO Approval Threshold Limit</label>
                        <input type="text" defaultValue="$50,000 Approval Limit" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none" />
                      </div>
                    </>
                  )}

                  {app.id === 'quality_control' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Halt Line on Critical Defect</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Compliance Audit Standard</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>ISO 9001 Standard</option>
                          <option>CE Safety Specs</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'maintenance_fleet' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Auto Trigger Preventive Service</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Service Interval Trigger</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>Every 500 Run Hours</option>
                          <option>Monthly Inspection</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'document_vault' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Enforce 256-Bit Vault Encryption</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Digital Signature Auth Level</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>PKI Certificate Signing</option>
                          <option>Biometric / OTP Sign</option>
                        </select>
                      </div>
                    </>
                  )}

                  {app.id === 'automation' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Enable Real-Time Webhook Triggers</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Max Execution Retry Attempts</label>
                        <input type="number" defaultValue={3} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none" />
                      </div>
                    </>
                  )}

                  {app.id === 'analytics' && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Real-Time Churn Forecasting</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Analytics Refresh Cadence</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>Live Continuous Sync</option>
                          <option>Hourly Aggregation</option>
                        </select>
                      </div>
                    </>
                  )}

                  {!['leads', 'deals', 'contacts', 'invoices', 'inventory', 'helpdesk', 'hr_employees', 'project_tasks', 'student_lms', 'client_portal', 'mrp_manufacturing', 'purchase_procurement', 'quality_control', 'maintenance_fleet', 'document_vault', 'automation', 'analytics'].includes(app.id) && (
                    <>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Enable Module Audit Logging</span>
                        <input type="checkbox" defaultChecked className="text-indigo-600 focus:ring-0 rounded" />
                      </label>
                      <div>
                        <label className="block mb-1 text-[11px] font-semibold text-slate-600">Default Storage Hub</label>
                        <select className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none">
                          <option>Primary Database Storage</option>
                          <option>Cloud Encrypted Vault</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                </fieldset>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">User Permissions & Access Control Screen</h3>
            <p className="text-xs text-slate-600">
              Manage per-user workspace privileges directly on screen: toggle app installation, uninstallation, and custom module upload permissions.
            </p>
          </div>

          {!canAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <span>🔒 User permissions are read-only. Only Administrators can grant or revoke workspace privileges.</span>
            </div>
          )}

          <div className="shadow-lg overflow-x-auto theme-card-custom">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="font-extrabold theme-span-custom border-b">
                <tr>
                  <th className="p-4 uppercase tracking-wider text-[11px]">User</th>
                  <th className="p-4 uppercase tracking-wider text-[11px]">System Role</th>
                  <th className="p-4 uppercase tracking-wider text-[11px] text-center">Allow Install Apps</th>
                  <th className="p-4 uppercase tracking-wider text-[11px] text-center">Allow Uninstall Apps</th>
                  <th className="p-4 uppercase tracking-wider text-[11px] text-center">Allow New Upload Settings</th>
                  <th className="p-4 uppercase tracking-wider text-[11px] text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr.id} className="border-b border-slate-100 transition">
                    <td className="p-4 font-extrabold flex items-center space-x-3 text-slate-900">
                      <div className="w-8 h-8 theme-span-custom flex items-center justify-center text-xs font-bold">
                        {usr.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{usr.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{usr.email}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase theme-span-custom">
                        {usr.role}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        disabled={!canAdmin}
                        checked={Boolean(usr.permissions?.canInstallApps)}
                        onChange={(e) => {
                          if (!canAdmin) return;
                          const updatedUser = {
                            ...usr,
                            permissions: {
                              canInstallApps: e.target.checked,
                              canUninstallApps: Boolean(usr.permissions?.canUninstallApps),
                              canUploadModules: Boolean(usr.permissions?.canUploadModules),
                            },
                          };
                          if (onUpdateUser) onUpdateUser(updatedUser);
                        }}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        disabled={!canAdmin}
                        checked={Boolean(usr.permissions?.canUninstallApps)}
                        onChange={(e) => {
                          if (!canAdmin) return;
                          const updatedUser = {
                            ...usr,
                            permissions: {
                              canInstallApps: Boolean(usr.permissions?.canInstallApps),
                              canUninstallApps: e.target.checked,
                              canUploadModules: Boolean(usr.permissions?.canUploadModules),
                            },
                          };
                          if (onUpdateUser) onUpdateUser(updatedUser);
                        }}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        disabled={!canAdmin}
                        checked={Boolean(usr.permissions?.canUploadModules)}
                        onChange={(e) => {
                          if (!canAdmin) return;
                          const updatedUser = {
                            ...usr,
                            permissions: {
                              canInstallApps: Boolean(usr.permissions?.canInstallApps),
                              canUninstallApps: Boolean(usr.permissions?.canUninstallApps),
                              canUploadModules: e.target.checked,
                            },
                          };
                          if (onUpdateUser) onUpdateUser(updatedUser);
                        }}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>

                    <td className="p-4 text-right">
                      {canAdmin ? (
                        <button
                          onClick={() => {
                            const updatedUser = {
                              ...usr,
                              permissions: {
                                canInstallApps: usr.role === 'admin',
                                canUninstallApps: usr.role === 'admin',
                                canUploadModules: usr.role === 'admin',
                              },
                            };
                            if (onUpdateUser) onUpdateUser(updatedUser);
                          }}
                          className="px-3 py-1 font-extrabold text-[11px] rounded-lg border border-slate-300 hover:bg-slate-100 transition text-slate-700"
                        >
                          Reset Role Defaults
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 space-y-6 shadow-2xl rounded-3xl bg-white text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold flex items-center space-x-2 text-slate-900">
                <Building2 className="w-5 h-5 theme-svg-custom" />
                <span>Create New Company Tenant</span>
              </h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Industries"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Company Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ACME"
                  value={compCode}
                  onChange={(e) => setCompCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Default Base Currency</label>
                <select
                  value={compCurrency}
                  onChange={(e) => setCompCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="INR (₹)">INR (₹)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-extrabold theme-btn-custom shadow-md">Create Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 space-y-6 shadow-2xl rounded-3xl bg-white text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold flex items-center space-x-2 text-slate-900">
                <UserPlus className="w-5 h-5 theme-svg-custom" />
                <span>Add User to {activeCompany.name}</span>
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              {userPasswordError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold animate-shake">
                  {userPasswordError}
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@acmeglobal.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={userConfirmPassword}
                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Assign System Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sales Specialist"
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-extrabold theme-btn-custom shadow-md">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 space-y-5 shadow-2xl rounded-3xl bg-white text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">User-Permissions Management</h3>
              </div>
              <button
                onClick={() => setEditingPermissionsUser(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-sm text-slate-900">{editingPermissionsUser.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{editingPermissionsUser.email}</p>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase theme-span-custom">
                  Role: {editingPermissionsUser.role}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div>
                    <p className="font-bold text-slate-900">Allow Install Apps</p>
                    <p className="text-[10px] text-slate-500">Permits user to install apps from Apps Board.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingPermissionsUser.permissions?.canInstallApps)}
                    onChange={(e) => {
                      const updatedPerms = {
                        canInstallApps: e.target.checked,
                        canUninstallApps: Boolean(editingPermissionsUser.permissions?.canUninstallApps),
                        canUploadModules: Boolean(editingPermissionsUser.permissions?.canUploadModules),
                      };
                      const updatedUser = { ...editingPermissionsUser, permissions: updatedPerms };
                      setEditingPermissionsUser(updatedUser);
                      if (onUpdateUser) onUpdateUser(updatedUser);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div>
                    <p className="font-bold text-slate-900">Allow Uninstall Apps</p>
                    <p className="text-[10px] text-slate-500">Permits user to remove installed apps from workspace.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingPermissionsUser.permissions?.canUninstallApps)}
                    onChange={(e) => {
                      const updatedPerms = {
                        canInstallApps: Boolean(editingPermissionsUser.permissions?.canInstallApps),
                        canUninstallApps: e.target.checked,
                        canUploadModules: Boolean(editingPermissionsUser.permissions?.canUploadModules),
                      };
                      const updatedUser = { ...editingPermissionsUser, permissions: updatedPerms };
                      setEditingPermissionsUser(updatedUser);
                      if (onUpdateUser) onUpdateUser(updatedUser);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div>
                    <p className="font-bold text-slate-900">Allow New Upload Settings</p>
                    <p className="text-[10px] text-slate-500">Permits user to upload custom module Zip/JSON manifests.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingPermissionsUser.permissions?.canUploadModules)}
                    onChange={(e) => {
                      const updatedPerms = {
                        canInstallApps: Boolean(editingPermissionsUser.permissions?.canInstallApps),
                        canUninstallApps: Boolean(editingPermissionsUser.permissions?.canUninstallApps),
                        canUploadModules: e.target.checked,
                      };
                      const updatedUser = { ...editingPermissionsUser, permissions: updatedPerms };
                      setEditingPermissionsUser(updatedUser);
                      if (onUpdateUser) onUpdateUser(updatedUser);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingPermissionsUser(null)}
                className="px-5 py-2 rounded-xl text-xs font-extrabold theme-btn-custom shadow-md"
              >
                Save & Apply Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
