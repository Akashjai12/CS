/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, ProjectItem, UserProfile } from './types';
import { INITIAL_PROJECTS, DEFAULT_USER_PROFILE } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ViewSwitcher } from './components/ViewSwitcher';
import { LandingScreen } from './components/screens/LandingScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { CredentialsScreen } from './components/screens/CredentialsScreen';
import { AuditLogsScreen } from './components/screens/AuditLogsScreen';
import { CreateProjectModal } from './components/screens/CreateProjectModal';
import { ProjectWorkspaceScreen } from './components/screens/ProjectWorkspaceScreen';
import { LoginModal } from './components/auth/LoginModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<ProjectItem>(INITIAL_PROJECTS[0]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // User Profile state with local storage hydration
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('context_studio_user_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user profile from storage', e);
    }
    return DEFAULT_USER_PROFILE;
  });

  const handleUpdateUser = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      localStorage.setItem('context_studio_user_profile', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save user profile to storage', e);
    }
  };

  const handleSignOut = () => {
    setCurrentScreen('landing');
  };

  // Handle keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsNewProjectModalOpen(false);
        setIsLoginModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProjectCreated = (newProject: ProjectItem) => {
    setProjects([newProject, ...projects]);
    setActiveProject(newProject);
    setCurrentScreen('project-workspace');
  };

  const isWorkspaceView = currentScreen !== 'landing';

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-blue-100 selection:text-blue-900">
      {isWorkspaceView ? (
        <div className="flex">
          {/* Fixed Workspace Sidebar */}
          <Sidebar 
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen}
            user={userProfile}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />

          {/* Fixed Workspace Top Header */}
          <TopHeader 
            onNavigate={setCurrentScreen} 
            onOpenQuickSearch={() => setIsCommandPaletteOpen(true)}
            user={userProfile}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onSignOut={handleSignOut}
          />

          {/* Main Content Area */}
          <main className="pl-64 pt-16 min-h-screen w-full bg-surface">
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                onNavigate={setCurrentScreen}
                onOpenNewProject={() => setIsNewProjectModalOpen(true)}
                onSelectProject={(p) => {
                  setActiveProject(p);
                  setCurrentScreen('project-workspace');
                }}
                user={userProfile}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen 
                onNavigate={setCurrentScreen} 
                user={userProfile}
                onUpdateUser={handleUpdateUser}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
              />
            )}

            {currentScreen === 'credentials' && (
              <CredentialsScreen onNavigate={setCurrentScreen} />
            )}

            {currentScreen === 'audit-logs' && (
              <AuditLogsScreen onNavigate={setCurrentScreen} />
            )}

            {currentScreen === 'project-workspace' && (
              <ProjectWorkspaceScreen
                project={activeProject}
                onNavigate={setCurrentScreen}
                onOpenNewProject={() => setIsNewProjectModalOpen(true)}
              />
            )}
          </main>
        </div>
      ) : (
        /* Public Landing Page Screen */
        <LandingScreen
          onNavigate={setCurrentScreen}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          user={userProfile}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* Global Quick Screen Switcher Dock */}
      <ViewSwitcher
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Login & Switch Account Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={userProfile}
        onLoginSuccess={handleUpdateUser}
      />

      {/* Quick Context & Command Palette Modal (⌘K) */}
      {isCommandPaletteOpen && (
        <div 
          onClick={() => setIsCommandPaletteOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              <input
                autoFocus
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Type a command, project, or screen name..."
                className="w-full text-xs text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
              />
              <kbd className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">ESC</kbd>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
              <div className="py-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 block">
                  Screens &amp; Views
                </span>
                <button
                  onClick={() => { setCurrentScreen('landing'); setIsCommandPaletteOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-600">web</span>
                  <span>Public Landing Page</span>
                </button>
                <button
                  onClick={() => { setCurrentScreen('dashboard'); setIsCommandPaletteOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">dashboard</span>
                  <span>Workspace Dashboard</span>
                </button>
                <button
                  onClick={() => { setCurrentScreen('settings'); setIsCommandPaletteOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-600">settings</span>
                  <span>Settings &amp; Preferences</span>
                </button>
                <button
                  onClick={() => { setCurrentScreen('credentials'); setIsCommandPaletteOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-600">key</span>
                  <span>API Tokens &amp; Credentials</span>
                </button>
                <button
                  onClick={() => { setCurrentScreen('audit-logs'); setIsCommandPaletteOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-purple-600">timeline</span>
                  <span>API Audit Activity Stream</span>
                </button>
              </div>

              <div className="py-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 block">
                  Quick Actions
                </span>
                <button
                  onClick={() => { setIsCommandPaletteOpen(false); setIsNewProjectModalOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">add_box</span>
                  <span>Create New Project</span>
                </button>
                <button
                  onClick={() => { setCurrentScreen('project-workspace'); setIsCommandPaletteOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium text-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-600">forum</span>
                  <span>Open E-commerce Platform Workspace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
