'use client';

import React from 'react';
import { AppDefinition, AppId, UserRole, ThemeMode } from '@/types/crm';
import { 
  LayoutGrid, Target, Kanban, Users, Zap, BarChart3, Receipt, Boxes,
  LifeBuoy, UserCheck, CheckSquare, Mail, CreditCard, Settings, Plus, X,
  GraduationCap, Building, Factory, ShoppingCart, ShieldAlert, Wrench,
  FileText, Calendar, Clock, Sparkles, Globe, ChevronRight, Activity
} from 'lucide-react';
import { MainAppLogo } from '@/components/MainAppLogo';

interface SidebarProps {
  apps: AppDefinition[];
  activeApp: AppId;
  setActiveApp: (id: AppId) => void;
  userRole: UserRole;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  themeMode?: ThemeMode;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
  Kanban: <Kanban className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  LifeBuoy: <LifeBuoy className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Factory: <Factory className="w-4 h-4" />,
  ShoppingCart: <ShoppingCart className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

const APP_GRADIENTS: Record<string, string> = {
  board: 'from-slate-600 to-slate-800 text-white',
  leads: 'from-blue-500 to-indigo-600 text-white',
  deals: 'from-emerald-500 to-teal-600 text-white',
  contacts: 'from-cyan-500 to-blue-600 text-white',
  automation: 'from-amber-500 to-orange-600 text-white',
  analytics: 'from-purple-500 to-fuchsia-600 text-white',
  invoices: 'from-rose-500 to-pink-600 text-white',
  settings: 'from-slate-500 to-slate-700 text-white',
};

export const Sidebar: React.FC<SidebarProps> = ({
  apps,
  activeApp,
  setActiveApp,
  userRole,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const installedApps = apps.filter(
    (app) => app.installed && (app.id !== 'settings' || userRole === 'admin')
  );
  const canInstall = userRole === 'admin' || userRole === 'manager';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full w-64 bg-white border-r border-slate-200/80 shadow-[2px_0_8px_rgba(15,23,42,0.03)] transition-transform duration-300 ease-in-out ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Top Header on Mobile */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 md:hidden">
          <MainAppLogo size="sm" />
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile} 
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section Title */}
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            Workspaces & Modules
          </p>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">
            {installedApps.length}
          </span>
        </div>

        {/* App Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
          {installedApps.map((app) => {
            const isActive = activeApp === app.id;
            const gradient = APP_GRADIENTS[app.id] || 'from-indigo-500 to-purple-600 text-white';

            return (
              <button
                key={app.id}
                onClick={() => {
                  setActiveApp(app.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-900 shadow-sm ring-1 ring-indigo-200/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon Tile */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br ${gradient} ${
                    isActive ? 'scale-105' : 'opacity-90 group-hover:opacity-100'
                  }`}>
                    {ICON_MAP[app.iconName] || <LayoutGrid className="w-3.5 h-3.5" />}
                  </div>

                  <span className={`truncate font-medium ${isActive ? 'font-bold text-indigo-950' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {app.name}
                  </span>
                </div>

                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-3 border-t border-slate-100 space-y-2 mt-auto bg-slate-50/50">
          {canInstall && (
            <button
              onClick={() => {
                setActiveApp('board');
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-indigo-50/60 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Install New Modules</span>
            </button>
          )}

          {/* System Status Pill */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-slate-700">Database Engine</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
              Connected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};


