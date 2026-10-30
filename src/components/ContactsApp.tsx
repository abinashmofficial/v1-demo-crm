'use client';

import React, { useState } from 'react';
import { Contact, ThemeMode } from '@/types/crm';
import { Mail, Phone, Smile, Frown, Users, Plus, MessageSquare, Search } from 'lucide-react';

interface ContactsAppProps {
  contacts: Contact[];
  themeMode?: ThemeMode;
}

export const ContactsApp: React.FC<ContactsAppProps> = ({ contacts }) => {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden p-6 sm:p-8 shadow-xl transition duration-300 theme-hero-custom text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/20 text-white border-white/30">
              <Users className="w-3.5 h-3.5" />
              <span>Omni-Channel Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm text-white">
              Omni-Channel Contacts
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Unified contact profiles with cross-channel sentiment tracking.
            </p>
          </div>

          <button className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xl transition self-start sm:self-auto">
            <Plus className="w-4 h-4 text-cyan-600" />
            <span>Add New Contact</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl flex items-center justify-between gap-4 theme-card-custom shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts, company or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none"
          />
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl theme-span-custom">
          {filtered.length} Unified Profiles
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl p-5 sm:p-6 space-y-4 transition shadow-sm hover:shadow-md theme-card-custom"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl theme-btn-custom font-extrabold flex items-center justify-center text-sm shadow-md">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">{c.name}</h3>
                  <p className="text-xs opacity-70 font-medium">{c.role} • {c.company}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1 theme-span-custom">
                {c.sentiment === 'Positive' ? <Smile className="w-3.5 h-3.5 theme-svg-custom" /> : <Frown className="w-3.5 h-3.5 theme-svg-custom" />}
                <span>{c.sentiment}</span>
              </span>
            </div>

            <div className="space-y-2 text-xs opacity-80 pt-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 theme-svg-custom" />
                <span className="font-medium">{c.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 theme-svg-custom" />
                <span className="font-mono">{c.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 text-[11px]">
              <span className="flex items-center space-x-1 font-semibold opacity-70">
                <MessageSquare className="w-3 h-3 theme-svg-custom" />
                <span>{c.channel}</span>
              </span>
              <span className="opacity-60 font-mono text-[10px]">Active {c.lastInteraction}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
