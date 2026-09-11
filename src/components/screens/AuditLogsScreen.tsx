import React, { useState } from 'react';
import { ScreenId, AuditEvent } from '../../types';
import { INITIAL_AUDIT_EVENTS } from '../../data/mockData';

interface AuditLogsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AuditLogsScreen: React.FC<AuditLogsScreenProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [liveFeed, setLiveFeed] = useState(true);
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});

  const togglePayload = (id: string) => {
    setExpandedPayloads(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'created', label: 'Key Created' },
    { id: 'invocation', label: 'Invocations' },
    { id: 'rotated', label: 'Rotated' },
    { id: 'revoked', label: 'Revoked' },
    { id: 'security', label: 'Sanitization' },
  ];

  const filteredEvents = events.filter(evt => {
    if (activeCategory === 'created' && evt.badgeType !== 'created') return false;
    if (activeCategory === 'invocation' && evt.badgeType !== 'success') return false;
    if (activeCategory === 'rotated' && evt.badgeType !== 'rotated') return false;
    if (activeCategory === 'revoked' && evt.badgeType !== 'error') return false;
    if (activeCategory === 'security' && evt.badgeType !== 'purple') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.actor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getBadgeStyle = (type: AuditEvent['badgeType']) => {
    switch (type) {
      case 'error':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rotated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'created':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 pb-20">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-1">
            <span>Configuration</span>
            <span>•</span>
            <span>Production Workspace</span>
            <span>&gt;</span>
            <span 
              onClick={() => onNavigate('settings')} 
              className="hover:underline cursor-pointer"
            >
              Settings
            </span>
            <span>&gt;</span>
            <span 
              onClick={() => onNavigate('credentials')} 
              className="hover:underline cursor-pointer"
            >
              API Credentials
            </span>
            <span>&gt;</span>
            <span className="text-secondary font-semibold">Activity Stream</span>
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">
            API Token &amp; Credential Activity Stream
          </h1>
          <p className="text-on-surface-variant font-body-md mt-1">
            Real-time cryptographically verified audit trail for key generation, usage bursts, rotations, and revocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('credentials')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            <span>Credentials Overview</span>
          </button>

          <button
            onClick={() => alert('Exporting audit log: context_audit_log_2024.json')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV / JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Rotate Master Encryption Secret? This will re-envelope all credentials.')) {
                alert('Master Secret rotated with zero downtime. SHA-256 re-keyed.');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">enhanced_encryption</span>
            <span>Rotate Master Secret</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Total Events</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">timeline</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-on-surface">14,892</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-primary font-medium">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>+412 today • Real-time telemetry</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Active Token Handshakes</span>
            <span className="material-symbols-outlined text-primary text-[20px]">handshake</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-on-surface">6 Providers</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-on-surface-variant font-medium">
            <span>Avg latency: 18ms • Zero errors</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Security Flags</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified_user</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600">0 Incidents</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Zero-retention enforced • SOC-2 valid</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Last Key Revocation</span>
            <span className="material-symbols-outlined text-rose-600 text-[20px]">key_off</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-on-surface">4 days ago</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-on-surface-variant font-medium">
            <span>Manual admin purge • SHA-256 verified</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 w-full md:w-96 bg-surface-container-low px-3.5 py-2 rounded-xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, actors, IPs, or key hashes..."
            className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Live Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface outline-none cursor-pointer"
          >
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={() => setLiveFeed(!liveFeed)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              liveFeed
                ? 'bg-primary-container/20 border-primary text-primary'
                : 'bg-surface-container border-outline-variant text-on-surface-variant'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${liveFeed ? 'bg-primary animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{liveFeed ? 'Live Feed ON' : 'Feed Paused'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline Events List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => {
          const isExpanded = expandedPayloads[evt.id];

          return (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-outline-variant/60 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">{evt.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-on-surface">{evt.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(evt.badgeType)}`}>
                        {evt.badgeText}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        • {evt.category}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-xs text-on-surface-variant font-mono sm:text-right">
                  {evt.timestamp}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed pl-12">
                {evt.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant pl-12">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    <span>{evt.actor}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">public</span>
                    <span>{evt.ip}</span>
                  </span>
                  <span className="flex items-center gap-1 font-medium text-secondary">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>{evt.scope}</span>
                  </span>
                </div>

                <button
                  onClick={() => togglePayload(evt.id)}
                  className="flex items-center gap-1 text-secondary font-bold hover:underline cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Payload' : 'View Payload (JSON)'}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>

              {/* Expandable JSON Payload */}
              {isExpanded && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto border border-slate-700 animate-in fade-in duration-150">
                  <pre className="no-scrollbar">{JSON.stringify(evt.payload, null, 2)}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant">
        <span>Showing 1–{filteredEvents.length} of 14,892 verified security log events</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface font-semibold hover:bg-surface-container transition-colors disabled:opacity-50">
            Previous
          </button>
          <span className="px-2 font-mono">1 / 2,482</span>
          <button className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface font-semibold hover:bg-surface-container transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
