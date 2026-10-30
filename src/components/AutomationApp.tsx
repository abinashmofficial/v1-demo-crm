'use client';

import React from 'react';
import { WorkflowRule, ThemeMode } from '@/types/crm';
import { Zap, Play, Pause, ArrowRight, Cpu, Plus } from 'lucide-react';

interface AutomationAppProps {
  workflows: WorkflowRule[];
  onToggleStatus: (id: string) => void;
  themeMode?: ThemeMode;
}

export const AutomationApp: React.FC<AutomationAppProps> = ({ workflows, onToggleStatus }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden p-6 sm:p-8 shadow-xl transition duration-300 theme-hero-custom text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/20 text-white border-white/30">
              <Zap className="w-3.5 h-3.5" />
              <span>Event Execution Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm text-white">
              Workflow Automation Canvas
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Visual triggers & multi-step execution flows across your CRM workspace.
            </p>
          </div>

          <button className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xl transition self-start sm:self-auto">
            <Plus className="w-4 h-4 text-amber-600" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition shadow-sm hover:shadow-md theme-card-custom"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl theme-span-custom">
                  <Cpu className="w-4 h-4 theme-svg-custom" />
                </span>
                <h3 className="text-base font-bold">{wf.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold theme-span-custom">
                  {wf.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs p-3 rounded-xl theme-span-custom">
                <span className="font-bold">{wf.trigger}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                <span className="font-bold">{wf.action}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-4 md:pt-0 md:pl-6">
              <div className="text-left">
                <p className="text-[10px] opacity-70 uppercase tracking-wider font-semibold">Executions</p>
                <p className="text-lg font-bold font-mono">{wf.executions.toLocaleString()}</p>
              </div>

              <button
                onClick={() => onToggleStatus(wf.id)}
                className="p-3 rounded-xl transition theme-btn-custom shadow-md"
              >
                {wf.status === 'Active' ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
