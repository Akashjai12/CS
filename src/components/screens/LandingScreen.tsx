import React, { useState } from 'react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenId, UserProfile } from '../../types';
import { ContextLogo } from '../ContextLogo';
import { ModelLogo } from '../ModelLogo';

interface LandingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenNewProject: () => void;
  user: UserProfile;
  onOpenLoginModal: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ 
  onNavigate, 
  onOpenNewProject,
  user,
  onOpenLoginModal
}) => {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Notes' | 'Files' | 'Tasks' | 'Context'>('Chat');
  const [showPrdModal, setShowPrdModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [mockMessages, setMockMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; attachment?: boolean }>>([
    {
      sender: 'user',
      text: 'Build a product requirements document based on our previous discussions.'
    },
    {
      sender: 'ai',
      text: "Here's a detailed PRD based on your past chats, files, and notes...",
      attachment: true
    }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatMessage('');
    setMockMessages(prev => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      setMockMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Context Studio synchronized your request across GPT-4o and Claude 3.5. Updated project memory graph with 1,280 new tokens for "${userText.slice(0, 32)}...".`
        }
      ]);
    }, 600);
  };

  return (
    <div className="bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 min-h-screen">
      {/* BEGIN: SiteNavigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Container */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              aria-label="Toggle workspace sidebar"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors mr-1 cursor-pointer"
              title="Open Workspace Dashboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <path d="M14 9l-3 3 3 3"></path>
              </svg>
            </button>
            <div 
              onClick={() => onNavigate('landing')}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <ContextLogo size={36} className="shadow-xs group-hover:scale-105 transition-transform" />
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Context <span className="text-blue-600">Studio</span>
              </span>
            </div>
          </div>

          {/* Main Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
            <a 
              className="hover:text-slate-900 transition-colors cursor-pointer" 
              onClick={() => onNavigate('dashboard')}
            >
              Product
            </a>
            <a 
              className="hover:text-slate-900 transition-colors cursor-pointer" 
              onClick={() => onNavigate('project-workspace')}
            >
              Features
            </a>
            <a 
              className="hover:text-slate-900 transition-colors cursor-pointer" 
              href="#use-cases"
            >
              Use Cases
            </a>
            <a 
              className="hover:text-slate-900 transition-colors cursor-pointer" 
              onClick={() => onNavigate('settings')}
            >
              Pricing
            </a>
            <a 
              className="hover:text-slate-900 transition-colors cursor-pointer" 
              onClick={() => onNavigate('audit-logs')}
            >
              Docs
            </a>
          </nav>

          {/* Nav CTA Actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                aria-label="Notifications"
                className="relative p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                title="View Notifications"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600"></span>
              </button>

              {/* User Profile Pill & Login Button */}
              <div 
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
                title="Account Login Details"
              >
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-500 transition-all"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'LJ'}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-600 border border-white"></span>
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none max-w-[140px]">
                  <span className="text-[12px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {user.email}
                  </span>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLoginModal}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-slate-500">login</span>
                <span>Sign In / Switch</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 bg-[#0d1424] hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
              >
                <span>Enter Workspace</span>
                <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* END: SiteNavigation */}

      {/* BEGIN: HeroSection */}
      <section className="relative pt-12 pb-20 overflow-hidden hero-glow">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content Column */}
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-block tracking-wider uppercase text-xs font-bold text-slate-400">
                YOUR CONTEXT. EVERYWHERE.
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.12] tracking-tight">
                Universal AI Workspace<br />
                <span className="text-blue-600">where Context</span><br />
                is the Primary Asset.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Context Studio maintains persistent, project-wide memory and context across different AI models so your work is never lost between chats.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2.5 bg-[#0e5332] hover:bg-[#0a3f26] text-white font-medium px-7 py-3 rounded-full text-base transition-colors shadow-md shadow-emerald-950/10 cursor-pointer"
                >
                  <span>Get Started</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
                <button
                  onClick={() => onNavigate('project-workspace')}
                  className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 font-medium px-6 py-3 rounded-full text-base border border-slate-200 transition-colors cursor-pointer"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-300">
                    <svg className="w-3 h-3 text-slate-800 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </span>
                  <span>Watch Demo</span>
                </button>
              </div>
              <p className="text-sm font-medium text-slate-500 pt-2">
                One workspace. All your AI models. Infinite possibilities.
              </p>
            </div>

            {/* Right Hero Diagram: Hub and Spoke Architecture */}
            <div className="lg:col-span-6 relative flex justify-center items-center min-h-[460px]">
              {/* Dotted Connection SVG Canvas */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 540 460">
                {/* Center to GPT-4o (Top Left) */}
                <path className="dotted-path" d="M270 200 L 190 95"></path>
                {/* Center to Claude (Top Right) */}
                <path className="dotted-path" d="M270 200 L 350 95"></path>
                {/* Center to Llama (Left) */}
                <path className="dotted-path" d="M270 220 L 150 200"></path>
                {/* Center to Gemini (Right) */}
                <path className="dotted-path" d="M270 220 L 390 200"></path>
                {/* Center to And more (Bottom) */}
                <path className="dotted-path" d="M270 260 L 270 340"></path>
              </svg>

              {/* Central Context Studio Hub Node */}
              <div 
                onClick={() => onNavigate('dashboard')}
                className="relative z-10 bg-white border border-slate-100 rounded-2xl p-6 shadow-xl shadow-blue-500/5 text-center flex flex-col items-center w-48 cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-1">
                  <ContextLogo size={48} className="drop-shadow-sm" />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Context <span className="text-blue-600">Studio</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 w-full flex flex-col items-center gap-1">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="text-[11px] font-semibold text-slate-700">Persistent Context</span>
                </div>
              </div>

              {/* Top-Left Node: GPT-4o */}
              <div 
                onClick={() => onNavigate('credentials')}
                className="absolute top-6 left-24 flex flex-col items-center group cursor-pointer"
                title="Configure GPT-4o"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 transition-transform group-hover:scale-105">
                  <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" strokeLinecap="round" strokeLinejoin="round"></path>
                    <circle cx="12" cy="12" fill="currentColor" r="4"></circle>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">GPT-4o</span>
              </div>

              {/* Top-Right Node: Claude */}
              <div 
                onClick={() => onNavigate('credentials')}
                className="absolute top-6 right-24 flex flex-col items-center group cursor-pointer"
                title="Configure Claude 3.5"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 transition-transform group-hover:scale-105">
                  <svg className="w-7 h-7 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l1.8 6.2 6.2 1.8-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"></path>
                    <path d="M19 16l-3-1 1-3 1.5 2.5L19 16zM5 16l1.5-1.5 1 3-3-1z"></path>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Claude</span>
              </div>

              {/* Mid-Left Node: Llama */}
              <div 
                onClick={() => onNavigate('credentials')}
                className="absolute top-44 left-8 flex flex-col items-center group cursor-pointer"
                title="Configure Meta Llama"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 transition-transform group-hover:scale-105">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18.178 8c5.096 0 5.096 8 0 8-2.604 0-4.48-2.5-6.178-5.5C10.302 7.5 8.426 5 5.822 5 .726 5 .726 13 5.822 13c2.604 0 4.48-2.5 6.178-5.5 1.698 3 3.574 5.5 6.178 5.5z"></path>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Llama</span>
              </div>

              {/* Mid-Right Node: Gemini */}
              <div 
                onClick={() => onNavigate('credentials')}
                className="absolute top-44 right-8 flex flex-col items-center group cursor-pointer"
                title="Configure Gemini 1.5"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 transition-transform group-hover:scale-105">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24">
                    <path d="M12 0C12 7.5 7.5 12 0 12C7.5 12 12 16.5 12 24C12 16.5 16.5 12 24 12C16.5 12 12 7.5 12 0Z" fill="url(#gemini-icon-grad)"></path>
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="gemini-icon-grad" x1="0" x2="24" y1="0" y2="24">
                        <stop stopColor="#3b82f6"></stop>
                        <stop offset="0.5" stopColor="#ef4444"></stop>
                        <stop offset="1" stopColor="#eab308"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Gemini</span>
              </div>

              {/* Bottom Node: And more */}
              <div 
                onClick={() => onNavigate('credentials')}
                className="absolute bottom-4 flex flex-col items-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg group-hover:scale-105 transition-transform">
                  •••
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">And more</span>
              </div>

              {/* Playful Handwritten Annotation & Arrow */}
              <div className="absolute bottom-8 right-8 flex flex-col items-start select-none transform rotate-3 pointer-events-none">
                <span className="font-handwriting text-slate-700 text-lg leading-tight font-bold">
                  Same context.<br />More possibilities.
                </span>
                <svg className="w-8 h-10 text-slate-800 -translate-x-1 mt-1" fill="none" viewBox="0 0 40 45">
                  <path d="M20 2 C 28 15, 30 25, 22 38" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                  <path d="M15 32 L 22 38 L 26 28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: ValuePropositionFeatures */}
      <section className="border-y border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1: Persistent Memory */}
            <div className="flex flex-col space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Persistent Memory</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Your work stays in context across all models.</p>
            </div>

            {/* Pillar 2: Multi-Model Support */}
            <div className="flex flex-col space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="12" r="3"></circle>
                  <path d="M8.5 7.5L15.5 10.5M8.5 16.5L15.5 13.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Multi-Model Support</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Use the best model for the task.</p>
            </div>

            {/* Pillar 3: Built for Productivity */}
            <div className="flex flex-col space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h7v8l10-12h-7V2z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Built for Productivity</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Turn ideas into outcomes faster.</p>
            </div>

            {/* Pillar 4: Private & Secure */}
            <div className="flex flex-col space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="10" rx="2" width="14" x="5" y="11"></rect>
                  <path d="M8 11V7a4 4 0 018 0v4"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Private &amp; Secure</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Your data stays yours.</p>
            </div>
          </div>
        </div>
      </section>
      {/* END: ValuePropositionFeatures */}

      {/* BEGIN: InteractiveShowcase */}
      <section className="py-24 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Realistic Context Studio UI Mockup */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-xs">
              <div className="grid grid-cols-12 min-h-[440px]">
                {/* App Sidebar */}
                <div className="col-span-4 bg-slate-50/70 border-r border-slate-200/70 p-3 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* App Brand inside mockup */}
                    <div className="flex items-center gap-1.5 px-1 py-1">
                      <ContextLogo size={20} />
                      <span className="font-bold text-slate-800 text-[13px]">
                        Context <span className="text-blue-600">Studio</span>
                      </span>
                    </div>

                    {/* New Chat CTA */}
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="w-full bg-[#0d1424] hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="text-sm leading-none">+</span>
                      <span>New Chat</span>
                    </button>

                    {/* Navigation List */}
                    <div className="space-y-0.5 text-slate-600 font-medium">
                      <div 
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                        <span>Search</span>
                      </div>
                      <div 
                        onClick={() => onNavigate('project-workspace')}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        <span>Projects</span>
                      </div>
                      <div 
                        onClick={() => onNavigate('credentials')}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path></svg>
                        <span>Models</span>
                      </div>
                      <div 
                        onClick={() => onNavigate('audit-logs')}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect height="16" rx="2" width="16" x="4" y="4"></rect><path d="M9 4v16M15 4v16"></path></svg>
                        <span>Library</span>
                      </div>
                      <div 
                        onClick={() => onNavigate('settings')}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        <span>Settings</span>
                      </div>
                    </div>

                    {/* Recent Projects Section */}
                    <div className="pt-3 border-t border-slate-200/60">
                      <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1.5 tracking-wider">Recent</div>
                      <div className="space-y-1 text-slate-600">
                        <div 
                          onClick={() => onNavigate('project-workspace')}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-200/60 text-slate-900 font-semibold cursor-pointer"
                        >
                          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          <span className="truncate">E-commerce Platform</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer">
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          <span className="truncate">Research Notes</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer">
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          <span className="truncate">App Redesign</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer">
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          <span className="truncate">ML Experiment</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer">
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          <span className="truncate">Personal Knowledge</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* App Main Chat Workspace Area */}
                <div className="col-span-8 flex flex-col justify-between p-4 bg-white">
                  {/* Workspace Top Bar */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <span className="text-slate-400">&lt;/&gt;</span>
                        <span className="text-slate-900 font-semibold">E-commerce Platform</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            className="bg-slate-100 border-none text-[11px] rounded-full py-1 pl-7 pr-3 text-slate-700 w-36 focus:ring-1 focus:ring-blue-500"
                            placeholder="Search in project..."
                            type="text"
                            readOnly
                          />
                          <svg className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                          </svg>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                          A
                        </div>
                      </div>
                    </div>

                    {/* Workspace Meta & Tab Row */}
                    <div className="mt-3">
                      <h4 className="font-bold text-slate-900 text-base">E-commerce Platform</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        A unified workspace for all my product development discussions, research, code, and decisions.
                      </p>
                      
                      {/* Tabs */}
                      <div className="flex items-center gap-4 mt-3 border-b border-slate-100 pb-2 text-[11px] font-medium text-slate-500">
                        {(['Chat', 'Notes', 'Files', 'Tasks', 'Context'] as const).map((tab) => (
                          <span
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-1 cursor-pointer transition-colors pb-2 -mb-2 ${
                              activeTab === tab
                                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                : 'hover:text-slate-700'
                            }`}
                          >
                            {tab === 'Chat' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>}
                            {tab === 'Notes' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                            {tab === 'Files' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>}
                            {tab === 'Tasks' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>}
                            {tab === 'Context' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                            {tab}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Chat History Messages */}
                    <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-1">
                      {mockMessages.map((msg, index) => (
                        <div key={index}>
                          {msg.sender === 'user' ? (
                            <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                </svg>
                              </div>
                              <div className="text-[11px] text-slate-700 leading-snug">
                                {msg.text}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-100">
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="3"></circle>
                                  <circle cx="6" cy="6" r="2"></circle>
                                  <circle cx="18" cy="18" r="2"></circle>
                                </svg>
                              </div>
                              <div className="space-y-2 w-full">
                                <div className="text-[11px] text-slate-700 leading-snug">
                                  {msg.text}
                                </div>
                                {msg.attachment && (
                                  <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-200/80">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                      </div>
                                      <div>
                                        <div className="font-semibold text-slate-800 text-[11px]">Product_Requirements_Document.md</div>
                                        <div className="text-[10px] text-slate-400">Generated from your project context</div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setShowPrdModal(true)}
                                      className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[10px] font-semibold text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer"
                                    >
                                      View
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input Composer */}
                  <form onSubmit={handleSendMessage} className="mt-4 pt-2">
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </span>
                      <input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-[11px] text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                        placeholder="Message Context Studio... (press Enter to send)"
                        type="text"
                      />
                      <button
                        type="button"
                        onClick={() => alert('Context Studio Assistant is ready. Type your query or attach repositories to start.')}
                        className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9"></circle>
                          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
                          <circle cx="12" cy="17" fill="currentColor" r=".5"></circle>
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right: Showcase Value Description & Key Bullets */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                A workspace<br />that remembers.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Keep your ideas, files, notes, and decisions connected across conversations, models, and time.
              </p>

              {/* Checkmark Value List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="text-[15px] font-semibold text-slate-800">Project-wide memory</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="text-[15px] font-semibold text-slate-800">Seamless model switching</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="text-[15px] font-semibold text-slate-800">Organized by your workflow</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="text-[15px] font-semibold text-slate-800">Find anything, anytime</span>
                </div>
              </div>

              {/* Learn more link */}
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-base hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: InteractiveShowcase */}

      {/* BEGIN: ModelCardsCatalog */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Eyebrow & Title */}
          <div className="tracking-wider uppercase text-xs font-bold text-slate-400 mb-3">
            ALL YOUR FAVORITE MODELS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            One context. Multiple AI models.
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto mb-14">
            Switch between leading AI models seamlessly while keeping your project context intact.
          </p>

          {/* Multi-Column Model Cards Grid with Proper AI Model Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {/* 1: OpenAI */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="openai" className="w-7 h-7 text-slate-900" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">GPT-4o / o1</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">OpenAI</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Multimodal reasoning &amp; code analysis</p>
            </div>

            {/* 2: Anthropic Claude */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50/70 border border-amber-100/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="claude" className="w-7 h-7 text-amber-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Claude 3.5</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Anthropic</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Nuanced writing &amp; architectural design</p>
            </div>

            {/* 3: Google Gemini */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50/60 border border-blue-100/50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="gemini" className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Gemini 2.0</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Google</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">2M context window &amp; audio grounding</p>
            </div>

            {/* 4: Meta Llama */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="llama" className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Llama 3.1 405B</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Meta</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Open-weights frontier compute</p>
            </div>

            {/* 5: DeepSeek */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50/50 border border-blue-100/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="deepseek" className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">DeepSeek V3</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">DeepSeek</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Ultra-efficient MoE &amp; reasoning</p>
            </div>

            {/* 6: Mistral */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50/60 border border-orange-100/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="mistral" className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Mistral Large 2</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Mistral AI</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">European multilingual sovereign AI</p>
            </div>

            {/* 7: Groq */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50/50 border border-red-100/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="groq" className="w-7 h-7 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Groq LPU</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Groq</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Lightning 280+ tokens/sec inference</p>
            </div>

            {/* 8: Cohere */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50/60 border border-emerald-100/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="cohere" className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Command R+</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Cohere</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Enterprise RAG &amp; tool automation</p>
            </div>

            {/* 9: Perplexity */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-teal-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50/60 border border-teal-100/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="perplexity" className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Sonar Search</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Perplexity</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Real-time live citations &amp; search</p>
            </div>

            {/* 10: Qwen */}
            <div 
              onClick={() => onNavigate('credentials')}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50/60 border border-purple-100/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform p-2.5">
                <ModelLogo model="qwen" className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Qwen 2.5</h4>
              <span className="text-[11px] text-slate-400 font-semibold mb-2">Alibaba</span>
              <p className="text-[11px] text-slate-500 mt-auto line-clamp-2">Dense coding &amp; math synthesizer</p>
            </div>
          </div>
        </div>
      </section>
      {/* END: ModelCardsCatalog */}

      {/* BEGIN: UseCasesSection */}
      <section id="use-cases" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="tracking-wider uppercase text-xs font-bold text-slate-400 block mb-2">USE CASES</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Built for how developers work.
              </h2>
            </div>
            <p className="text-slate-500 text-sm max-w-md">
              From coding and research to planning and documentation, Context Studio adapts to your workflow.
            </p>
          </div>

          {/* 4-Card Grid for Developer Use Cases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use Case 1: Build & Ship */}
            <div 
              onClick={() => onOpenNewProject()}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-4 group-hover:scale-105 transition-transform">
                &lt;/&gt;
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Build &amp; Ship</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Keep specs, code, and discussions in one place.
              </p>
            </div>

            {/* Use Case 2: Research & Learn */}
            <div 
              onClick={() => onOpenNewProject()}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Research &amp; Learn</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Collect and organize knowledge across sources.
              </p>
            </div>

            {/* Use Case 3: Plan & Collaborate */}
            <div 
              onClick={() => onOpenNewProject()}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Plan &amp; Collaborate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Turn ideas into structured plans and tasks.
              </p>
            </div>

            {/* Use Case 4: Write & Document */}
            <div 
              onClick={() => onOpenNewProject()}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Write &amp; Document</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create docs, notes, and reports with AI.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* END: UseCasesSection */}

      {/* BEGIN: BottomConversionCTA */}
      <section className="py-20 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Headline and primary buttons */}
            <div className="lg:col-span-6 space-y-6">
              <span className="tracking-wider uppercase text-xs font-bold text-slate-400 block">GET STARTED</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Your context.<br />
                A more capable you.
              </h2>
              <p className="text-base text-slate-600 max-w-md leading-relaxed">
                Join Context Studio and never lose your work between chats again.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2.5 bg-[#0e5332] hover:bg-[#0a3f26] text-white font-medium px-7 py-3 rounded-full text-sm transition-colors shadow-sm cursor-pointer"
                >
                  <span>Get Started</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
                <button
                  onClick={() => onNavigate('settings')}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-800 text-sm hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <span>View Pricing</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Ideas to Impact Workflow Diagram */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-6">
              {/* Dotted Flow Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 240">
                {/* Ideas -> Context Studio */}
                <path className="dotted-path" d="M180 50 C 210 50, 220 110, 250 110"></path>
                {/* Research -> Context Studio */}
                <path className="dotted-path" d="M180 170 C 210 170, 220 120, 250 120"></path>
                {/* Context Studio -> Code */}
                <path className="dotted-path" d="M310 110 C 340 110, 340 50, 370 50"></path>
                {/* Context Studio -> Plans */}
                <path className="dotted-path" d="M310 120 C 340 120, 340 170, 370 170"></path>
              </svg>

              {/* Diagram Grid */}
              <div className="flex items-center gap-8 z-10">
                {/* Left Input Pills */}
                <div className="flex flex-col gap-8">
                  {/* Ideas Node */}
                  <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                    <span className="text-amber-400 text-sm">💡</span>
                    <span className="text-xs font-semibold text-slate-800">Ideas</span>
                  </div>
                  {/* Research Node */}
                  <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    <span className="text-xs font-semibold text-slate-800">Research</span>
                  </div>
                </div>

                {/* Central Context Studio Node */}
                <div 
                  onClick={() => onNavigate('dashboard')}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-lg flex flex-col items-center text-center w-36 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <ContextLogo size={40} className="mb-2 drop-shadow-sm" />
                  <span className="text-[12px] font-bold text-slate-900 leading-tight">
                    Context <span className="text-blue-600">Studio</span>
                  </span>
                  <p className="text-[9px] text-slate-400 mt-2 leading-tight">
                    All connected.<br />Always in context.
                  </p>
                </div>

                {/* Right Output Pills */}
                <div className="flex flex-col gap-8">
                  {/* Code Node */}
                  <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                    <span className="text-blue-600 font-mono text-xs font-bold">&lt;/&gt;</span>
                    <span className="text-xs font-semibold text-slate-800">Code</span>
                  </div>
                  {/* Plans Node */}
                  <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" fill="currentColor" r="9"></circle>
                      <path d="M8 12l2.5 2.5L16 9" stroke="#ffffff" strokeWidth="2"></path>
                    </svg>
                    <span className="text-xs font-semibold text-slate-800">Plans</span>
                  </div>
                </div>
              </div>

              {/* Playful annotation top right */}
              <div className="absolute top-2 right-6 flex flex-col items-center select-none rotate-6 pointer-events-none">
                <span className="font-handwriting text-slate-700 text-base font-bold leading-none">
                  From ideas<br />to impact.
                </span>
                <svg className="w-6 h-8 text-slate-800 mt-1 ml-4" fill="none" viewBox="0 0 30 35">
                  <path d="M12 2 C 22 10, 22 18, 14 26" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
                  <path d="M8 22 L 14 26 L 18 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: BottomConversionCTA */}

      {/* BEGIN: SiteFooter */}
      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Footer Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
            {/* Footer Logo */}
            <div className="flex items-center gap-2.5">
              <ContextLogo size={32} />
              <div>
                <span className="font-bold text-slate-900 text-sm">Context <span className="text-blue-600">Studio</span></span>
                <span className="block text-[10px] text-slate-400 leading-none">Universal AI Workspace</span>
              </div>
            </div>

            {/* Footer Navigation Links */}
            <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
              <a onClick={() => onNavigate('dashboard')} className="hover:text-slate-900 transition-colors cursor-pointer">Product</a>
              <a onClick={() => onNavigate('project-workspace')} className="hover:text-slate-900 transition-colors cursor-pointer">Features</a>
              <a href="#use-cases" className="hover:text-slate-900 transition-colors">Use Cases</a>
              <a onClick={() => onNavigate('settings')} className="hover:text-slate-900 transition-colors cursor-pointer">Pricing</a>
              <a onClick={() => onNavigate('audit-logs')} className="hover:text-slate-900 transition-colors cursor-pointer">Docs</a>
            </div>

            {/* Social Icons (X, Discord, GitHub) */}
            <div className="flex items-center gap-5 text-slate-700">
              {/* X (Twitter) */}
              <a aria-label="X former Twitter" className="hover:text-slate-900 transition-colors" href="https://x.com" target="_blank" rel="noreferrer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              {/* Discord */}
              <a aria-label="Discord" className="hover:text-slate-900 transition-colors" href="https://discord.com" target="_blank" rel="noreferrer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                </svg>
              </a>
              {/* GitHub */}
              <a aria-label="GitHub" className="hover:text-slate-900 transition-colors" href="https://github.com" target="_blank" rel="noreferrer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-400">
            <div>
              © 2024 Context Studio. All rights reserved.
            </div>
            <div>
              Build a more connected future.
            </div>
          </div>
        </div>
      </footer>
      {/* END: SiteFooter */}

      {/* Modal: View Generated PRD */}
      {showPrdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Product_Requirements_Document.md</h3>
                  <span className="text-[11px] text-emerald-600 font-medium">Auto-generated from Project Memory (4.2k tokens)</span>
                </div>
              </div>
              <button
                onClick={() => setShowPrdModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"></path></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-800 space-y-4 leading-relaxed bg-slate-50/30">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="text-sm font-bold text-slate-900 font-sans"># PRD: Global Context Sync &amp; Multi-Model Memory Fabric</h2>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">Author: Context Studio Agent (Claude 3.5 Sonnet + GPT-4o synthesis)</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 font-sans mb-1">1. Objectives &amp; Vision</h3>
                <p className="text-slate-600 font-sans">Enable zero-loss conversational memory across distributed AI model families (GPT-4o, Claude 3.5, Gemini 1.5, and Llama 3) for the E-commerce Platform workspace.</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 font-sans mb-1">2. Core Architectural Components</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 font-sans">
                  <li><strong>Persistent Context Fabric:</strong> Ingests schema definitions, API routes, and meeting notes into high-recall vector embeddings.</li>
                  <li><strong>Cross-Model Routing:</strong> Directs latency-critical tokens to local nodes while piping heavy architectural synthesis to Claude 3.5 Sonnet.</li>
                  <li><strong>Hardware-Backed Envelope Encryption:</strong> AES-256 GCM key security with zero-data-retention enterprise guarantees.</li>
                </ul>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Active Memory Node Hashes</span>
                <code>hash_schema_v2: 0x8a92bf...49aF | tokens: 1,248,920 | status: synchronized</code>
              </div>
            </div>

            <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Ready to deploy to E-commerce project memory</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPrdModal(false);
                    onNavigate('project-workspace');
                  }}
                  className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Open in Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
