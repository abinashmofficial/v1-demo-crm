'use client';

import React, { useState } from 'react';
import { Lead, ThemeMode } from '@/types/crm';
import { 
  Target, 
  Sparkles, 
  Search, 
  Plus, 
  Flame, 
  Building, 
  Mail, 
  Phone,
  Settings
} from 'lucide-react';

interface LeadsAppProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  userRole?: string;
  themeMode?: ThemeMode;
}

export const LeadsApp: React.FC<LeadsAppProps> = ({ leads, onAddLead, userRole = 'user' }) => {
  const isAdmin = userRole === 'admin';
  const [appTab, setAppTab] = useState<'overview' | 'settings'>('overview');
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    dealValue: 25000,
    source: 'Website' as const,
  });

  const filteredLeads = leads.filter((l) => {
    const matchesFilter = filter === 'All' || l.status === filter;
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                          l.company.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.company) return;

    const created: Lead = {
      id: `lead-${Date.now()}`,
      companyId: 'comp-1',
      name: newLead.name,
      company: newLead.company,
      email: newLead.email || `${newLead.name.toLowerCase().replace(' ', '.')}@${newLead.company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: newLead.phone || '+1 (555) 019-2831',
      status: 'New',
      source: newLead.source,
      aiScore: Math.floor(Math.random() * 25) + 75,
      dealValue: Number(newLead.dealValue),
      tags: ['Inbound', 'AI Scored'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddLead(created);
    setShowModal(false);
    setNewLead({ name: '', company: '', email: '', phone: '', dealValue: 25000, source: 'Website' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full">
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200 bg-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-50/50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-50/50 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
              <Target className="w-3.5 h-3.5" />
              <span>AI Lead Intelligence Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Lead Radar & Predictive Scoring
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
              Real-time intent score tracking & automated deal value estimation.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center space-x-2 shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Capture New Lead</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAppTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${
            appTab === 'overview'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Leads Directory</span>
        </button>

        <button
          onClick={() => setAppTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${
            appTab === 'settings'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {appTab === 'settings' ? (
        <div className="p-6 sm:p-8 space-y-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
          <div className="border-b pb-4 border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Leads Module Settings</h3>
            <p className="text-sm text-slate-500 mt-1">Configure lead capture parameters, AI intent scoring thresholds, and auto-routing rules.</p>
          </div>

          {!isAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <span>🔒 Leads module configuration is read-only. Only Administrators have permission to modify settings.</span>
            </div>
          )}

          <fieldset disabled={!isAdmin} className="space-y-6 max-w-xl text-sm">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900">Auto-Assign New Inbound Leads</p>
                <p className="text-xs text-slate-500 mt-0.5">Automatically route incoming web leads to round-robin sales reps.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-0 cursor-pointer border-slate-300 disabled:cursor-not-allowed" />
            </label>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="font-bold block text-slate-900">Minimum AI Intent Threshold Score</label>
              <p className="text-xs text-slate-500 mb-2">Leads with scores below this value will be flagged for nurture campaigns.</p>
              <input type="number" defaultValue={75} className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="font-bold block text-slate-900">Default Lead Source Attribution</label>
              <select className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                <option>Website Organic Form</option>
                <option>LinkedIn Lead Gen Ad</option>
                <option>API Webhook Import</option>
              </select>
            </div>

            {isAdmin && (
              <button onClick={() => {}} className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                Save Configuration
              </button>
            )}
          </fieldset>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[1.5rem] bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'New', 'Contacted', 'Qualified', 'Converted'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xl whitespace-nowrap ${
                filter === st
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-[1.5rem] overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Lead Details</th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[10px]">AI Intent Score</th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Est. Deal Value</th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Pipeline Status</th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Attribution</th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Contact Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="transition duration-200 hover:bg-slate-50/50">
                <td className="py-4 px-6">
                  <div className="font-black text-slate-900">{lead.name}</div>
                  <div className="text-slate-500 flex items-center space-x-1.5 mt-1 text-xs font-semibold">
                    <Building className="w-3 h-3" />
                    <span>{lead.company}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 font-bold text-xs">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>{lead.aiScore}/100</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-black text-slate-700">
                  ${lead.dealValue.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    lead.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-500 font-semibold text-xs">
                  {lead.source}
                </td>
                <td className="py-4 px-6 space-y-1.5 text-slate-500 text-xs font-medium">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.phone}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-md p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <Target className="w-6 h-6 text-indigo-600" />
              <span>Capture Lead into Radar</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Belfort"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Company</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stratton Corp"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Est. Value ($)</label>
                  <input
                    type="number"
                    value={newLead.dealValue}
                    onChange={(e) => setNewLead({ ...newLead, dealValue: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                >
                  Create & Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
