export type AppId = 
  | 'board' 
  | 'leads' 
  | 'deals' 
  | 'contacts' 
  | 'automation' 
  | 'analytics' 
  | 'invoices' 
  | 'inventory'
  | 'helpdesk'
  | 'hr_employees'
  | 'project_tasks'
  | 'marketing'
  | 'pos'
  | 'settings'
  | string;

export type UserRole = 'admin' | 'manager' | 'user';

export type ModeType = 'light';

export type ColorTheme = 
  | 'default'
  | 'midnight-blue' 
  | 'emerald-forest' 
  | 'cyber-purple' 
  | 'sunset-amber' 
  | 'crimson-red' 
  | 'teal-ocean' 
  | 'nordic-slate' 
  | 'high-contrast';

export type ThemeMode = 'light' | ColorTheme;

export interface PostgresDbConfig {
  host: string;
  port: number;
  dbName: string;
  dbUser: string;
  dbPassword?: string;
  sslMode: 'disable' | 'require';
  status?: 'Connected' | 'Unverified';
}

export interface Company {
  id: string;
  name: string;
  code: string;
  currency: string;
  logo: string;
  customLogoUrl?: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  createdAt: string;
  dbConfig?: PostgresDbConfig;
  selectedDemoApps?: string[];
}

export interface UserPermissions {
  canInstallApps: boolean;
  canUninstallApps: boolean;
  canUploadModules: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  avatar: string;
  title: string;
  password?: string;
  activeStatus?: boolean;
  permissions?: UserPermissions;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  category: 'Core CRM' | 'Education' | 'Operations' | 'Intelligence' | 'Finance' | 'Human Resources' | 'Marketing' | 'Custom';
  iconName: string;
  description: string;
  badge?: string;
  color: string;
  installed: boolean;
  minRoleRequired?: UserRole;
  isCustomModule?: boolean;
  withDemoData?: boolean;
  version?: string;
  author?: string;
  settings?: Record<string, any>;
}

export interface Lead {
  id: string;
  companyId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
  source: 'Website' | 'LinkedIn' | 'Referral' | 'Campaign' | 'Inbound';
  aiScore: number;
  dealValue: number;
  tags: string[];
  createdAt: string;
}

export interface Deal {
  id: string;
  companyId: string;
  title: string;
  company: string;
  amount: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  closeDate: string;
  owner: string;
}

export interface Contact {
  id: string;
  companyId: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  lastInteraction: string;
  channel: 'Email' | 'WhatsApp' | 'Call' | 'Meeting';
  sentiment: 'Positive' | 'Neutral' | 'At Risk';
}

export interface WorkflowRule {
  id: string;
  companyId: string;
  name: string;
  trigger: string;
  action: string;
  status: 'Active' | 'Paused';
  executions: number;
}

export interface Invoice {
  id: string;
  companyId: string;
  invoiceNo: string;
  client: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
}

export interface ModuleSettings {
  companySettings: {
    companyName: string;
    currency: string;
    timezone: string;
    multiCurrency: boolean;
  };
  leadsSettings: {
    autoAssignLeads: boolean;
    minAiScoreThreshold: number;
    defaultSource: string;
  };
  dealsSettings: {
    requireCloseReason: boolean;
    allowDragAndDrop: boolean;
    defaultPipeline: string;
  };
  securitySettings: {
    allowUserModuleInstall: boolean;
    enforceMfa: boolean;
    sessionTimeoutMins: number;
  };
}
