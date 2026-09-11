import React, { useState } from 'react';
import { ScreenId } from '../types';

interface ViewSwitcherProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenNewProject: () => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentScreen,
  onNavigate,
  onOpenNewProject
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const screens: { id: ScreenId | 'modal-trigger'; label: string; icon: string; tag?: string }[] = [
    { id: 'landing', label: '1. Landing Page', icon: 'web' },
    { id: 'dashboard', label: '2. Dashboard', icon: 'dashboard' },
    { id: 'settings', label: '3. Settings', icon: 'settings' },
    { id: 'credentials', label: '4. API Credentials', icon: 'key' },
    { id: 'audit-logs', label: '5. Activity Stream', icon: 'timeline' },
    { id: 'modal-trigger', label: '6. New Project Wizard', icon: 'add_circle', tag: 'Modal' },
    { id: 'project-workspace', label: '7. E-commerce Workspace', icon: 'chat', tag: 'Live Chat' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
      <div className="bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-1.5 text-xs font-medium">
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-300">Screen Navigator</span>
        </div>

        {!collapsed && (
          <div className="flex items-center gap-1 overflow-x-auto max-w-[85vw] sm:max-w-none">
            {screens.map((s) => {
              const isSelected = s.id === currentScreen;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (s.id === 'modal-trigger') {
                      onOpenNewProject();
                    } else {
                      onNavigate(s.id as ScreenId);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
                  <span>{s.label}</span>
                  {s.tag && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-700 text-slate-200">
                      {s.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          title={collapsed ? "Expand Screen Navigator" : "Collapse Navigator"}
        >
          <span className="material-symbols-outlined text-[16px]">
            {collapsed ? 'unfold_more' : 'unfold_less'}
          </span>
        </button>
      </div>
    </div>
  );
};
