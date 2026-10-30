import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, FileText } from 'lucide-react';
import { FieldDefinition } from '@/components/DynamicRecordModal';

interface DynamicRecordFormScreenProps {
  title: string;
  fields: FieldDefinition[];
  initialValues?: Record<string, any>;
  onSubmit: (formData: Record<string, any>) => void;
  onCancel: () => void;
  isLight?: boolean;
}

export const DynamicRecordFormScreen: React.FC<DynamicRecordFormScreenProps> = ({
  title,
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      initial[field.name] = initialValues[field.name] ?? field.defaultValue ?? '';
    });
    setFormData(initial);
  }, [fields, initialValues]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  return (
    <div className="min-h-full flex flex-col">
      {/* Hero Header */}
      <div className="theme-hero-custom text-white px-6 sm:px-8 py-6">
        <div className="flex items-center space-x-4 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white transition shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 bg-white/20 rounded-xl border border-white/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-white truncate">{title}</h1>
              <p className="text-xs text-blue-100 mt-0.5">Fill out the required information to create or update this entry.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.type === 'textarea' ? 'sm:col-span-2 space-y-1.5' : 'space-y-1.5'}
                  >
                    <label className="text-xs font-bold block text-slate-700">
                      {field.label}{' '}
                      {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl outline-none transition ${inputClass}`}
                      >
                        <option value="">Select {field.label}...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl outline-none transition resize-none ${inputClass}`}
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
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl outline-none transition ${inputClass}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="flex items-center justify-end space-x-3 px-6 sm:px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-extrabold theme-btn-custom shadow-md flex items-center space-x-2 transition"
              >
                <Save className="w-3.5 h-3.5 text-white" />
                <span>Save Record</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

