'use client';

import React, { useState } from 'react';
import { ThemeMode } from '@/types/crm';
import { 
  Package, 
  CheckCircle, 
  Plus, 
  Layers, 
  GraduationCap, 
  Building, 
  Activity, 
  Boxes, 
  Zap,
  LifeBuoy,
  UserCheck,
  CheckSquare,
  Mail,
  CreditCard,
  Factory,
  ShoppingCart,
  ShieldAlert,
  Wrench,
  FileText,
  AlertCircle,
  Calendar,
  Clock,
  Sparkles,
  Globe,
  BookOpen
} from 'lucide-react';
import { DynamicRecordModal, FieldDefinition } from '@/components/DynamicRecordModal';
import { DynamicRecordFormScreen } from '@/components/DynamicRecordFormScreen';

interface StandardModuleViewProps {
  appId: string;
  title: string;
  description: string;
  iconName: string;
  withDemoData?: boolean;
  themeMode?: ThemeMode;
}

const MODULE_DATA: Record<string, {
  metrics: { label: string; value: string; badge: string; icon: any }[];
  columns: string[];
  records: Array<{ id: string; col1: string; col2: string; col3: string; col4: string; status: string }>;
}> = {
  inventory: {
    metrics: [
      { label: 'Total In-Stock Items', value: '4,850 Units', badge: '+12% Stock', icon: Boxes },
      { label: 'Low Stock Alerts', value: '14 SKUs', badge: 'Reorder Soon', icon: AlertCircle },
      { label: 'Active Warehouses', value: '6 Hubs', badge: 'Multi-Loc', icon: Building },
    ],
    columns: ['SKU Code', 'Item Name & Specs', 'Warehouse Location', 'Available Stock', 'Stock Status'],
    records: [
      { id: 'SKU-8801', col1: 'Industrial Sensor Array V3', col2: 'Warehouse A (Rack 14)', col3: '1,420 Units', col4: 'In Stock', status: 'Optimal' },
      { id: 'SKU-8802', col1: 'Fiber Optic Cable Reel 500m', col2: 'Warehouse B (Rack 08)', col3: '85 Units', col4: 'Low Stock', status: 'Reorder Needed' },
      { id: 'SKU-8803', col1: 'Smart Meter Relay Terminal', col2: 'Main Distribution Hub', col3: '3,345 Units', col4: 'In Stock', status: 'Optimal' },
    ],
  },
  helpdesk: {
    metrics: [
      { label: 'Open Support Tickets', value: '42 Tickets', badge: 'SLA Active', icon: LifeBuoy },
      { label: 'Avg Resolution Time', value: '1.4 Hours', badge: '-18% Speed', icon: Zap },
      { label: 'CSAT Satisfaction Score', value: '98.4%', badge: 'High Rating', icon: CheckCircle },
    ],
    columns: ['Ticket Ref', 'Subject / Issue Description', 'Customer & Account', 'SLA Due Time', 'Ticket Status'],
    records: [
      { id: 'TKT-4401', col1: 'API Rate Limit Throttle Issue', col2: 'Acme Global Corp', col3: 'In 35 mins', col4: 'In Progress', status: 'High Priority' },
      { id: 'TKT-4402', col1: 'SSO SAML Authentication Error', col2: 'Starlight Tech Solutions', col3: 'In 2 hours', col4: 'Pending Client', status: 'Normal' },
      { id: 'TKT-4403', col1: 'Invoice Billing Currency Mismatch', col2: 'Nexus BioHealth', col3: 'Resolved', col4: 'Closed', status: 'Resolved' },
    ],
  },
  hr_employees: {
    metrics: [
      { label: 'Total Active Workforce', value: '312 Employees', badge: 'Full Time', icon: UserCheck },
      { label: 'Department Headcount', value: '12 Divisions', badge: 'Organized', icon: Layers },
      { label: 'Monthly Attendance Rate', value: '99.1%', badge: 'On Track', icon: Activity },
    ],
    columns: ['Emp Code', 'Employee Name & Role', 'Department', 'Join Date', 'Employment Status'],
    records: [
      { id: 'EMP-102', col1: 'Dr. Aris Thorne (Lead AI Researcher)', col2: 'R&D Engineering', col3: '2023-04-15', col4: 'Full Time', status: 'Active' },
      { id: 'EMP-105', col1: 'Clara Oswald (Operations Director)', col2: 'Global Supply Chain', col3: '2024-01-10', col4: 'Full Time', status: 'Active' },
      { id: 'EMP-110', col1: 'Marcus Brody (Financial Analyst)', col2: 'Corporate Finance', col3: '2025-06-01', col4: 'On Leave', status: 'Leave' },
    ],
  },
  leave_management: {
    metrics: [
      { label: 'Pending PTO Requests', value: '8 Requests', badge: 'Awaiting Signoff', icon: Calendar },
      { label: 'Approved Leave Days', value: '142 Days', badge: 'YTD Approved', icon: CheckCircle },
      { label: 'Average PTO Balance', value: '18.5 Days', badge: 'Per Employee', icon: Activity },
    ],
    columns: ['Leave Ref #', 'Employee Name & Reason', 'Leave Type', 'Duration / Dates', 'Approval Status'],
    records: [
      { id: 'PTO-301', col1: 'Sarah Jenkins (Annual Family Vacation)', col2: 'Paid Leave (PTO)', col3: '2026-09-10 to 2026-09-17', col4: 'Pending Approval', status: 'Pending' },
      { id: 'PTO-302', col1: 'David Chen (Medical Checkup & Recovery)', col2: 'Sick Leave', col3: '2026-09-02 to 2026-09-03', col4: 'Approved', status: 'Approved' },
      { id: 'PTO-303', col1: 'Michael Chang (Paternity Leave)', col2: 'Parental Leave', col3: '2026-10-01 to 2026-10-15', col4: 'Approved', status: 'Approved' },
    ],
  },
  attendance_tracking: {
    metrics: [
      { label: 'Punctual Clock-In Rate', value: '98.4%', badge: 'On Time', icon: Clock },
      { label: 'Total Overtime Hours', value: '340 Hours', badge: 'Logged YTD', icon: Zap },
      { label: 'Remote / WFH Today', value: '45 Active', badge: 'Hybrid Mode', icon: UserCheck },
    ],
    columns: ['Attendance ID', 'Employee Name', 'Shift Time & Mode', 'Clock-In Timestamp', 'Workday Status'],
    records: [
      { id: 'ATT-801', col1: 'Elena Vance (Lead Architect)', col2: 'Regular Shift (WFH)', col3: 'Today 08:55 AM', col4: 'Punctual', status: 'Present' },
      { id: 'ATT-802', col1: 'Marcus Brody (Financial Analyst)', col2: 'Morning Shift (On-Site)', col3: 'Today 09:02 AM', col4: 'Grace Period', status: 'Present' },
      { id: 'ATT-803', col1: 'Dr. Aris Thorne (Lead AI Researcher)', col2: 'Flexible Shift (Lab)', col3: 'Today 08:30 AM', col4: 'Overtime Early', status: 'Present' },
    ],
  },
  company_holidays: {
    metrics: [
      { label: 'Official Paid Holidays', value: '14 Days', badge: 'Company Calendar', icon: Sparkles },
      { label: 'Upcoming Holiday', value: 'Labor Day', badge: 'In 6 Days', icon: Calendar },
      { label: 'Global Regional Schedules', value: '3 Calendars', badge: 'US/EU/APAC', icon: Layers },
    ],
    columns: ['Holiday Code', 'Holiday Title & Occasion', 'Observed Date', 'Applicable Region', 'Status'],
    records: [
      { id: 'HOL-101', col1: 'Labor & Workers National Day', col2: '2026-09-07', col3: 'All Global Branches (US/EU/APAC)', col4: 'Paid Holiday', status: 'Upcoming' },
      { id: 'HOL-102', col1: 'Thanksgiving Celebration Day', col2: '2026-11-26', col3: 'US & Canada Offices', col4: 'Paid Holiday', status: 'Scheduled' },
      { id: 'HOL-103', col1: 'Year-End Enterprise Shutdown', col2: '2026-12-25 to 2026-12-31', col3: 'Organization Wide', col4: 'Paid Holiday', status: 'Scheduled' },
    ],
  },
  project_tasks: {
    metrics: [
      { label: 'Active Project Sprints', value: '3 Sprints', badge: 'Active Sprints', icon: CheckSquare },
      { label: 'Tasks Completed', value: '42 Tasks', badge: 'Sprint Progress', icon: CheckCircle },
      { label: 'Overdue Milestones', value: '0 Late', badge: 'On Schedule', icon: Zap },
    ],
    columns: ['Task ID', 'Task Title & Summary', 'Assigned Lead', 'Target Deadline', 'Sprint Status'],
    records: [
      { id: 'TSK-9901', col1: 'Deploy Kubernetes Multi-Region Cluster', col2: 'DevOps Team (Alex R.)', col3: '2026-09-05', col4: 'In QA', status: 'In Review' },
      { id: 'TSK-9902', col1: 'Refactor GraphQL Customer Resolver', col2: 'Backend Squad (David C.)', col3: '2026-08-30', col4: 'In Progress', status: 'Active' },
      { id: 'TSK-9903', col1: 'Audit ISO-27001 Security Controls', col2: 'Security Officer (Sarah J.)', col3: '2026-09-12', col4: 'Completed', status: 'Done' },
    ],
  },
  student_lms: {
    metrics: [
      { label: 'Enrolled Trainees / Students', value: '1,420 Enrolled', badge: 'Active Cohort', icon: GraduationCap },
      { label: 'Course Completion Rate', value: '94.2%', badge: 'Certified', icon: CheckCircle },
      { label: 'Live Training Webinars', value: '8 Active', badge: 'Real Time', icon: Activity },
    ],
    columns: ['Enrollment ID', 'Course Name & Module', 'Trainee Name', 'Progress Score', 'Certification Status'],
    records: [
      { id: 'EDU-7701', col1: 'Advanced Cloud Security & Compliance', col2: 'James Vance', col3: '98% Completed', col4: 'Passed', status: 'Certified' },
      { id: 'EDU-7702', col1: 'Enterprise Architecture Essentials', col2: 'Elena Rostova', col3: '65% Completed', col4: 'In Progress', status: 'Enrolled' },
      { id: 'EDU-7703', col1: 'AI & Machine Learning Ops Pipeline', col2: 'Michael Chang', col3: '100% Completed', col4: 'Passed', status: 'Certified' },
    ],
  },
  client_portal: {
    metrics: [
      { label: 'Active Client Portals', value: '86 VIP Portals', badge: 'Custom Branded', icon: Building },
      { label: 'Signed Contracts', value: '124 Documents', badge: 'Legally Valid', icon: FileText },
      { label: 'Client Satisfaction Index', value: '4.9 / 5.0', badge: 'Top Rated', icon: Zap },
    ],
    columns: ['Portal ID', 'Organization Account', 'Primary Key Contact', 'Access Scope', 'Portal Status'],
    records: [
      { id: 'PRT-3001', col1: 'Vanguard Global Corp', col2: 'David Chen (VP Eng)', col3: 'VIP Full Access', col4: 'Active Session', status: 'Live' },
      { id: 'PRT-3002', col1: 'Starlight Tech Solutions', col2: 'Sarah Jenkins', col3: 'Standard Portal', col4: 'Active Session', status: 'Live' },
      { id: 'PRT-3003', col1: 'Nexus BioHealth', col2: 'Elena Vance', col3: 'Billing Only', col4: 'Idle', status: 'Standard' },
    ],
  },
  mrp_manufacturing: {
    metrics: [
      { label: 'Production Work Orders', value: '28 Orders', badge: 'Shop Floor', icon: Factory },
      { label: 'Overall Equipment Efficiency', value: '92.4% OEE', badge: 'High Yield', icon: Activity },
      { label: 'Raw Material Stock Levels', value: '100% Ready', badge: 'No Stoppage', icon: Boxes },
    ],
    columns: ['Work Order #', 'Assembly Item & Batch Code', 'Workstation Line', 'Target Quantity', 'Work Status'],
    records: [
      { id: 'WO-5001', col1: 'High-Precision Circuit Board A4', col2: 'Assembly Line #3', col3: '5,000 Units', col4: 'In Production', status: 'Running' },
      { id: 'WO-5002', col1: 'Lithium Battery Module Pack B2', col2: 'Assembly Line #1', col3: '1,200 Units', col4: 'Scheduled', status: 'Queued' },
      { id: 'WO-5003', col1: 'Solar Inverter Chassis Enclosure', col2: 'CNC Milling Bay', col3: '850 Units', col4: 'Completed', status: 'Done' },
    ],
  },
  purchase_procurement: {
    metrics: [
      { label: 'Active RFQs & Purchase Orders', value: '$485,000 POs', badge: 'Approved', icon: ShoppingCart },
      { label: 'Verified Suppliers', value: '45 Vendors', badge: 'Vetted', icon: CheckCircle },
      { label: 'Cost Savings Index', value: '8.5% Saved', badge: 'Under Budget', icon: Zap },
    ],
    columns: ['PO Ref #', 'Vendor Name & Details', 'Item Specification', 'Total Order Value', 'Procurement Status'],
    records: [
      { id: 'PO-9101', col1: 'Semiconductor Microchip Corp', col2: 'Wafer Supply 100k Units', col3: '$245,000', col4: 'Shipped', status: 'In Transit' },
      { id: 'PO-9102', col1: 'Global Steel & Alloy Logistics', col2: 'Aluminum Extrusion Bars', col3: '$85,000', col4: 'Approved PO', status: 'Approved' },
      { id: 'PO-9103', col1: 'Polymer Precision Packaging', col2: 'Custom Protective Cases', col3: '$32,000', col4: 'Delivered', status: 'Completed' },
    ],
  },
  quality_control: {
    metrics: [
      { label: 'Quality Pass Rate', value: '99.68%', badge: 'ISO Certified', icon: ShieldAlert },
      { label: 'Inspections Completed', value: '1,240 Batches', badge: 'Audited', icon: CheckCircle },
      { label: 'Open NCR Defect Logs', value: '2 Items', badge: 'Contained', icon: AlertCircle },
    ],
    columns: ['Audit Ref #', 'Sample Inspection Batch', 'Quality Standard', 'Tested Defect Rate', 'Inspection Outcome'],
    records: [
      { id: 'QC-6001', col1: 'Batch #B-994 (Circuit Relays)', col2: 'ISO-9001 Standard', col3: '0.01% Defect', col4: 'Passed Audit', status: 'Approved' },
      { id: 'QC-6002', col1: 'Batch #B-998 (Power Cables)', col2: 'CE Safety Specs', col3: '0.00% Defect', col4: 'Passed Audit', status: 'Approved' },
      { id: 'QC-6003', col1: 'Batch #B-1002 (Casing Mold)', col2: 'ANSI B4.1 Tolerance', col3: '0.12% Defect', col4: 'Needs Re-Test', status: 'Flagged' },
    ],
  },
  maintenance_fleet: {
    metrics: [
      { label: 'Maintained Equipment Units', value: '148 Machines', badge: '100% Uptime', icon: Wrench },
      { label: 'Preventive Work Orders', value: '15 Active', badge: 'Scheduled', icon: Activity },
      { label: 'Mean Time Between Failures', value: '1,450 Hours', badge: 'Reliable', icon: Zap },
    ],
    columns: ['Equipment ID', 'Machine Name & Specs', 'Location / Line', 'Last Service Date', 'Maintenance Status'],
    records: [
      { id: 'EQP-201', col1: '5-Axis CNC Robot Arm Laser', col2: 'Bay 4 (Factory North)', col3: '2026-08-10', col4: 'Optimal Operating', status: 'Healthy' },
      { id: 'EQP-205', col1: 'Automated Hydraulic Stamping Press', col2: 'Bay 1 (Factory South)', col3: '2026-08-20', col4: 'Scheduled Check', status: 'Maintenance Due' },
      { id: 'EQP-212', col1: 'High-Volume Vacuum Sealer', col2: 'Packaging Line 2', col3: '2026-07-30', col4: 'Calibrated', status: 'Healthy' },
    ],
  },
  document_vault: {
    metrics: [
      { label: 'Total Vault Documents', value: '14,820 Files', badge: 'Encrypted', icon: FileText },
      { label: 'Digital Signatures', value: '100% Verified', badge: 'Audit Trail', icon: CheckCircle },
      { label: 'Storage Usage', value: '1.2 TB / 5 TB', badge: 'Secure Cloud', icon: Layers },
    ],
    columns: ['Document ID', 'File Title & Description', 'Category / Vault', 'File Size', 'Access Rights'],
    records: [
      { id: 'DOC-1001', col1: 'Master Enterprise SLA Contract 2026.pdf', col2: 'Legal Contracts', col3: '4.8 MB', col4: 'Restricted Admin', status: 'Signed' },
      { id: 'DOC-1002', col1: 'ISO 27001 Security Audit Certificate.pdf', col2: 'Compliance Vault', col3: '2.1 MB', col4: 'Organization Wide', status: 'Verified' },
      { id: 'DOC-1003', col1: 'Q3 Financial Statements & Audit Report.pdf', col2: 'Executive Board', col3: '14.5 MB', col4: 'Confidential Board', status: 'Encrypted' },
    ],
  },
  automation: {
    metrics: [
      { label: 'Active Workflows', value: '34 Rules', badge: 'Automated', icon: Zap },
      { label: 'Total Executions Today', value: '18,420 Runs', badge: '+32% Velocity', icon: Activity },
      { label: 'Error Exception Rate', value: '0.001%', badge: 'Flawless', icon: CheckCircle },
    ],
    columns: ['Rule Code', 'Trigger Event & Target Action', 'Execution Mode', 'Last Execution', 'Workflow Status'],
    records: [
      { id: 'WFR-401', col1: 'New Lead Auto-Score & CRM Routing', col2: 'Real-Time Event', col3: '2 mins ago', col4: 'Active Running', status: 'Active' },
      { id: 'WFR-402', col1: 'Overdue Invoice Escalation & Email Alert', col2: 'Cron Daily 08:00', col3: 'Today 08:00', col4: 'Active Running', status: 'Active' },
      { id: 'WFR-403', col1: 'High Priority SLA Support Ticket Routing', col2: 'Webhook Event', col3: '15 mins ago', col4: 'Active Running', status: 'Active' },
    ],
  },
  calendar_events: {
    metrics: [
      { label: 'Scheduled Meetings', value: '28 Meetings', badge: 'This Week', icon: Calendar },
      { label: 'Client Webinars', value: '4 Webinars', badge: 'Upcoming', icon: Clock },
      { label: 'Meeting Rooms Active', value: '6 Rooms', badge: 'Booked', icon: Building },
    ],
    columns: ['Event ID', 'Meeting Title & Agenda', 'Date & Time Schedule', 'Participants & Host', 'Event Status'],
    records: [
      { id: 'EVT-101', col1: 'Q3 Enterprise Product Roadmap & Strategy Session', col2: 'Today, 14:00 - 15:30 EST', col3: 'Sarah Jenkins (Host) + 12 Attendees', col4: 'Confirmed Meeting', status: 'Scheduled' },
      { id: 'EVT-102', col1: 'Key Account CRM Onboarding Walkthrough', col2: 'Tomorrow, 10:00 - 11:00 EST', col3: 'Michael Chang + Apex Global Team', col4: 'Confirmed Meeting', status: 'Scheduled' },
      { id: 'EVT-103', col1: 'Annual Corporate Partner & Leadership Summit', col2: '2026-09-05, All Day', col3: 'Alex Rivera (Host) + 85 Guests', col4: 'Invites Sent', status: 'Upcoming' },
    ],
  },
  website_cms: {
    metrics: [
      { label: 'Website Monthly Traffic', value: '142.8K Visitors', badge: '+24% Growth', icon: Globe },
      { label: 'Published CMS Pages', value: '45 Pages', badge: 'SEO Optimized', icon: FileText },
      { label: 'Conversion Leads', value: '3.4% Rate', badge: 'High Yield', icon: Sparkles },
    ],
    columns: ['Page ID', 'Page Title & URL Slug', 'Template Layout', 'Monthly Views', 'Publish Status'],
    records: [
      { id: 'WEB-001', col1: 'Corporate Homepage (/home)', col2: 'SaaS Enterprise Landing', col3: '84,500 Views', col4: 'Published Live', status: 'Live' },
      { id: 'WEB-002', col1: 'Enterprise Pricing & Plans (/pricing)', col2: 'Tier Comparison Matrix', col3: '28,100 Views', col4: 'Published Live', status: 'Live' },
      { id: 'WEB-003', col1: 'Q3 Industry Case Studies & Blog (/blog)', col2: 'CMS Dynamic Grid', col3: '14,200 Views', col4: 'Draft Preview', status: 'Draft' },
    ],
  },
};

