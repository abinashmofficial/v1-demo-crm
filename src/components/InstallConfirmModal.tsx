'use client';

import React from 'react';
import { AppDefinition } from '@/types/crm';
import { Download, AlertCircle, X, Sparkles } from 'lucide-react';

interface InstallConfirmModalProps {
  isOpen: boolean;
  app: AppDefinition | null;
  canInstall: boolean;
  onConfirm: (withDemoData: boolean) => void;
  onClose: () => void;
  isLight?: boolean;
}

export const InstallConfirmModal: React.FC<InstallConfirmModalProps> = ({
  isOpen,
  app,
  canInstall,
  onConfirm,
  onClose,
}) => {
  const [includeDemoData, setIncludeDemoData] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  if (!isOpen || !app) return null;

  const handleStartInstall = () => {
    setIsLoading(true);
    setTimeout(() => {
      onConfirm(includeDemoData);
      setIsLoading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl transition duration-200 border bg-white border-slate-200 text-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            {canInstall ? (
              <Download className="w-5 h-5 text-blue-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            <h3 className="text-base font-extrabold text-slate-900">
              {canInstall ? 'Install Workspace App' : 'Permission Required'}
            </h3>
          </div>
          <button
            disabled={isLoading}
            onClick={onClose}
            className="opacity-70 hover:opacity-100 p-1 disabled:opacity-30 text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-center py-2 relative">
          {isLoading ? (
            <div className="py-4 space-y-4 animate-fade-in">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-500 animate-spin flex items-center justify-center" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}>
                </div>
                <Sparkles className="w-6 h-6 text-cyan-500 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Installing "{app.name}"...
                </h4>
                <p className="text-[11px] font-semibold text-slate-600">
                  Provisioning module schema & dataset tables...
                </p>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full animate-pulse w-full transition-all duration-1000" />
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center font-extrabold text-lg bg-blue-100 text-blue-700">
                {app.name[0]}
              </div>
              <h4 className="text-base font-extrabold text-slate-900">{app.name}</h4>
              <p className="text-xs font-semibold leading-relaxed text-slate-700">
                {canInstall
                  ? `Would you like to install "${app.name}" into your company workspace launcher?`
                  : `"${app.name}" requires Admin or Manager permission to install.`}
              </p>

              {canInstall && (
                <div className="pt-2 text-left p-3.5 rounded-xl border bg-slate-50 border-slate-300">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-extrabold">
                    <input
                      type="checkbox"
                      disabled={isLoading}
                      checked={includeDemoData}
                      onChange={(e) => setIncludeDemoData(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer disabled:opacity-50"
                    />
                    <span className="font-extrabold text-slate-900">Include Pre-Populated Demo Data</span>
                  </label>
                  <p className="text-[11px] font-medium mt-1 pl-6 text-slate-600">
                    Uncheck this box to start with an empty table dataset.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-extrabold transition disabled:opacity-50 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          {canInstall && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleStartInstall}
              className="px-5 py-2 rounded-xl text-xs font-extrabold theme-btn-custom shadow-md flex items-center space-x-2 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deploying Module...</span>
                </>
              ) : (
                <span>Install App</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
