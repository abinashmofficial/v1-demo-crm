'use client';

import React, { useState } from 'react';
import { Deal, ThemeMode } from '@/types/crm';
import { 
  Kanban, 
  Plus, 
  TrendingUp, 
  User,
  ArrowRight,
  GripVertical,
  Settings,
  DollarSign
} from 'lucide-react';

interface DealsAppProps {
  deals: Deal[];
  onUpdateDealStage: (id: string, stage: Deal['stage']) => void;
  onAddDeal?: (newDeal: Deal) => void;
  canEdit?: boolean;
  userRole?: string;
  themeMode?: ThemeMode;
}

const STAGES: Deal['stage'][] = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export const DealsApp: React.FC<DealsAppProps> = ({ 
  deals, 
  onUpdateDealStage,
  onAddDeal,
  canEdit = true,
  userRole = 'user',
  themeMode = 'light',
}) => {
  const isAdmin = userRole === 'admin';
  const [appTab, setAppTab] = useState<'overview' | 'settings'>('overview');
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Deal['stage'] | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newAmount, setNewAmount] = useState<number>(10000);
  const [newStage, setNewStage] = useState<Deal['stage']>('Discovery');
  const [newOwner, setNewOwner] = useState('Alex Rivera');

  const totalPipelineValue = deals.reduce((acc, d) => acc + d.amount, 0);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stage: Deal['stage']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: Deal['stage']) => {
    e.preventDefault();
    setDragOverStage(null);
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId && canEdit) {
      onUpdateDealStage(dealId, targetStage);
    }
    setDraggedDealId(null);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const createdDeal: Deal = {
      id: `deal-${Date.now()}`,
      companyId: 'comp-1',
      title: newTitle,
      company: newCompany,
      amount: Number(newAmount) || 0,
      stage: newStage,
      probability: newStage === 'Closed Won' ? 100 : 50,
      closeDate: new Date().toISOString().split('T')[0],
      owner: newOwner,
    };

    if (onAddDeal) {
      onAddDeal(createdDeal);
    }
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewAmount(10000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full">
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200 bg-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-50/50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-teal-50/50 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Kanban className="w-3.5 h-3.5" />
              <span>Interactive Revenue Canvas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Deals Pipeline Board
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
              Drag-and-drop deal management with stage-by-stage revenue tracking.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {canEdit && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center space-x-2 shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Deal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAppTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${
            appTab === 'overview'
              ? 'bg-emerald-50 text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>Pipeline Canvas</span>
        </button>

        <button
          onClick={() => setAppTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${
            appTab === 'settings'
              ? 'bg-emerald-50 text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>Deals Settings</span>
        </button>
      </div>

      {appTab === 'settings' ? (
        <div className="p-6 sm:p-8 space-y-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
          <div className="border-b pb-4 border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Sales Deals Pipeline Settings</h3>
            <p className="text-sm text-slate-500 mt-1">Configure Kanban stage rules, HTML5 drag-and-drop transitions, and closed-lost reasons.</p>
          </div>

          {!isAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <span>🔒 Deals pipeline configuration is read-only. Only Administrators have permission to modify settings.</span>
            </div>
          )}

          <fieldset disabled={!isAdmin} className="space-y-6 max-w-xl text-sm">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900">Allow HTML5 Drag & Drop Stage Transitions</p>
                <p className="text-xs text-slate-500 mt-0.5">Permits users to drag deal cards across stage columns.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600 rounded focus:ring-0 cursor-pointer border-slate-300 disabled:cursor-not-allowed" />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900">Require Reason when Marking Closed-Lost</p>
                <p className="text-xs text-slate-500 mt-0.5">Forces reps to input a loss reason code before moving deals to Closed-Lost.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600 rounded focus:ring-0 cursor-pointer border-slate-300 disabled:cursor-not-allowed" />
            </label>

            {isAdmin && (
              <button onClick={() => {}} className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5">
                Save Pipeline Settings
              </button>
            )}
          </fieldset>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 overflow-x-auto pb-4 items-start">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const stageTotal = stageDeals.reduce((acc, d) => acc + d.amount, 0);
            const isTarget = dragOverStage === stage;

            return (
              <div
                key={stage}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
                className={`rounded-[1.5rem] p-4 flex flex-col min-h-[500px] transition-all bg-slate-50/70 border border-slate-200 ${
                  isTarget ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-800 text-sm">{stage}</span>
                    <span className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-500">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-slate-500">
                    ${(stageTotal / 1000).toFixed(0)}k
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable={canEdit}
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className={`p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition-all duration-200 group cursor-grab active:cursor-grabbing ${
                        draggedDealId === deal.id ? 'opacity-50 scale-95 border-emerald-400 ring-2 ring-emerald-500/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {deal.title}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 mt-1">{deal.company}</p>
                        </div>
                        <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors shrink-0" />
                      </div>

                      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                        <span className="font-black text-slate-700">${deal.amount.toLocaleString()}</span>
                        <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold">
                          {deal.probability}% Prob
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs font-semibold text-slate-500">
                        <span className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{deal.owner}</span>
                        </span>

                        {stage !== 'Closed Won' && stage !== 'Closed Lost' && canEdit && (
                          <button
                            onClick={() => {
                              const nextIdx = STAGES.indexOf(stage) + 1;
                              if (nextIdx < STAGES.length) {
                                onUpdateDealStage(deal.id, STAGES[nextIdx]);
                              }
                            }}
                            className="bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-400 bg-white/50">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-md p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <Kanban className="w-6 h-6 text-emerald-600" />
              <span>Create Sales Deal</span>
            </h3>

            <form onSubmit={handleCreateDeal} className="space-y-4 text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise License Expansion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Company / Client</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CyberShield Inc"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Deal Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Pipeline Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as Deal['stage'])}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Deal Owner</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
