import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string | number;
}

interface DynamicRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldDefinition[];
  initialValues?: Record<string, any>;
  onSubmit: (formData: Record<string, any>) => void;
  isLight?: boolean;
}

export const DynamicRecordModal: React.FC<DynamicRecordModalProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  initialValues = {},
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, any> = {};
      fields.forEach((field) => {
        initial[field.name] = initialValues[field.name] ?? field.defaultValue ?? '';
      });
      setFormData(initial);
    }
  }, [isOpen, fields, initialValues]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition duration-300 bg-white border border-slate-200 text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-lg font-extrabold flex items-center space-x-2 text-slate-900">
            <Plus className="w-5 h-5 theme-svg-custom" />
            <span>{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === 'textarea' ? 'sm:col-span-2 space-y-1' : 'space-y-1'}
              >
                <label className="font-bold block text-slate-700">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">Select {field.label}...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        field.type === 'number' ? Number(e.target.value) : e.target.value
                      )
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold theme-btn-custom shadow-md flex items-center space-x-1.5 transition"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
