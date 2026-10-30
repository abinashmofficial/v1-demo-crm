'use client';

import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, Cpu } from 'lucide-react';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello Alex! I am your Open-CRM AI Assistant. How can I help optimize your sales pipeline today? Ask me to score leads, write follow-up emails, or analyze deal risks.",
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // AI intelligent mock response
    setTimeout(() => {
      let reply = "I've analyzed your request across Open-CRM. ";
      if (userText.toLowerCase().includes('lead') || userText.toLowerCase().includes('score')) {
        reply += "Lead Sarah Jenkins has an AI intent score of 94/100 (High Win Probability). Recommended action: Send Enterprise proposal draft immediately.";
      } else if (userText.toLowerCase().includes('deal') || userText.toLowerCase().includes('pipeline')) {
        reply += "Your current pipeline total stands at $278,000 across 4 active stages. You have 2 high-value deals in Negotiation stage ($205,000 value).";
      } else {
        reply += "I can automate this action for you in the Workflow Canvas or update your Contacts database automatically.";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[520px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Open-CRM AI Copilot</h3>
              <p className="text-[10px] text-slate-500 font-medium">Sales Intelligence & Workflow Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/30">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                m.sender === 'ai' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}>
                {m.sender === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed shadow-2xs ${
                m.sender === 'ai'
                  ? 'bg-white text-slate-800 border border-slate-200'
                  : 'bg-indigo-600 text-white font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask AI Copilot something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
