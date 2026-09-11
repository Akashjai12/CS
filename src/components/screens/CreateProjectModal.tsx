import React, { useState } from 'react';
import { ProjectItem } from '../../types';
import { BRAND_ASSETS } from '../../data/mockData';
import { ContextLogo } from '../ContextLogo';
import { ModelLogo } from '../ModelLogo';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ProjectItem) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('E-commerce Platform Architecture');
  const [description, setDescription] = useState(
    'Full-stack microservices orchestration, Stripe payments, vector inventory embeddings, and unified API contract docs.'
  );
  const [selectedTemplate, setSelectedTemplate] = useState('rag');
  const [autoPropagate, setAutoPropagate] = useState(true);

  if (!isOpen) return null;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Submit project
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: name.trim() || 'New Workspace Project',
      category: 'Production',
      categoryBadgeClass: 'bg-primary-fixed text-on-primary-fixed',
      models: ['GPT-4o', 'Claude 3.5'],
      tokensUsed: '0 Tokens',
      tokenPercent: 10,
      updatedAt: 'Just created',
      icon: 'rocket_launch',
      iconColor: 'text-primary'
    };

    onProjectCreated(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <ContextLogo size={32} className="shadow-xs" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Create New Project</h3>
              <p className="text-[11px] text-slate-500">
                Initialize a persistent context memory graph, attach knowledge sources, and configure AI routing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Wizard Steps Bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
              {step > 1 ? '✓' : '1'}
            </span>
            <span>1. Project Details</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <span>2. Model Routing</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 3 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </span>
            <span>3. Knowledge Sources</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          {step === 1 && (
            <>
              {/* Project Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  placeholder="e.g. E-commerce Platform Architecture"
                  required
                />
                <div className="mt-1 text-[11px] text-slate-400 font-mono">
                  Slug: <span className="text-blue-600">context.studio/alex-morgan/{slug || 'project'}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Description &amp; Scope
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors leading-relaxed"
                  placeholder="Describe the project objectives, context boundaries, and key technical deliverables..."
                />
              </div>

              {/* Workspace Allocation & Encryption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Workspace Allocation
                  </label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none">
                    <option>Production Workspace (Pro Plan)</option>
                    <option>Sandbox / Staging Cluster</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Visibility &amp; Encryption
                  </label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none">
                    <option>SOC-2 Zero-Retention (AES-256 GCM)</option>
                    <option>Team Shared (Internal Only)</option>
                  </select>
                </div>
              </div>

              {/* Architectural Template Blueprint */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Architectural Template &amp; Context Blueprint
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Template 1 */}
                  <div
                    onClick={() => setSelectedTemplate('rag')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedTemplate === 'rag'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">dataset</span>
                      <h4 className="text-xs font-bold text-slate-900">RAG Knowledge Hub</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Pre-configured vector embeddings for PDFs, Markdown, and OpenAPI schemas.
                    </p>
                  </div>

                  {/* Template 2 */}
                  <div
                    onClick={() => setSelectedTemplate('multi-model')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedTemplate === 'multi-model'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-600 text-[18px]">neurology</span>
                      <h4 className="text-xs font-bold text-slate-900">Multi-Model Agent Thread</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Parallel reasoning graph with cross-validation across GPT-4o &amp; Claude.
                    </p>
                  </div>

                  {/* Template 3 */}
                  <div
                    onClick={() => setSelectedTemplate('ast')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedTemplate === 'ast'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]">code_blocks</span>
                      <h4 className="text-xs font-bold text-slate-900">Codebase &amp; AST Analysis</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Deep semantic code graph indexing and automated PR review pipeline.
                    </p>
                  </div>

                  {/* Template 4 */}
                  <div
                    onClick={() => setSelectedTemplate('blank')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedTemplate === 'blank'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-700 text-[18px]">draft</span>
                      <h4 className="text-xs font-bold text-slate-900">Blank Slate Context</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Clean persistent memory store without pre-loaded prompts or constraints.
                    </p>
                  </div>
                </div>
              </div>

              {/* Context Policy Defaults */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cross-Project Knowledge Propagation</h4>
                  <p className="text-[11px] text-slate-500">
                    Propagate high-level decisions to global workspace memory fabric
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoPropagate(!autoPropagate)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    autoPropagate ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      autoPropagate ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Active Model Providers
              </h4>
              <p className="text-xs text-slate-500">
                Choose which models have read/write access to this project’s memory graph.
              </p>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <ModelLogo model="openai" className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">OpenAI GPT-4o &amp; o1</span>
                      <span className="text-[10px] text-slate-500">Reasoning, Real-time Code &amp; Multimodal</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <ModelLogo model="claude" className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Anthropic Claude 3.5 Sonnet</span>
                      <span className="text-[10px] text-slate-500">Deep Architectural Synthesis &amp; PRDs</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <ModelLogo model="gemini" className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Google Gemini 2.0 Flash</span>
                      <span className="text-[10px] text-slate-500">2M Token Context Window &amp; Multimodal</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <ModelLogo model="deepseek" className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">DeepSeek V3 &amp; R1</span>
                      <span className="text-[10px] text-slate-500">Ultra-fast Multi-head Latent Attention</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <ModelLogo model="groq" className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Groq LPU (Llama 3.1 70B)</span>
                      <span className="text-[10px] text-slate-500">280+ tokens/sec Extreme Throughput</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">Ready</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <ModelLogo model="mistral" className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Mistral Large 2 &amp; Codestral</span>
                      <span className="text-[10px] text-slate-500">European Sovereign Multilingual Model</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">Ready</span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Attach Initial Knowledge Sources
              </h4>
              <p className="text-xs text-slate-500">
                You can upload documents, connect a GitHub repository, or ingest web specifications now or later.
              </p>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50">
                <span className="material-symbols-outlined text-[32px] text-slate-400">upload_file</span>
                <p className="text-xs font-bold text-slate-800 mt-2">
                  Drag and drop files here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Supports Markdown, PDF, TypeScript, OpenAPI JSON (up to 50MB)</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-xs">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>All uploaded files are processed locally via vector embeddings with zero training retention.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                alert('Draft saved locally.');
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Save as Draft
            </button>
          </div>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleContinue}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {step === 3 ? 'Finish & Launch Project' : 'Continue to Model Setup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
