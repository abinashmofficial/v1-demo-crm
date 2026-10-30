'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  AppId, 
  Lead, 
  Deal, 
  Contact, 
  WorkflowRule, 
  Invoice, 
  Company, 
  UserProfile, 
  ModuleSettings, 
  AppDefinition 
} from '@/types/crm';
import { 
  INITIAL_APPS, 
  INITIAL_LEADS, 
  INITIAL_DEALS, 
  INITIAL_CONTACTS, 
  INITIAL_WORKFLOWS, 
  INITIAL_INVOICES,
  INITIAL_COMPANIES,
  INITIAL_USERS,
  INITIAL_SETTINGS
} from '@/lib/mockData';

import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { AppsBoard } from '@/components/AppsBoard';
import { LeadsApp } from '@/components/LeadsApp';
import { DealsApp } from '@/components/DealsApp';
import { ContactsApp } from '@/components/ContactsApp';
import { AutomationApp } from '@/components/AutomationApp';
import { AnalyticsApp } from '@/components/AnalyticsApp';
import { InvoiceApp } from '@/components/InvoiceApp';
import { SettingsApp } from '@/components/SettingsApp';
import { GenericModuleApp } from '@/components/GenericModuleApp';
import { AICopilotModal } from '@/components/AICopilotModal';

