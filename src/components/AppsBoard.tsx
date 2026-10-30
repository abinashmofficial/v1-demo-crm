'use client';

import React, { useState } from 'react';
import { AppDefinition, AppId, UserRole, ThemeMode } from '@/types/crm';
import { 
  LayoutGrid, 
  Target, 
  Kanban, 
  Users, 
  Zap, 
  BarChart3, 
  Receipt, 
  Boxes,
  LifeBuoy,
  UserCheck,
  CheckSquare,
  Mail,
  CreditCard,
  Settings,
  Sparkles,
  ArrowUpRight,
  Plus,
  Lock,
  Upload,
  CheckCircle2,
  GraduationCap,
  Building,
  Factory,
  ShoppingCart,
  ShieldAlert,
  Wrench,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  Globe,
  Folder,
  Layers,
  Search,
  Check,
  SlidersHorizontal,
  ChevronRight,
  List,
  Flame,
  ShieldCheck,
  Download
} from 'lucide-react';

import { InstallConfirmModal } from '@/components/InstallConfirmModal';

interface AppsBoardProps {
  apps: AppDefinition[];
  userRole: UserRole;
  onSelectApp: (id: AppId) => void;
  onOpenAiModal: () => void;
  onToggleInstallApp: (id: AppId, withDemoData?: boolean) => void;
  onInstallCustomModule: (manifest: Partial<AppDefinition>) => void;
  themeMode?: ThemeMode;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-5 h-5 text-white" />,
  Target: <Target className="w-5 h-5 text-white" />,
  Kanban: <Kanban className="w-5 h-5 text-white" />,
  Users: <Users className="w-5 h-5 text-white" />,
  Zap: <Zap className="w-5 h-5 text-white" />,
  BarChart3: <BarChart3 className="w-5 h-5 text-white" />,
  Receipt: <Receipt className="w-5 h-5 text-white" />,
  Boxes: <Boxes className="w-5 h-5 text-white" />,
  LifeBuoy: <LifeBuoy className="w-5 h-5 text-white" />,
  UserCheck: <UserCheck className="w-5 h-5 text-white" />,
  Calendar: <Calendar className="w-5 h-5 text-white" />,
  Clock: <Clock className="w-5 h-5 text-white" />,
  Globe: <Globe className="w-5 h-5 text-white" />,
  Sparkles: <Sparkles className="w-5 h-5 text-white" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-white" />,
  Mail: <Mail className="w-5 h-5 text-white" />,
  CreditCard: <CreditCard className="w-5 h-5 text-white" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-white" />,
  Building: <Building className="w-5 h-5 text-white" />,
  Factory: <Factory className="w-5 h-5 text-white" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5 text-white" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-white" />,
  Wrench: <Wrench className="w-5 h-5 text-white" />,
  FileText: <FileText className="w-5 h-5 text-white" />,
  Settings: <Settings className="w-5 h-5 text-white" />,
};

const CATEGORIES = [
  'All', 
  'Core CRM', 
  'Operations', 
  'Finance', 
  'Human Resources', 
  'Intelligence', 
  'Marketing', 
  'Education',
  'Custom'
];

