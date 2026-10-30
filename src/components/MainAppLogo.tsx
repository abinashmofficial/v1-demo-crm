import React from 'react';

interface MainAppLogoProps {
  isLight?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const MainAppLogo: React.FC<MainAppLogoProps> = ({
  isLight = true,
  size = 'md',
  showSubtitle = true,
  onClick,
}) => {
  const dim = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  return (
    <div
      onClick={onClick}
      title="OPEN ERP"
      className={`inline-flex items-center gap-2.5 select-none transition-transform active:scale-95 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Modern Gradient Icon Tile */}
      <div 
        className="relative flex items-center justify-center rounded-xl shadow-md overflow-hidden bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px]"
        style={{ width: dim, height: dim }}
      >
        <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
          
          <svg
            width={size === 'sm' ? 18 : size === 'lg' ? 24 : 20}
            height={size === 'sm' ? 18 : size === 'lg' ? 24 : 20}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 text-white"
          >
            <rect x="2" y="2" width="8" height="8" rx="2.5" fill="currentColor" fillOpacity="0.9" />
            <rect x="14" y="2" width="8" height="8" rx="2.5" fill="#38bdf8" fillOpacity="0.9" />
            <rect x="2" y="14" width="8" height="8" rx="2.5" fill="#818cf8" fillOpacity="0.8" />
            <rect x="14" y="14" width="8" height="8" rx="2.5" fill="#a78bfa" fillOpacity="0.9" />
          </svg>

          {/* Active status pulse */}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
        </div>
      </div>

      {showSubtitle && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight leading-none text-slate-900 ${
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg'
              }`}
            >
              OPEN <span className="text-indigo-600 font-extrabold">ERP</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              SaaS
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase mt-0.5">
            Enterprise Engine
          </span>
        </div>
      )}
    </div>
  );
};

