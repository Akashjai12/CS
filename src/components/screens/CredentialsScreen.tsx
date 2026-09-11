import React, { useState } from 'react';
import { ScreenId, CredentialItem } from '../../types';
import { INITIAL_CREDENTIALS } from '../../data/mockData';
import { ModelLogo } from '../ModelLogo';

interface CredentialsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CredentialsScreen: React.FC<CredentialsScreenProps> = ({ onNavigate }) => {
  const [credentials, setCredentials] = useState<CredentialItem[]>(INITIAL_CREDENTIALS);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'providers' | 'tokens' | 'webhooks'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Credential Form State
  const [newProvider, setNewProvider] = useState<
    'OpenAI' | 'Anthropic' | 'Google Vertex' | 'DeepSeek' | 'Mistral AI' | 'Groq' | 'Meta Llama' | 'Cohere' | 'Custom Token'
  >('OpenAI');
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newPermissions, setNewPermissions] = useState('Inference & Memory Graph');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (keyText: string, name: string) => {
    navigator.clipboard?.writeText(keyText);
    showToast(`Copied secret for "${name}" to clipboard`);
  };

  const handleRotate = (id: string, name: string) => {
    const confirmRotate = window.confirm(`Are you sure you want to rotate "${name}"? A new key version will be deployed across active edge workers.`);
    if (!confirmRotate) return;

    setCredentials(prev => prev.map(c => {
      if (c.id === id) {
        const randHex = Math.random().toString(36).substring(2, 6).toUpperCase();
        return {
          ...c,
          keySuffix: randHex,
          realKey: `${c.keyPrefix}rotated_${Date.now()}_${randHex}`,
          status: 'Active',
          statusBadge: 'Active',
          lastUsed: 'Just rotated'
        };
      }
      return c;
    }));
    showToast(`Key rotated successfully for "${name}"`);
  };

  const handleRevoke = (id: string, name: string) => {
    const confirmRevoke = window.confirm(`REVOCATION WARNING: Revoking "${name}" will terminate ongoing model calls immediately. Continue?`);
    if (!confirmRevoke) return;

    setCredentials(prev => prev.filter(c => c.id !== id));
    showToast(`Credential "${name}" revoked and purged from memory`);
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newKey.trim()) {
      alert('Please provide a credential name and secret key.');
      return;
    }

    const prefix = newProvider === 'OpenAI' ? 'sk-proj-' : newProvider === 'Anthropic' ? 'sk-ant-' : 'key_';
    const suffix = newKey.slice(-4) || '88aZ';

    const newItem: CredentialItem = {
      id: `cred-${Date.now()}`,
      name: newName,
      provider: newProvider,
      type: `${newProvider} Dedicated API`,
      status: 'Active',
      statusBadge: 'Active',
      permissions: newPermissions,
      keyPrefix: prefix,
      keySuffix: suffix,
      realKey: newKey,
      createdAt: 'Just now',
      lastUsed: 'Never used'
    };

    setCredentials([newItem, ...credentials]);
    setShowAddModal(false);
    setNewName('');
    setNewKey('');
    showToast(`Added new credential: "${newItem.name}"`);
  };

  const filteredCredentials = credentials.filter(c => {
    if (activeTab === 'all') return true;
    if (activeTab === 'providers') return ['OpenAI', 'Anthropic', 'Google Vertex', 'Meta Llama'].includes(c.provider);
    if (activeTab === 'tokens') return c.provider === 'Custom Token';
    if (activeTab === 'webhooks') return c.isBearer;
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2 border border-slate-700">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

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
            <span className="text-secondary font-semibold">API &amp; Connection Credentials</span>
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">API &amp; Connection Credentials</h1>
          <p className="text-on-surface-variant font-body-md mt-1">
            Manage authorization tokens, model provider keys, and client secrets. Encrypted at rest via AES-256 GCM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('audit-logs')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">history</span>
            <span>Key Audit Logs</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add New Credential</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Active Tokens</span>
            <span className="material-symbols-outlined text-primary text-[20px]">key</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-on-surface">{credentials.length}</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">/ 10 Allocation</span>
          </div>
          <p className="text-[11px] text-primary font-medium mt-2">
            {10 - credentials.length} credential slots remaining in Pro Tier
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Encryption Standard</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-on-surface">SOC-2 Type II</span>
          </div>
          <p className="text-[11px] text-on-surface-variant font-medium mt-2">
            Zero-Retention Hardware Security Module
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Key Health &amp; Rotation</span>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">sync</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-on-surface">Last: 4d ago</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-2">
            1 key expiring in 3 days (Meta Llama Local)
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          All Credentials ({credentials.length})
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'providers'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          AI Model Providers ({credentials.filter(c => c.type === 'Provider Key').length})
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'tokens'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          Custom API Tokens ({credentials.filter(c => c.type === 'Context API Token').length})
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'webhooks'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          Webhooks &amp; CI/CD ({credentials.filter(c => c.type.includes('Webhook') || c.type.includes('CI/CD')).length})
        </button>
      </div>

      {/* Credentials Matrix List */}
      <div className="space-y-4">
        {filteredCredentials.map((cred) => {
          const isVisible = visibleKeys[cred.id];
          const displayKey = isVisible
            ? cred.realKey
            : `${cred.keyPrefix}••••••••••••••••${cred.keySuffix}`;

          const getLogoForProvider = (providerName: string) => {
            const p = providerName.toLowerCase();
            if (p.includes('openai')) return <ModelLogo model="openai" className="w-5 h-5 text-slate-900" />;
            if (p.includes('anthropic') || p.includes('claude')) return <ModelLogo model="claude" className="w-5 h-5 text-amber-700" />;
            if (p.includes('google') || p.includes('gemini') || p.includes('vertex')) return <ModelLogo model="gemini" className="w-5 h-5" />;
            if (p.includes('deepseek')) return <ModelLogo model="deepseek" className="w-5 h-5" />;
            if (p.includes('mistral')) return <ModelLogo model="mistral" className="w-5 h-5" />;
            if (p.includes('groq')) return <ModelLogo model="groq" className="w-5 h-5 text-red-600" />;
            if (p.includes('llama') || p.includes('meta')) return <ModelLogo model="llama" className="w-5 h-5" />;
            if (p.includes('cohere')) return <ModelLogo model="cohere" className="w-5 h-5" />;
            if (p.includes('perplexity')) return <ModelLogo model="perplexity" className="w-5 h-5" />;
            if (p.includes('qwen')) return <ModelLogo model="qwen" className="w-5 h-5" />;
            return <span className="material-symbols-outlined text-purple-600 text-[20px]">terminal</span>;
          };

          return (
            <div
              key={cred.id}
              className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-outline-variant/60 transition-all"
            >
              {/* Left Column: Info & Permissions */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-center font-bold text-on-surface p-1.5">
                    {getLogoForProvider(cred.provider)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-on-surface">{cred.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cred.status === 'Active'
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {cred.statusBadge}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant font-medium">{cred.type}</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant">
                  {cred.permissions}
                </p>

                {/* Key Mask Box */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="font-mono text-xs bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface flex items-center gap-2 max-w-md select-all">
                    <span>{displayKey}</span>
                  </div>
                  <button
                    onClick={() => toggleVisibility(cred.id)}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-colors cursor-pointer"
                    title={isVisible ? 'Hide Key' : 'Reveal Secret'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isVisible ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleCopy(cred.realKey, cred.name)}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-colors cursor-pointer"
                    title="Copy Secret"
                  >
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-on-surface-variant pt-1">
                  <span>Created: {cred.createdAt}</span>
                  <span>•</span>
                  <span>{cred.lastUsed}</span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleRotate(cred.id, cred.name)}
                  className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">autorenew</span>
                  <span>Rotate Key</span>
                </button>
                <button
                  onClick={() => handleRevoke(cred.id, cred.name)}
                  className="px-3.5 py-2 rounded-xl border border-error/30 text-error hover:bg-error/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Revoke</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero Trust Footer Callout */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
        <div className="text-xs text-on-surface-variant">
          <strong className="text-on-surface">Automatic Zero-Trust Key Scrubbing:</strong> All raw API secret strings are immediately encrypted using your organization’s Master Key Envelope and never logged to plain-text system traces or monitoring dashboards.
        </div>
      </div>

      {/* Add New Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">add_moderator</span>
                <h3 className="font-bold text-slate-900 text-base">Add New Connection Credential</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCredential} className="p-6 space-y-4">
              {/* Provider Radio Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Provider / Model Engine
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    'OpenAI',
                    'Anthropic',
                    'Google Vertex',
                    'DeepSeek',
                    'Mistral AI',
                    'Groq',
                    'Meta Llama',
                    'Cohere',
                    'Custom Token'
                  ] as const).map((prov) => (
                    <button
                      type="button"
                      key={prov}
                      onClick={() => setNewProvider(prov)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                        newProvider === prov
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{prov}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Credential Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. OpenAI Staging Cluster Key"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  required
                />
              </div>

              {/* Secret Key Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Secret API Key / Bearer Token
                </label>
                <input
                  type="password"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Paste your key (e.g. sk-proj-...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  required
                />
              </div>

              {/* Scopes & Permissions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Permission Scope
                </label>
                <input
                  type="text"
                  value={newPermissions}
                  onChange={(e) => setNewPermissions(e.target.value)}
                  placeholder="Inference, Embeddings, Context Cascade"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
