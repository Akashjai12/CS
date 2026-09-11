import React, { useState } from 'react';
import { ScreenId, UserProfile, LoginSession } from '../../types';
import { DEFAULT_LOGIN_SESSIONS } from '../../data/mockData';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenLoginModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onNavigate,
  user,
  onUpdateUser,
  onOpenLoginModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'account' | 'memory' | 'models' | 'security' | 'notifications' | 'billing'>('all');
  const [hasChanges, setHasChanges] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Workspace preferences saved successfully');

  // User Profile Form State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [jobTitle, setJobTitle] = useState(user.jobTitle);
  const [organization, setOrganization] = useState(user.organization);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '+1 (415) 890-3412');
  const [timezone, setTimezone] = useState(user.timezone);
  const [sessions, setSessions] = useState<LoginSession[]>(DEFAULT_LOGIN_SESSIONS);
  const [copiedId, setCopiedId] = useState(false);

  // Sync state when user prop changes
  React.useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setUsername(user.username);
    setJobTitle(user.jobTitle);
    setOrganization(user.organization);
    setPhoneNumber(user.phoneNumber || '+1 (415) 890-3412');
    setTimezone(user.timezone);
  }, [user]);

  // Toggle states
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    crossProjectMemory: true,
    astIndexing: true,
    autoCompression: true,
    ephemeralScratchpad: false,
    dynamicCascading: true,
    multiModelConsensus: false,
    localFallback: true,
    zeroRetention: true, // locked
    envelopeEncryption: true,
    ephemeralScrubbing: true,
    quotaAlerts: true,
    driftWarnings: true,
    modelNotifications: false,
  });

  const handleToggle = (key: string) => {
    if (key === 'zeroRetention') return; // Enterprise locked
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleProfileFormChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedUser: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      username: username.trim() || user.username,
      jobTitle: jobTitle.trim() || user.jobTitle,
      organization: organization.trim() || user.organization,
      phoneNumber: phoneNumber.trim() || user.phoneNumber,
      timezone: timezone
    };
    onUpdateUser(updatedUser);
    setHasChanges(false);
    setToastMessage('Account profile and workspace settings updated!');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleDiscard = () => {
    setName(user.name);
    setEmail(user.email);
    setUsername(user.username);
    setJobTitle(user.jobTitle);
    setOrganization(user.organization);
    setPhoneNumber(user.phoneNumber || '+1 (415) 890-3412');
    setTimezone(user.timezone);
    setHasChanges(false);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setToastMessage('Session terminated and credentials revoked.');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleRevokeAllOther = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    setToastMessage('All other sessions signed out.');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleCopyAccountId = () => {
    navigator.clipboard?.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const tabs = [
    { id: 'all' as const, label: 'All Settings', icon: 'tune' },
    { id: 'account' as const, label: 'Account & Login', icon: 'manage_accounts' },
    { id: 'memory' as const, label: 'Context & Memory', icon: 'memory' },
    { id: 'models' as const, label: 'AI Models & Routing', icon: 'neurology' },
    { id: 'security' as const, label: 'Privacy & Security', icon: 'security' },
    { id: 'notifications' as const, label: 'Notifications & Alerts', icon: 'notifications' },
    { id: 'billing' as const, label: 'Billing & Plan', icon: 'credit_card' },
  ];

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'LJ';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 pb-28">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-1">
          <span>Configuration</span>
          <span>•</span>
          <span>Production Workspace</span>
          <span>&gt;</span>
          <span className="text-secondary font-semibold">Settings</span>
        </div>
        <h1 className="font-headline-xl text-on-surface tracking-tight">Settings &amp; Preferences</h1>
        <p className="text-on-surface-variant font-body-md mt-1">
          Configure global persistent memory policies, multi-model orchestration, and security compliance.
        </p>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Global Status Banner */}
      <div className="p-4 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">cloud_done</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-on-surface">Global Persistent Fabric Active</h2>
              <span className="px-2 py-0.5 rounded bg-primary text-on-primary text-[10px] font-bold">
                99.98% Synced
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              4.2M tokens indexed across 14 projects. Vector recall latency averaging 18ms.
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Context Fabric Re-indexing started across 14 projects.')}
          className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/30 transition-colors cursor-pointer"
        >
          Re-index Fabric
        </button>
      </div>

      {/* GROUP 0: Account Profile & Login Details */}
      {(activeTab === 'all' || activeTab === 'account') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">manage_accounts</span>
              <h2 className="font-headline-md text-on-surface">Account Profile &amp; Login Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-600">switch_account</span>
                <span>Switch / Re-authenticate</span>
              </button>
            </div>
          </div>

          {/* Account Overview Header Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xl flex items-center justify-center shadow-md">
                    {initials}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">{name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                      {user.plan} Plan
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <span className="material-symbols-outlined text-[15px] text-slate-400">mail</span>
                    <span>{email}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {jobTitle} • {organization}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                  <span className="text-[10px] text-slate-400 font-medium block">Account ID</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-xs font-mono text-slate-700 font-semibold">{user.id}</code>
                    <button
                      onClick={handleCopyAccountId}
                      className="text-slate-400 hover:text-blue-600 cursor-pointer"
                      title="Copy Account ID"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {copiedId ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                  <span className="text-[10px] text-slate-400 font-medium block">Primary Auth</span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    {user.ssoProvider}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Personal & Login Details Form */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Personal Information</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Update your identity details, primary email address, and workspace display metadata.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">
                    person
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      handleProfileFormChange();
                    }}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-colors"
                  />
                </div>
              </div>

              {/* Primary Email */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Primary Login Email
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Verified Primary
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleProfileFormChange();
                    }}
                    placeholder="e.g. jaiswallalchan16@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Workspace Username
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">
                    alternate_email
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      handleProfileFormChange();
                    }}
                    placeholder="username"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Job Title / Architectural Role
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">
                    badge
                  </span>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                      handleProfileFormChange();
                    }}
                    placeholder="e.g. Principal AI Systems Engineer"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-colors"
                  />
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Organization / Team
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">
                    corporate_fare
                  </span>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                      handleProfileFormChange();
                    }}
                    placeholder="e.g. Context AI Labs"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Security Contact Phone
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">
                    call
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      handleProfileFormChange();
                    }}
                    placeholder="+1 (415) 890-3412"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Timezone &amp; Locale
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">
                    schedule
                  </span>
                  <select
                    value={timezone}
                    onChange={(e) => {
                      setTimezone(e.target.value);
                      handleProfileFormChange();
                    }}
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-colors cursor-pointer"
                  >
                    <option value="America/Los_Angeles (UTC-07:00)">Pacific Time (US &amp; Canada) - UTC-07:00</option>
                    <option value="America/New_York (UTC-04:00)">Eastern Time (US &amp; Canada) - UTC-04:00</option>
                    <option value="Europe/London (UTC+01:00)">London, Dublin, Edinburgh - UTC+01:00</option>
                    <option value="Europe/Paris (UTC+02:00)">Paris, Berlin, Amsterdam - UTC+02:00</option>
                    <option value="Asia/Kolkata (UTC+05:30)">India Standard Time (IST) - UTC+05:30</option>
                    <option value="Asia/Tokyo (UTC+09:00)">Tokyo, Osaka, Seoul - UTC+09:00</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Reset Form
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Save Profile Details</span>
              </button>
            </div>
          </div>

          {/* Authentication & Security Credentials */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Login Credentials &amp; Single Sign-On</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Manage your identity providers, two-factor authentication, and connected authentication keys.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Google SSO */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-800">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google Workspace</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {email}
                  </p>
                </div>
                <button
                  onClick={onOpenLoginModal}
                  className="text-left text-xs text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                >
                  Re-authenticate &gt;
                </button>
              </div>

              {/* GitHub OAuth */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-800">
                      <svg className="w-4 h-4 fill-slate-800" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      <span>GitHub</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      Linked
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    @{username}
                  </p>
                </div>
                <button
                  onClick={() => alert(`GitHub account @${username} linked with repository permissions.`)}
                  className="text-left text-xs text-slate-700 font-semibold hover:text-slate-900 cursor-pointer"
                >
                  Manage Scopes &gt;
                </button>
              </div>

              {/* 2FA & Password */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-800">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">verified_user</span>
                      <span>Two-Factor Auth</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Passkey + Authenticator app enabled.
                  </p>
                </div>
                <button
                  onClick={() => alert('2FA backup codes:\n1. 4819-3321\n2. 9812-4412\n3. 7712-0041\n4. 8812-9931\nStore in a secure vault.')}
                  className="text-left text-xs text-slate-700 font-semibold hover:text-slate-900 cursor-pointer"
                >
                  View Backup Codes &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Active Login Sessions */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Active Login Sessions</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Devices that are currently authenticated into your Context Studio account.
                </p>
              </div>
              <button
                onClick={handleRevokeAllOther}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign Out Other Devices
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {sessions.map((sess) => (
                <div key={sess.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      sess.isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {sess.device.includes('iPhone') ? 'smartphone' : 'laptop_mac'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800">{sess.device}</p>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {sess.browser} • {sess.os} • <span className="font-mono">{sess.ipAddress}</span> ({sess.location})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-slate-400">
                      {sess.lastActive}
                    </span>
                    {!sess.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GROUP 1: Workspace & Persistent Memory */}
      {(activeTab === 'all' || activeTab === 'memory') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">memory</span>
            <h2 className="font-headline-md text-on-surface">Workspace &amp; Persistent Memory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Toggle 1 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Global Cross-Project Memory Fabric</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Allows models to recall architectural patterns and design decisions from previous workspaces automatically.
                </p>
              </div>
              <button
                onClick={() => handleToggle('crossProjectMemory')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.crossProjectMemory ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.crossProjectMemory ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Semantic AST Codebase Indexing</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Extracts function signatures and dependency graphs from linked Git repositories for high-precision coding.
                </p>
              </div>
              <button
                onClick={() => handleToggle('astIndexing')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.astIndexing ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.astIndexing ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Context Auto-Compression &amp; Pruning</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Intelligently condenses old message histories while preserving critical milestones to save token costs.
                </p>
              </div>
              <button
                onClick={() => handleToggle('autoCompression')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.autoCompression ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.autoCompression ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Ephemeral Scratchpad Mode</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Disables all memory retention for rapid testing. Chats are completely purged upon closing the tab.
                </p>
              </div>
              <button
                onClick={() => handleToggle('ephemeralScratchpad')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.ephemeralScratchpad ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.ephemeralScratchpad ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* GROUP 2: AI Models & Routing */}
      {(activeTab === 'all' || activeTab === 'models') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">neurology</span>
              <h2 className="font-headline-md text-on-surface">AI Models &amp; Routing</h2>
            </div>
            <button
              onClick={() => onNavigate('credentials')}
              className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage API Tokens &amp; Providers</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Toggle 1 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Dynamic Model Cascading</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Routes simple prompts to fast low-latency models and automatically escalates complex tasks to reasoning engines.
                </p>
              </div>
              <button
                onClick={() => handleToggle('dynamicCascading')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.dynamicCascading ? 'bg-secondary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.dynamicCascading ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Parallel Multi-Model Consensus</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Queries GPT-4o, Claude 3.5, and Gemini simultaneously and synthesizes an agreed-upon response.
                </p>
              </div>
              <button
                onClick={() => handleToggle('multiModelConsensus')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.multiModelConsensus ? 'bg-secondary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.multiModelConsensus ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Local Model Fallback (Ollama/vLLM)</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Falls back seamlessly to private local edge nodes if external API endpoints experience downtime or latency spikes.
                </p>
              </div>
              <button
                onClick={() => handleToggle('localFallback')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.localFallback ? 'bg-secondary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.localFallback ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Quick Link Card to Credentials */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="p-5 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed/50 shadow-xs flex items-center justify-between cursor-pointer hover:bg-secondary-fixed/30 transition-colors"
            >
              <div>
                <h3 className="text-sm font-bold text-on-secondary-fixed">API Connection Credentials</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  6 tokens active (OpenAI, Anthropic, Google Vertex, Ollama)
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">key</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GROUP 3: Privacy, Isolation & Security */}
      {(activeTab === 'all' || activeTab === 'security') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[22px]">security</span>
              <h2 className="font-headline-md text-on-surface">Privacy, Isolation &amp; Security</h2>
            </div>
            <button
              onClick={() => onNavigate('audit-logs')}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Audit Logs &amp; Activity Stream</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Locked Enterprise Toggle */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-on-surface">Zero Data Retention Enterprise Guarantee</h3>
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider">
                    Enforced
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  No model provider trains on prompts, embeddings, or context inputs originating from your organization.
                </p>
              </div>
              <div className="w-11 h-6 rounded-full bg-primary/70 relative shrink-0 cursor-not-allowed" title="Enterprise policy locked">
                <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1" />
              </div>
            </div>

            {/* Toggle 2 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Hardware-Backed Envelope Encryption</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Context vectors are encrypted with customer-managed AES-256 GCM keys in secure enclave memory.
                </p>
              </div>
              <button
                onClick={() => handleToggle('envelopeEncryption')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.envelopeEncryption ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.envelopeEncryption ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Ephemeral Key Scrubbing</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Auto-purges temporary connection credentials from worker memory immediately after TLS handshakes.
                </p>
              </div>
              <button
                onClick={() => handleToggle('ephemeralScrubbing')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.ephemeralScrubbing ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.ephemeralScrubbing ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Data Export Action Box */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Export Workspace Data</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Download all project vectors, prompts, and memory logs.
                </p>
              </div>
              <button
                onClick={() => alert('Data Export Prepared: archive_workspace_2024.zip')}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 transition-colors cursor-pointer"
              >
                Export JSON
              </button>
            </div>
          </div>
        </section>
      )}

      {/* GROUP 4: Notifications & Alerts */}
      {(activeTab === 'all' || activeTab === 'notifications') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[22px]">notifications</span>
            <h2 className="font-headline-md text-on-surface">Notifications &amp; Alerts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Token Quota Exceeded Alerts</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Receive email and in-app alerts when project compute reaches 80% and 95% of monthly allowance.
                </p>
              </div>
              <button
                onClick={() => handleToggle('quotaAlerts')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.quotaAlerts ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.quotaAlerts ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Context Drift &amp; Staleness Warnings</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Notifies you when indexed documentation or repository branches have diverged by &gt; 15 commits.
                </p>
              </div>
              <button
                onClick={() => handleToggle('driftWarnings')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  toggles.driftWarnings ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    toggles.driftWarnings ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Toast Confirmation */}
      {savedToast && (
        <div className="fixed top-20 right-8 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-16 left-64 right-0 p-4 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 shadow-xl flex items-center justify-between z-40 animate-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>You have unsaved configuration changes</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
