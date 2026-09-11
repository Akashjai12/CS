import React, { useRef, useEffect } from 'react';
import { UserProfile, ScreenId } from '../../types';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onOpenLoginModal: () => void;
  onSignOut: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
  user,
  onNavigate,
  onOpenLoginModal,
  onSignOut
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
    >
      {/* User Card Header */}
      <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="relative">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20 shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'LJ'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-900 truncate">{user.name}</h3>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                {user.plan}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono truncate">{user.email}</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.role}</p>
          </div>
        </div>

        {/* Auth Provider & Status Pill */}
        <div className="mt-3.5 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium">{user.ssoProvider}</span>
          </div>
          <span className="text-slate-400 font-mono text-[10px]">ID: {user.id.slice(0, 14)}...</span>
        </div>
      </div>

      {/* Security & Login Details Section */}
      <div className="px-4 py-3 bg-slate-50/60 border-b border-slate-100 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-slate-400">login</span>
            <span>Last Login:</span>
          </span>
          <span className="font-medium text-slate-800">{user.lastLogin}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-slate-400">shield</span>
            <span>Security:</span>
          </span>
          <span className="font-medium text-emerald-700">2FA Verified</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-slate-400">public</span>
            <span>IP Location:</span>
          </span>
          <span className="font-mono text-slate-600 text-[10px]">{user.lastLoginIp}</span>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="p-2 space-y-1">
        <button
          onClick={() => {
            onNavigate('settings');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-slate-400">badge</span>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Account &amp; Profile</p>
            <p className="text-[10px] text-slate-400">Edit name, email, credentials</p>
          </div>
        </button>

        <button
          onClick={() => {
            onNavigate('credentials');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-slate-400">key</span>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">API Credentials</p>
            <p className="text-[10px] text-slate-400">Manage provider tokens &amp; keys</p>
          </div>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenLoginModal();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-blue-600">switch_account</span>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Switch / Re-authenticate</p>
            <p className="text-[10px] text-slate-400">Sign in with different email or Google</p>
          </div>
        </button>

        <div className="pt-1 mt-1 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
