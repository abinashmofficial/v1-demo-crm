'use client';

import React, { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ThemeMode } from '@/types/crm';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 42000, forecast: 40000 },
  { month: 'Feb', revenue: 58000, forecast: 52000 },
  { month: 'Mar', revenue: 75000, forecast: 70000 },
  { month: 'Apr', revenue: 64000, forecast: 68000 },
  { month: 'May', revenue: 92000, forecast: 85000 },
  { month: 'Jun', revenue: 115000, forecast: 105000 },
  { month: 'Jul', revenue: 130000, forecast: 125000 },
  { month: 'Aug', revenue: 168000, forecast: 150000 },
];

interface AnalyticsAppProps {
  themeMode?: ThemeMode;
}

export const AnalyticsApp: React.FC<AnalyticsAppProps> = () => {
  const [chartColor, setChartColor] = useState('#4f46e5');
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    const updateChartTheme = () => {
      const el = document.querySelector('.theme-svg-custom');
      if (el) {
        const computed = window.getComputedStyle(el).color;
        if (computed) {
          setChartColor(computed);
          setChartKey((prev) => prev + 1);
        }
      }
    };

    updateChartTheme();

    const observer = new MutationObserver(() => {
      updateChartTheme();
    });

    const rootDiv = document.querySelector('div[class*="theme-"]');
    if (rootDiv) {
      observer.observe(rootDiv, { attributes: true, attributeFilter: ['class'] });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden p-6 sm:p-8 shadow-xl transition duration-300 theme-hero-custom text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/20 text-white border-white/30">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>ARR Forecasting Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm text-white">
              Revenue Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Predictive ARR velocity, quarterly revenue projections, and win rate analysis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
          <p className="text-xs font-bold text-slate-500">Annual Recurring Revenue (ARR)</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">$1.84M</p>
          <p className="text-xs text-emerald-600 flex items-center space-x-1 font-extrabold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.5% vs last quarter</span>
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
          <p className="text-xs font-bold text-slate-500">Average Deal Size</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">$46,500</p>
          <p className="text-xs text-emerald-600 flex items-center space-x-1 font-extrabold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.1% expansion</span>
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
          <p className="text-xs font-bold text-slate-500">Win Rate Ratio</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">68.4%</p>
          <p className="text-xs theme-svg-custom font-extrabold">Top 5% Industry Benchmark</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
          <p className="text-xs font-bold text-slate-500">Sales Cycle Duration</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">18 Days</p>
          <p className="text-xs theme-svg-custom font-extrabold">Accelerated via AI Engine</p>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm theme-card-custom">
        <h3 className="text-base font-extrabold text-slate-900">Actual Revenue vs AI Forecast ($)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart key={chartKey} data={REVENUE_DATA}>
              <defs>
                <linearGradient id={`colorRev-${chartKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
              />
              <Area type="monotone" dataKey="revenue" stroke={chartColor} strokeWidth={3} fillOpacity={1} fill={`url(#colorRev-${chartKey})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