interface StandardModuleViewProps {
  appId: string;
  title: string;
  description: string;
  iconName: string;
  withDemoData?: boolean;
  themeMode?: ThemeMode;
  currentUser?: { role: string; name: string };
}

export const GenericModuleApp: React.FC<StandardModuleViewProps> = ({
  appId,
  title,
  description,
  iconName,
  withDemoData = false,
  themeMode = 'light',
  currentUser,
}) => {
  const isLight = themeMode === 'light';
  const isAdmin = currentUser?.role === 'admin';
  const [isWebsiteLoading, setIsWebsiteLoading] = useState<boolean>(appId === 'website_cms');

  React.useEffect(() => {
    if (appId === 'website_cms') {
      setIsWebsiteLoading(true);
      const timer = setTimeout(() => {
        setIsWebsiteLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [appId]);

  const defaultData = MODULE_DATA[appId] || {
    metrics: [
      { label: `Total ${title} Items`, value: '1,248 Records', badge: 'Active Engine', icon: Activity },
      { label: 'Live Data Sync', value: 'Active', badge: 'Real Time', icon: CheckCircle },
      { label: 'Security Scope', value: 'Enterprise', badge: 'Role Governed', icon: Layers },
    ],
    columns: ['Record ID', 'Reference Title', 'Category', 'Last Modified', 'Actions / Status'],
    records: [
      { id: 'REF-9021', col1: `${title} Core Operational Node`, col2: 'Operations', col3: '2026-08-28', col4: 'Active', status: 'Optimal' },
      { id: 'REF-9022', col1: `Integrated ${title} Pipeline`, col2: 'Intelligence', col3: '2026-08-27', col4: 'Active', status: 'Optimal' },
    ],
  };

  const [records, setRecords] = useState(withDemoData ? defaultData.records : []);
  const [isFormScreenOpen, setIsFormScreenOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [deletingRecord, setDeletingRecord] = useState<{ id: string; title: string } | null>(null);
  const [appTab, setAppTab] = useState<'overview' | 'docs' | 'settings'>('overview');

  if (isFormScreenOpen) {
    const fields: FieldDefinition[] = [
      { name: 'title', label: `${title} Entry Name`, type: 'text', required: true, placeholder: 'e.g. Core Operational Entry' },
      { name: 'category', label: 'Category / Scope', type: 'text', required: true, placeholder: 'e.g. Operations' },
      { name: 'notes', label: 'Operational Notes & Description', type: 'textarea', placeholder: 'Enter internal notes...' },
    ];

    return (
      <DynamicRecordFormScreen
        title={editingRecordId ? `Edit ${title} Record` : `Create New ${title} Record`}
        fields={fields}
        initialValues={{ title: formTitle, category: formCategory }}
        isLight={isLight}
        onCancel={() => setIsFormScreenOpen(false)}
        onSubmit={(data: Record<string, any>) => {
          if (editingRecordId) {
            setRecords((prev) =>
              prev.map((r) =>
                r.id === editingRecordId ? { ...r, col1: data.title, col2: data.category, col3: 'Just now' } : r
              )
            );
          } else {
            const newRec = {
              id: `REF-${Math.floor(Math.random() * 8999) + 1000}`,
              col1: data.title,
              col2: data.category || 'General',
              col3: new Date().toISOString().split('T')[0],
              col4: 'Active',
              status: 'Optimal',
            };
            setRecords((prev) => [newRec, ...prev]);
          }
          setIsFormScreenOpen(false);
        }}
      />
    );
  }

  const handleCreateClick = () => {
    setEditingRecordId(null);
    setFormTitle('');
    setFormCategory('');
    setIsFormScreenOpen(true);
  };

  const handleEditClick = (rec: { id: string; col1: string; col2: string }) => {
    setEditingRecordId(rec.id);
    setFormTitle(rec.col1);
    setFormCategory(rec.col2);
    setIsFormScreenOpen(true);
  };

  if (isWebsiteLoading && appId === 'website_cms') {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <Globe className="w-6 h-6 text-emerald-500 animate-pulse" />
        </div>
        <h3 className="text-lg font-extrabold">Building Public Corporate Website & CMS Content...</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Loading SEO landing page components, dynamic blog schemas & administrative web controls...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden p-6 sm:p-8 shadow-xl transition duration-300 theme-hero-custom text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/20 text-white border-white/30">
              <Boxes className="w-3.5 h-3.5 text-white" />
              <span className="capitalize">{appId.replace('_', ' ')} Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm text-white flex items-center space-x-3">
              <span>{title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              {description}
            </p>
          </div>

          <button 
            onClick={handleCreateClick}
            className="theme-btn-custom font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xl transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create New {title.split(' ')[0]} Entry</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAppTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold transition rounded-xl ${
            appTab === 'overview'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>{title} Dashboard</span>
        </button>

        <button
          onClick={() => setAppTab('docs')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold transition rounded-xl ${
            appTab === 'docs'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Module Docs & Flow Guide</span>
        </button>

        <button
          onClick={() => setAppTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-extrabold transition rounded-xl ${
            appTab === 'settings'
              ? 'theme-btn-custom shadow-md'
              : 'theme-span-custom opacity-70 hover:opacity-100'
          }`}
        >
          <span>{title} Settings</span>
        </button>
      </div>

      {appTab === 'docs' && (
        <div className="p-6 sm:p-8 space-y-6 rounded-2xl shadow-sm border bg-white border-slate-200 text-slate-900">
          <div className="border-b pb-4 border-slate-200 flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{title} — Operational Workflow Guide</h3>
              <p className="text-xs text-slate-500">Complete documentation explaining how {title} functions and integrates with your ERP database.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
              <h4 className="font-extrabold text-sm text-slate-900">Record Creation & Entry</h4>
              <p className="text-slate-600 leading-relaxed">
                Click <strong>&quot;Create New {title.split(' ')[0]} Entry&quot;</strong> to launch the dedicated full-screen record creation form. Submit entries to auto-sync with the PostgreSQL database.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">2</span>
              <h4 className="font-extrabold text-sm text-slate-900">Status & Workflow Automation</h4>
              <p className="text-slate-600 leading-relaxed">
                Records execute automated status triggers. Updates are saved to audit logs with timestamp verification and assigned user tracking.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
              <h4 className="font-extrabold text-sm text-slate-900">PostgreSQL Multi-Tenant Sync</h4>
              <p className="text-slate-600 leading-relaxed">
                Data tables are partitioned per company workspace. Administrators can export records or configure custom field rules from the Settings tab.
              </p>
            </div>
          </div>
        </div>
      )}

      {appTab === 'settings' ? (
        <div className="p-6 space-y-6 rounded-2xl shadow-sm theme-card-custom">
          <div className="border-b pb-3 border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">{title} Dedicated App Settings</h3>
            <p className="text-xs text-slate-500">Configure parameters, notification triggers, and storage queues specifically for {title}.</p>
          </div>

          {!isAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <span>🔒 Module configuration is read-only. Only Administrators have permission to modify settings.</span>
            </div>
          )}

          <fieldset disabled={!isAdmin} className="space-y-4 max-w-xl text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <div>
                <p className="font-bold text-slate-900">Module Real-Time Push Notifications</p>
                <p className="text-[10px] text-slate-500">Send instant browser notifications when new entries are added to {title}.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer disabled:cursor-not-allowed" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <div>
                <p className="font-bold text-slate-900">Automated Daily Data Snapshot</p>
                <p className="text-[10px] text-slate-500">Backup all {title} dataset records to encrypted cloud storage at 00:00 UTC.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer disabled:cursor-not-allowed" />
            </label>

            <div className="p-3 rounded-xl border border-slate-200 space-y-1">
              <label className="font-bold block text-slate-900">Primary Storage Queue Engine</label>
              <select className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed">
                <option>High Performance Distributed Cache</option>
                <option>Encrypted Cloud Vault</option>
                <option>Multi-Region Database Storage</option>
              </select>
            </div>

            {isAdmin && (
              <button onClick={() => {}} className="px-5 py-2.5 rounded-xl text-xs font-extrabold theme-btn-custom shadow-md">
                Save {title} Settings
              </button>
            )}
          </fieldset>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {defaultData.metrics.map((m, idx) => {
          const MetricIcon = m.icon;
          const displayValue = withDemoData ? m.value : '0';
          const displayBadge = withDemoData ? m.badge : '0 Records';
          return (
            <div key={idx} className="rounded-2xl p-5 sm:p-6 space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500">{m.label}</p>
                <MetricIcon className="w-4 h-4 theme-svg-custom" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{displayValue}</p>
              <span className="text-[10px] theme-span-custom px-2 py-0.5 rounded-full font-bold inline-block">{displayBadge}</span>
            </div>
          );
        })}
      </div>

      <div className="shadow-lg overflow-x-auto theme-card-custom">
        <table className="w-full text-left text-xs min-w-[680px]">
          <thead className="font-extrabold theme-span-custom border-b">
            <tr>
              {defaultData.columns.map((col, idx) => (
                <th key={idx} className={`p-3.5 ${idx === defaultData.columns.length - 1 ? 'text-right' : ''}`}>
                  {col === 'Actions / Status' ? 'Actions' : col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={defaultData.columns.length} className="p-8 text-center text-slate-500">
                  <p className="font-bold text-sm text-slate-900">No Records Found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    This module was installed without pre-populated demo data. Click <strong>"Create New {title.split(' ')[0]} Entry"</strong> to add your first record.
                  </p>
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id} className="transition duration-150 border-b border-slate-100">
                  <td className="p-3.5 font-mono theme-record-id">{rec.id}</td>
                  <td className="p-3.5 font-bold text-slate-900">{rec.col1}</td>
                  <td className="p-3.5 text-slate-600 font-semibold">{rec.col2}</td>
                  <td className="p-3.5 font-mono text-slate-500">{rec.col3}</td>
                  <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(rec)}
                      className="px-3 py-1.5 text-[11px] font-extrabold rounded-lg theme-btn-custom shadow-sm transition inline-flex items-center justify-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingRecord({ id: rec.id, title: rec.col1 })}
                      className="px-3 py-1.5 text-[11px] font-extrabold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition inline-flex items-center justify-center"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </>
      )}

      {deletingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl bg-white text-slate-900 border border-slate-200">
            <h3 className="text-base font-extrabold text-rose-600 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Delete Record</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              This record (<strong className="font-mono text-rose-600">{deletingRecord.id}</strong> - <em>"{deletingRecord.title}"</em>) should be deleted?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeletingRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id));
                  setDeletingRecord(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
