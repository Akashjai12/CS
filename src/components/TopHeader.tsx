import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import { UserProfileDropdown } from './auth/UserProfileDropdown';

interface TopHeaderProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenQuickSearch?: () => void;
  user: UserProfile;
  onOpenLoginModal: () => void;
  onSignOut: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  onNavigate, 
  onOpenQuickSearch,
  user,
  onOpenLoginModal,
  onSignOut
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'LJ';

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-slate-100">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-80 md:w-96">
        <div 
          onClick={onOpenQuickSearch}
          className="flex items-center gap-2 w-full bg-surface-container-low px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-[13px] text-on-surface placeholder:text-on-surface-variant w-full cursor-pointer"
            placeholder="Search context, models, prompts..."
            type="text"
            readOnly
          />
          <kbd className="hidden sm:inline-block text-[10px] font-semibold text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Action Icons & Profile */}
      <div className="flex items-center gap-3">
        {/* Switch back to Landing page pill */}
        <button
          onClick={() => onNavigate('landing')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-container text-slate-700 hover:bg-slate-200 transition-colors"
          title="Go to Public Landing Page"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
          <span>View Public Page</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-900">
                <span>Notifications (3 unread)</span>
                <span className="text-[11px] text-blue-600 cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-slate-100 mt-1">
                <div className="py-2">
                  <p className="font-medium text-slate-800">Claude 3.5 generated PRD</p>
                  <span className="text-[10px] text-slate-400">12m ago in E-commerce Platform</span>
                </div>
                <div className="py-2">
                  <p className="font-medium text-slate-800">API Key Rotation Warning</p>
                  <span className="text-[10px] text-amber-600">Meta Llama gateway expires in 3 days</span>
                </div>
                <div className="py-2">
                  <p className="font-medium text-slate-800">Context Memory Synced</p>
                  <span className="text-[10px] text-emerald-600">4.2M tokens active across 4 models</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          onClick={() => alert('Context Studio Documentation & Support\n\nVersion: 3.4.1\nEngine Status: 99.99% Uptime\nLatency: 18ms')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          title="Help & Documentation"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        {/* Profile Avatar & Interactive Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer group"
            title="Account & Login Details"
          >
            {user.avatarUrl ? (
              <img
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-500 transition-all"
                src={user.avatarUrl}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {initials}
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {user.email.length > 20 ? `${user.email.slice(0, 18)}...` : user.email}
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-600">
              arrow_drop_down
            </span>
          </button>

          <UserProfileDropdown
            isOpen={showProfileMenu}
            onClose={() => setShowProfileMenu(false)}
            user={user}
            onNavigate={onNavigate}
            onOpenLoginModal={onOpenLoginModal}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
};