export const AppsBoard: React.FC<AppsBoardProps> = ({
  apps,
  userRole,
  onSelectApp,
  onOpenAiModal,
  onToggleInstallApp,
  onInstallCustomModule,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'installed' | 'available'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutView, setLayoutView] = useState<'grid' | 'list' | 'compact'>('grid');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [selectedPromptApp, setSelectedPromptApp] = useState<AppDefinition | null>(null);
  const [customManifestJson, setCustomManifestJson] = useState<string>(
    JSON.stringify(
      {
        id: 'custom_warehouse_pro',
        name: 'Warehouse & Logistics Pro',
        category: 'Operations',
        iconName: 'Boxes',
        description: 'Advanced barcode logistics, shipping dispatch, and inventory batch control.',
        badge: 'Custom Module',
        color: 'from-cyan-500 to-blue-600',
        minRoleRequired: 'admin',
      },
      null,
      2
    )
  );

  const canInstall = userRole === 'admin' || userRole === 'manager';

  const filteredApps = apps.filter((app) => {
    const matchesCategory = activeCategoryFilter === 'All' || app.category === activeCategoryFilter;
    const matchesStatus = 
      statusFilter === 'all' 
        ? true 
        : statusFilter === 'installed' 
          ? app.installed 
          : !app.installed;
    const matchesSearch = 
      searchQuery.trim() === '' ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleUploadModule = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      const parsed = JSON.parse(customManifestJson);

      const errors: string[] = [];
      if (!parsed.id || typeof parsed.id !== 'string') errors.push('Missing or invalid "id" field (string expected).');
      if (!parsed.name || typeof parsed.name !== 'string') errors.push('Missing or invalid "name" field (string expected).');
      if (!parsed.category || typeof parsed.category !== 'string') errors.push('Missing or invalid "category" field (string expected).');
      if (!parsed.iconName || typeof parsed.iconName !== 'string') errors.push('Missing or invalid "iconName" field (string expected).');
      if (!parsed.description || typeof parsed.description !== 'string') errors.push('Missing or invalid "description" field (string expected).');

      if (errors.length > 0) {
        setValidationError(`Validation Error in Manifest Structure:\n• ` + errors.join('\n• '));
        return;
      }

      onInstallCustomModule(parsed);
      setIsCustomModalOpen(false);
      setValidationError(null);
    } catch (err: any) {
      setValidationError(`JSON Syntax Error: ${err.message || 'Unable to parse JSON file content.'}`);
    }
  };

  const installedCount = apps.filter((a) => a.installed).length;
  const availableCount = apps.length - installedCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full">
      {/* Modern Top Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-50/80 via-cyan-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-tr from-purple-50/60 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Workspace App Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Applications & Modular Workspace Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
              Launch enterprise apps, configure business pipelines, or provision new modular datasets for your team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectApp('leads')}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Target className="w-4 h-4 text-white" />
              <span>Open CRM Leads</span>
            </button>
            <button
              onClick={onOpenAiModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all flex items-center gap-2 shadow-2xs active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Assistant</span>
            </button>

            {canInstall && (
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all flex items-center gap-2 shadow-2xs active:scale-95 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Upload Module</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div 
            onClick={() => setStatusFilter('all')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-indigo-50/60 border-indigo-200 ring-2 ring-indigo-500/10' 
                : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Total Catalog</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl font-black text-slate-900 mt-1">{apps.length}</p>
          </div>

          <div 
            onClick={() => setStatusFilter('installed')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'installed' 
                ? 'bg-emerald-50/60 border-emerald-200 ring-2 ring-emerald-500/10' 
                : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700">Active & Installed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xl font-black text-emerald-700 mt-1">{installedCount}</p>
          </div>

          <div 
            onClick={() => setStatusFilter('available')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'available' 
                ? 'bg-amber-50/60 border-amber-200 ring-2 ring-amber-500/10' 
                : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-700">Available to Install</span>
              <Download className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl font-black text-amber-700 mt-1">{availableCount}</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Your Permission</span>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-sm font-black text-slate-900 mt-1.5 uppercase tracking-wide">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search apps by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Status Segmented Control */}
            <div className="p-1 rounded-2xl border border-slate-200 bg-white flex items-center gap-1 shadow-2xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('installed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'installed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Installed
              </button>
              <button
                onClick={() => setStatusFilter('available')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'available'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Available
              </button>
            </div>

            {/* Layout Toggle (Grid, List, Compact) */}
            <div className="p-1 rounded-2xl border border-slate-200 bg-white flex items-center gap-1 shadow-2xs">
              <button
                onClick={() => setLayoutView('grid')}
                title="Grid Cards"
                className={`p-2 rounded-xl transition-all ${
                  layoutView === 'grid'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutView('list')}
                title="List View"
                className={`p-2 rounded-xl transition-all ${
                  layoutView === 'list'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutView('compact')}
                title="Compact Tiles"
                className={`p-2 rounded-xl transition-all ${
                  layoutView === 'compact'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? apps.length : apps.filter(a => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategoryFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Apps Listing Section */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching applications found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try changing your category filters or search keywords to find the desired enterprise application module.
            </p>
            <button
              onClick={() => {
                setActiveCategoryFilter('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : layoutView === 'compact' ? (
          /* Compact Tiles Layout */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3.5">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  if (app.installed) {
                    onSelectApp(app.id);
                  } else {
                    setSelectedPromptApp(app);
                  }
                }}
                className={`group relative p-4 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center gap-2.5 ${
                  app.installed
                    ? 'bg-white border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 hover:-translate-y-1'
                    : 'bg-slate-50/80 border-slate-200/80 opacity-75 hover:opacity-100 hover:bg-white hover:border-slate-300'
                }`}
              >
                {!app.installed && (
                  <div className="absolute top-2.5 right-2.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br ${app.color} group-hover:scale-110 transition-transform`}>
                  {ICON_MAP[app.iconName] || <LayoutGrid className="w-5 h-5 text-white" />}
                </div>

                <div className="w-full">
                  <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    {app.installed ? 'Installed' : 'Click to Add'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : layoutView === 'list' ? (
          /* List Row Layout */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  if (app.installed) {
                    onSelectApp(app.id);
                  } else {
                    setSelectedPromptApp(app);
                  }
                }}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 bg-gradient-to-br ${app.color} group-hover:scale-105 transition-transform`}>
                    {ICON_MAP[app.iconName] || <LayoutGrid className="w-6 h-6 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {app.name}
                      </h3>
                      {app.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          {app.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {app.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {app.category}
                  </span>

                  {app.installed ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Launch App</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      <span>Install App</span>
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Default Modern Card Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  if (app.installed) {
                    onSelectApp(app.id);
                  } else {
                    setSelectedPromptApp(app);
                  }
                }}
                className={`group relative p-5 sm:p-6 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 ${
                  app.installed 
                    ? 'bg-white border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 hover:-translate-y-1' 
                    : 'bg-slate-50/70 border-slate-200/80 opacity-85 hover:opacity-100 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Card Top Section */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${app.color} group-hover:scale-108 transition-transform`}>
                    {ICON_MAP[app.iconName] || <LayoutGrid className="w-6 h-6 text-white" />}
                  </div>

                  {app.installed ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200 transition-colors">
                      <Lock className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                      <span>Install</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {app.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {app.category}
                  </span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 pt-1">
                    {app.description}
                  </p>
                </div>

                {/* Card Footer Bar */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {app.badge || 'Standard'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    <span>{app.installed ? 'Launch App' : 'Get Module'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Custom Module Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upload Custom App Manifest</h3>
                  <p className="text-[11px] text-slate-500">Add dynamic modules to your multi-tenant ERP</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadModule} className="space-y-4">
              {validationError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono whitespace-pre-line leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Manifest Validation Error</span>
                  </div>
                  {validationError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold block mb-1.5 text-slate-700">
                  Module Manifest JSON Specification
                </label>
                <textarea
                  rows={8}
                  value={customManifestJson}
                  onChange={(e) => setCustomManifestJson(e.target.value)}
                  className="w-full font-mono rounded-xl p-3 text-xs border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95"
                >
                  Validate & Install App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Install Modal */}
      <InstallConfirmModal
        isOpen={Boolean(selectedPromptApp)}
        app={selectedPromptApp}
        canInstall={canInstall}
        onConfirm={(withDemoData) => {
          if (selectedPromptApp) {
            onToggleInstallApp(selectedPromptApp.id, withDemoData);
          }
        }}
        onClose={() => setSelectedPromptApp(null)}
        isLight={true}
      />
    </div>
  );
};
