import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id?: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = message.type === 'success';

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-extrabold flex items-center space-x-3 transition-all animate-bounce ${
        isSuccess
          ? 'bg-emerald-600 border-emerald-400 text-white'
          : message.type === 'error'
          ? 'bg-rose-600 border-rose-400 text-white'
          : 'bg-cyan-600 border-cyan-400 text-white'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 text-white" />
      ) : (
        <AlertCircle className="w-4 h-4 text-white" />
      )}
      <span>{message.text}</span>
      <button onClick={onClose} className="p-1 hover:opacity-75 transition">
        <X className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
};
