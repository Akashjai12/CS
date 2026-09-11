import React, { useState } from 'react';
import { ProjectItem, ScreenId } from '../../types';

interface ProjectWorkspaceScreenProps {
  project?: ProjectItem;
  onNavigate: (screen: ScreenId) => void;
  onOpenNewProject: () => void;
}

export const ProjectWorkspaceScreen: React.FC<ProjectWorkspaceScreenProps> = ({
  project,
  onNavigate,
  onOpenNewProject
}) => {
  const currentProjectName = project?.name || 'E-commerce Platform';
  const [activeTab, setActiveTab] = useState<'Chat' | 'Notes' | 'Files' | 'Tasks' | 'Context'>('Chat');
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT-4o + Claude 3.5');
  const [showPrdModal, setShowPrdModal] = useState(false);

  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'user',
      text: 'Build a product requirements document based on our previous discussions.'
    },
    {
      sender: 'ai',
      text: "Here's a detailed PRD based on your past chats, files, and notes. I have synthesized the technical requirements, microservice boundaries, and vector database schemas.",
      hasAttachment: true
    }
  ]);

  const [notesText, setNotesText] = useState(
    `# E-commerce Platform Architecture Notes\n\n- Payment Gateway: Stripe Elements + Hosted Checkout\n- Vector Cache: Redis Vector Engine (Cosine Distance)\n- AI Models in loop: GPT-4o for real-time customer recommendation, Claude 3.5 for catalog batch synthesis.`
  );

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Set up Stripe webhook handler with idempotent event validation', done: true },
    { id: 2, text: 'Deploy Redis vector cache cluster for customer semantic search', done: true },
    { id: 3, text: 'Finalize OpenAPI 3.1 microservice contracts with Claude 3.5', done: false },
    { id: 4, text: 'Run load testing for 10k simultaneous context graph queries', done: false },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userText = message;
    setMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Context Studio synced with ${selectedModel}. Memory node updated with 840 tokens for: "${userText}". All active threads now retain this architectural context.`
        }
      ]);
    }, 500);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 pb-20">
      {/* Top Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-1">
            <span 
              onClick={() => onNavigate('dashboard')} 
              className="hover:underline cursor-pointer"
            >
              Dashboard
            </span>
            <span>/</span>
            <span>Projects</span>
            <span>/</span>
            <span className="text-secondary font-bold">{currentProjectName}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-on-surface tracking-tight">{currentProjectName}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold text-[10px] uppercase tracking-wider">
              Production
            </span>
          </div>
          <p className="text-on-surface-variant text-xs mt-1">
            Unified multi-model workspace for architectural discussions, research, code, and persistent memory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Model Selector */}
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-secondary">neurology</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-800 font-semibold"
            >
              <option value="GPT-4o + Claude 3.5">GPT-4o + Claude 3.5 (Active Ensemble)</option>
              <option value="DeepSeek V3 / R1">DeepSeek V3 / R1 (Fast MoE Reasoning)</option>
              <option value="Claude 3.5 Sonnet Only">Claude 3.5 Sonnet (Architecture &amp; Docs)</option>
              <option value="GPT-4o Only">GPT-4o (Vision, Tools &amp; Code)</option>
              <option value="Gemini 2.0 Flash">Gemini 2.0 Flash (2M Long Context)</option>
              <option value="Groq LPU Engine">Groq LPU (280+ tokens/sec)</option>
              <option value="Mistral Large 2">Mistral Large 2 (Multilingual)</option>
              <option value="Llama 3.1 405B">Llama 3.1 405B (Meta Open Weights)</option>
            </select>
          </div>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-6 border-b border-outline-variant/20 pb-3 text-xs font-bold text-on-surface-variant">
        {(['Chat', 'Notes', 'Files', 'Tasks', 'Context'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 pb-3 -mb-3 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'text-secondary border-b-2 border-secondary font-extrabold'
                : 'hover:text-on-surface'
            }`}
          >
            {tab === 'Chat' && <span className="material-symbols-outlined text-[16px]">chat</span>}
            {tab === 'Notes' && <span className="material-symbols-outlined text-[16px]">edit_note</span>}
            {tab === 'Files' && <span className="material-symbols-outlined text-[16px]">folder</span>}
            {tab === 'Tasks' && <span className="material-symbols-outlined text-[16px]">task_alt</span>}
            {tab === 'Context' && <span className="material-symbols-outlined text-[16px]">memory</span>}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs p-6 min-h-[500px] flex flex-col justify-between">
        {activeTab === 'Chat' && (
          <div className="flex flex-col justify-between h-full space-y-6">
            {/* Messages Stream */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {chatHistory.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  {item.sender === 'user' ? (
                    <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 max-w-3xl ml-auto">
                      <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs shrink-0">
                        A
                      </div>
                      <div className="text-xs text-on-surface font-medium leading-relaxed">
                        {item.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-outline-variant/30 max-w-3xl shadow-xs">
                      <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0">
                        <span className="material-symbols-outlined text-[16px]">neurology</span>
                      </div>
                      <div className="space-y-3 w-full">
                        <div className="text-xs text-on-surface leading-relaxed">
                          {item.text}
                        </div>

                        {item.hasAttachment && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                            <div className="flex items-center gap-2.5">
                              <span className="material-symbols-outlined text-secondary text-[22px]">description</span>
                              <div>
                                <h4 className="font-bold text-on-surface text-xs">Product_Requirements_Document.md</h4>
                                <span className="text-[10px] text-on-surface-variant">Generated from your project context &amp; notes</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowPrdModal(true)}
                              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 shadow-xs transition-colors cursor-pointer"
                            >
                              View PRD
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="pt-4 border-t border-outline-variant/20">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-on-surface-variant absolute left-3 text-[18px]">
                  attachment
                </span>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message Context Studio... (e.g. 'Draft API endpoints for Stripe webhooks')"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-10 pr-12 py-3 text-xs text-on-surface focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-1.5 bg-secondary hover:bg-secondary-container text-white rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'Notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <span className="text-xs font-bold text-on-surface">Markdown Project Scratchpad</span>
              <span className="text-[11px] text-primary font-semibold">Auto-saved to Context Vector Store</span>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              rows={16}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 font-mono text-xs text-on-surface focus:outline-none focus:bg-white leading-relaxed"
            />
          </div>
        )}

        {activeTab === 'Files' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Attached Project Repositories &amp; Files
            </h3>
            <div className="divide-y divide-outline-variant/20 border border-outline-variant/20 rounded-xl overflow-hidden">
              <div className="p-3 bg-surface-container-low flex items-center justify-between hover:bg-surface-container cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs font-medium text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">code</span>
                  <span>schema.prisma</span>
                </div>
                <span className="text-[11px] text-on-surface-variant font-mono">14.2 KB • Indexed</span>
              </div>
              <div className="p-3 bg-surface-container-low flex items-center justify-between hover:bg-surface-container cursor-pointer">
                <div className="flex items-center gap-2.5 text-xs font-medium text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">javascript</span>
                  <span>stripe_webhooks.ts</span>
                </div>
                <span className="text-[11px] text-on-surface-variant font-mono">8.4 KB • Indexed</span>
              </div>
              <div 
                onClick={() => setShowPrdModal(true)}
                className="p-3 bg-surface-container-low flex items-center justify-between hover:bg-surface-container cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-xs font-medium text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px]">description</span>
                  <span>Product_Requirements_Document.md</span>
                </div>
                <span className="text-[11px] text-primary font-bold">Generated PRD</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Milestone Tasks
              </h3>
              <span className="text-xs text-on-surface-variant">
                {tasks.filter(t => t.done).length} of {tasks.length} completed
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="rounded text-primary cursor-pointer"
                  />
                  <span className={`text-xs ${task.done ? 'line-through text-on-surface-variant' : 'text-on-surface font-medium'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Context' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Context Memory Graph Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="text-[11px] text-on-surface-variant block">Memory Vector Nodes</span>
                <span className="text-2xl font-extrabold text-on-surface">32 Nodes</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="text-[11px] text-on-surface-variant block">Total Ingested Tokens</span>
                <span className="text-2xl font-extrabold text-on-surface">1,248,920</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="text-[11px] text-on-surface-variant block">Vector Recall Latency</span>
                <span className="text-2xl font-extrabold text-primary">14 ms</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs">
              <p className="text-emerald-400 font-bold mb-1">// Active Vector Graph Index</p>
              <p>node[0]: "auth_routes.ts" (embedding_dim: 1536, cosine_dist: 0.94)</p>
              <p>node[1]: "Product_Requirements_Document.md" (embedding_dim: 1536, cosine_dist: 0.98)</p>
              <p>node[2]: "stripe_checkout_spec" (embedding_dim: 1536, cosine_dist: 0.91)</p>
            </div>
          </div>
        )}
      </div>

      {/* View PRD Modal */}
      {showPrdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">description</span>
                <h3 className="font-bold text-slate-900 text-sm">Product_Requirements_Document.md</h3>
              </div>
              <button
                onClick={() => setShowPrdModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-800 space-y-4 leading-relaxed bg-slate-50/40">
              <h2 className="text-sm font-bold text-slate-900 font-sans"># E-commerce Platform Architecture PRD</h2>
              <p className="text-slate-600 font-sans">Generated by Claude 3.5 Sonnet &amp; GPT-4o synthesis across project memory graph.</p>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 font-sans">Core Specifications</h4>
                <p className="text-slate-600 font-sans">Microservices architecture with Next.js storefront, Node.js inventory service, Stripe payments, and PostgreSQL persistent database with Redis semantic vector cache.</p>
              </div>
            </div>

            <div className="px-6 py-3 bg-white border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPrdModal(false)}
                className="px-4 py-1.5 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary-container transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
