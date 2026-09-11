import React from 'react';
import { ScreenId, UserProfile } from '../types';
import { ContextLogo } from './ContextLogo';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  user: UserProfile;
  onOpenLoginModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentScreen, 
  onNavigate,
  user,
  onOpenLoginModal
}) => {
  const navItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { id: 'project-workspace', label: 'Projects', icon: 'folder_open' },
    { id: 'credentials', label: 'Models', icon: 'neurology' },
    { id: 'audit-logs', label: 'Library', icon: 'dataset' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'landing', label: 'Docs', icon: 'description' },
  ];

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'LJ';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between border-r border-slate-100">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('landing')}
          className="h-16 flex items-center gap-2.5 px-5 cursor-pointer border-b border-transparent hover:bg-surface-container-low/40 transition-colors"
          title="Go to Public Landing Page"
        >
          <ContextLogo size={32} className="shadow-xs" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-[16px] text-on-surface tracking-tight">Context Studio</span>
            <span className="font-label-eyebrow text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">Workspace</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1 px-2 mt-4">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id || 
              (item.id === 'settings' && (currentScreen === 'credentials' || currentScreen === 'audit-logs')) ||
              (item.id === 'project-workspace' && currentScreen === 'project-workspace');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-[13px] transition-colors w-full text-left font-medium ${
                  isActive
                    ? 'bg-surface-container text-secondary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card & Login Details */}
      <div className="p-2.5 m-2 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
        <div 
          onClick={() => onNavigate('settings')}
          className="flex items-center justify-between cursor-pointer group"
          title="Manage Account Settings"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-500 transition-all shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {initials}
              </div>
            )}
            <div className="flex flex-col text-left leading-none min-w-0">
              <span className="text-[13px] font-semibold text-on-surface group-hover:text-blue-600 transition-colors truncate">
                {user.name}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5 font-mono truncate">
                {user.email}
              </span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider shrink-0">
            {user.plan}
          </span>
        </div>

        {/* Quick Auth Info & Switcher Button */}
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="truncate">{user.ssoProvider}</span>
          </span>
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer shrink-0 transition-colors"
            >
              Switch
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