export default function DynamicAppPage() {
  const router = useRouter();
  const params = useParams();
  const routeAppId = (params?.appname as AppId) || 'board';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [activeCompany, setActiveCompany] = useState<Company>(INITIAL_COMPANIES[0]);

  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);

  const [colorTheme, setColorTheme] = useState<string>('default');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
    localStorage.removeItem('open_crm_mode');
    const savedTheme = localStorage.getItem('open_crm_color_theme');
    const savedCompanyId = localStorage.getItem('open_crm_active_company_id');
    const savedUserId = localStorage.getItem('open_crm_current_user_id');

    if (!savedUserId) {
      router.push('/login');
      return;
    }
    if (savedTheme) setColorTheme(savedTheme);

    if (savedCompanyId) {
      const matchComp = INITIAL_COMPANIES.find(c => c.id === savedCompanyId);
      const savedCompanyStr = localStorage.getItem('open_crm_registered_company');
      const registeredComp = savedCompanyStr ? JSON.parse(savedCompanyStr) : null;

      if (matchComp) {
        setActiveCompany(matchComp);
      } else if (registeredComp && registeredComp.name) {
        setActiveCompany(registeredComp);
      } else {
        const customComp: Company = {
          id: savedCompanyId,
          name: 'Enterprise Workspace Pvt Ltd',
          code: 'PLMS',
          currency: 'INR',
          logo: 'P',
          plan: 'Starter',
          createdAt: new Date().toISOString(),
          selectedDemoApps: [],
        };
        setActiveCompany(customComp);
      }
    }
    if (savedUserId) {
      let matchUsr = INITIAL_USERS.find(u => u.id === savedUserId);
      const savedUserStr = localStorage.getItem('open_crm_current_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

      if (savedUser && savedUser.name && savedUser.email) {
        matchUsr = savedUser;
      } else if (!matchUsr) {
        matchUsr = {
          id: savedUserId,
          name: 'Workspace Admin',
          email: 'admin@company.com',
          role: 'admin',
          companyId: savedCompanyId || 'cmp-1',
          avatar: 'A',
          title: 'Workspace Administrator',
          permissions: { canInstallApps: true, canUninstallApps: true, canUploadModules: true },
        };
      }
      if (matchUsr) {
        setCurrentUser(matchUsr);
        setIsAuthenticated(true);
      }
    }

    const dbConfigStr = localStorage.getItem('open_crm_db_config');
    const dbConfig = dbConfigStr ? JSON.parse(dbConfigStr) : null;
    if (dbConfig) {
      const queryParams = `host=${encodeURIComponent(dbConfig.host || 'localhost')}&port=${dbConfig.port || 5432}&dbName=${encodeURIComponent(dbConfig.dbName || 'pro-lms')}&dbUser=${encodeURIComponent(dbConfig.dbUser || 'postgres')}&dbPassword=${encodeURIComponent(dbConfig.dbPassword || '')}`;
      fetch(`/api/users?${queryParams}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.users) && data.users.length > 0) {
            setUsers(data.users);
          }
        })
        .catch((err) => console.error('Failed to fetch DB users:', err));
    }
  }, []);

  const handleSelectCompany = (comp: Company) => {
    setActiveCompany(comp);
    localStorage.setItem('open_crm_active_company_id', comp.id);
  };

  const handleSelectUser = (usr: UserProfile) => {
    setCurrentUser(usr);
    localStorage.setItem('open_crm_current_user_id', usr.id);
  };

  const handleSelectTheme = (theme: string) => {
    setColorTheme(theme);
    localStorage.setItem('open_crm_color_theme', theme);
  };

  const [settings, setSettings] = useState<ModuleSettings>(INITIAL_SETTINGS);

  const [apps, setApps] = useState<AppDefinition[]>(INITIAL_APPS);

  const activeInstalledApps = apps.map((app) => {
    if (activeCompany.selectedDemoApps && Array.isArray(activeCompany.selectedDemoApps)) {
      return {
        ...app,
        installed: activeCompany.selectedDemoApps.includes(app.id) || app.id === 'board' || app.id === 'settings',
      };
    }
    return app;
  });
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(INITIAL_WORKFLOWS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  const companyLeads = leads.filter((l) => l.companyId === activeCompany.id);
  const companyDeals = deals.filter((d) => d.companyId === activeCompany.id);
  const companyContacts = contacts.filter((c) => c.companyId === activeCompany.id);
  const companyWorkflows = workflows.filter((w) => w.companyId === activeCompany.id);
  const companyInvoices = invoices.filter((i) => i.companyId === activeCompany.id);
  const companyUsers = users.filter((u) => u.companyId === activeCompany.id);

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [{ ...newLead, companyId: activeCompany.id }, ...prev]);
  };

  const handleUpdateDealStage = (id: string, stage: Deal['stage']) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stage } : d))
    );
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals((prev) => [{ ...newDeal, companyId: activeCompany.id }, ...prev]);
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === 'Active' ? 'Paused' : 'Active' } : w
      )
    );
  };

  const handleToggleInstallApp = (appId: string, withDemoData: boolean = true) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'manager' && !currentUser.permissions?.canInstallApps) {
      return;
    }

    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, installed: !app.installed, withDemoData: !app.installed ? withDemoData : false } : app))
    );
  };

  const handleInstallCustomModule = (manifest: Partial<AppDefinition>) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'manager' && !currentUser.permissions?.canUploadModules) {
      return;
    }

    if (!manifest.id || !manifest.name) {
      return;
    }

    const newModule: AppDefinition = {
      id: manifest.id,
      name: manifest.name,
      category: manifest.category || 'Custom',
      iconName: manifest.iconName || 'Boxes',
      description: manifest.description || 'Custom loaded enterprise module',
      badge: manifest.badge || 'Custom',
      color: manifest.color || 'from-purple-500 to-indigo-600',
      installed: true,
      minRoleRequired: manifest.minRoleRequired || 'user',
      isCustomModule: true,
    };

    setApps((prev) => [newModule, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem('open_crm_current_user_id');
    router.push('/login');
  };

  const handleNavigate = (id: AppId) => {
    if (id === 'board') {
      router.push('/');
    } else {
      router.push(`/app/${id}`);
    }
  };

  const getThemeClass = () => {
    return 'bg-slate-50 text-slate-900';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-sans">
        <div className="flex items-center space-x-3 text-xs font-bold text-slate-600 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className={`min-h-screen flex flex-col font-sans transition-colors duration-300 theme-${colorTheme} ${getThemeClass()}`}>
      <Navbar
        activeApp={routeAppId}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        companies={companies}
        activeCompany={activeCompany}
        onSelectCompany={handleSelectCompany}
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        mode="light"
        onToggleMode={() => {}}
        colorTheme={colorTheme}
        onSelectTheme={handleSelectTheme}
        onNavigateToSettings={() => handleNavigate('settings')}
        onToggleMobileSidebar={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
        onRegisterCompany={(comp, admin) => {
          setCompanies((prev) => [comp, ...prev]);
          setActiveCompany(comp);
          setUsers((prev) => [admin, ...prev]);
          setCurrentUser(admin);
        }}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          apps={activeInstalledApps}
          activeApp={routeAppId}
          setActiveApp={(id) => handleNavigate(id)}
          userRole={currentUser.role}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
          themeMode="light"
        />

        <main className="flex-1 overflow-y-auto w-full">
          {routeAppId === 'board' && (
            <AppsBoard
              apps={activeInstalledApps}
              userRole={currentUser.role}
              onSelectApp={(id) => handleNavigate(id)}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onToggleInstallApp={handleToggleInstallApp}
              onInstallCustomModule={handleInstallCustomModule}
              themeMode="light"
            />
          )}

          {routeAppId === 'leads' && (
            <LeadsApp
              leads={companyLeads}
              onAddLead={handleAddLead}
              userRole={currentUser.role}
              themeMode="light"
            />
          )}

          {routeAppId === 'deals' && (
            <DealsApp
              deals={companyDeals}
              onUpdateDealStage={handleUpdateDealStage}
              onAddDeal={handleAddDeal}
              canEdit={currentUser.role === 'admin' || currentUser.role === 'manager'}
              userRole={currentUser.role}
              themeMode="light"
            />
          )}

          {routeAppId === 'contacts' && (
            <ContactsApp contacts={companyContacts} themeMode="light" />
          )}

          {routeAppId === 'automation' && (
            <AutomationApp workflows={companyWorkflows} onToggleStatus={handleToggleWorkflow} themeMode="light" />
          )}

          {routeAppId === 'analytics' && (
            <AnalyticsApp themeMode="light" />
          )}

          {routeAppId === 'invoices' && (
            <InvoiceApp invoices={companyInvoices} themeMode="light" />
          )}

          {routeAppId === 'settings' && (
            currentUser.role === 'admin' ? (
              <SettingsApp
                companies={companies}
                activeCompany={activeCompany}
                onSelectCompany={setActiveCompany}
                onCreateCompany={(c) => setCompanies((prev) => [c, ...prev])}
                users={companyUsers}
                currentUser={currentUser}
                onSelectUser={setCurrentUser}
                onImportUsers={(u) => {
                  setUsers((prev) => [...u, ...prev]);
                  const dbConfigStr = localStorage.getItem('open_crm_db_config');
                  const dbConfig = dbConfigStr ? JSON.parse(dbConfigStr) : null;
                  u.forEach((newUser) => {
                    fetch('/api/users', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ user: newUser, dbConfig }),
                    }).catch(console.error);
                  });
                }}
                onAddUser={(u) => {
                  setUsers((prev) => [u, ...prev]);
                  const dbConfigStr = localStorage.getItem('open_crm_db_config');
                  const dbConfig = dbConfigStr ? JSON.parse(dbConfigStr) : null;
                  fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: u, dbConfig }),
                  }).catch(console.error);
                }}
                onUpdateUser={(updatedUser) => {
                  setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
                  if (currentUser.id === updatedUser.id) setCurrentUser(updatedUser);
                  const dbConfigStr = localStorage.getItem('open_crm_db_config');
                  const dbConfig = dbConfigStr ? JSON.parse(dbConfigStr) : null;
                  fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: updatedUser, dbConfig }),
                  }).catch(console.error);
                }}
                themeMode="light"
                onThemeChange={(th) => {
                  setColorTheme(th);
                  localStorage.setItem('open_crm_color_theme', th);
                }}
                settings={settings}
                onUpdateSettings={setSettings}
                apps={apps}
                onToggleInstallApp={handleToggleInstallApp}
              />
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="p-4 rounded-full bg-rose-500/15 text-rose-600 inline-block">
                  <span className="font-extrabold text-lg">🔒 Admin Access Only</span>
                </div>
                <h3 className="text-xl font-extrabold">System Settings Restricted</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Only Administrator accounts have authorization to view or configure company system settings.
                </p>
              </div>
            )
          )}

          {['inventory', 'helpdesk', 'hr_employees', 'leave_management', 'attendance_tracking', 'company_holidays', 'project_tasks', 'marketing', 'pos', 'student_lms', 'client_portal', 'mrp_manufacturing', 'purchase_procurement', 'quality_control', 'maintenance_fleet', 'document_vault', 'calendar_events', 'website_cms'].includes(routeAppId) && (
            <GenericModuleApp
              appId={routeAppId}
              title={apps.find((a) => a.id === routeAppId)?.name || 'Module App'}
              description={apps.find((a) => a.id === routeAppId)?.description || 'Operational module'}
              iconName={apps.find((a) => a.id === routeAppId)?.iconName || 'Boxes'}
              withDemoData={apps.find((a) => a.id === routeAppId)?.withDemoData}
              themeMode="light"
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      <AICopilotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
