import React, { useState } from 'react';
import { ScreenId, ProjectItem, UserProfile } from '../../types';
import { INITIAL_PROJECTS } from '../../data/mockData';
import { BarChart, Grid, Bar, BarXAxis, ChartTooltip } from '../charts/BarChart';
import { ThroughputAreaChart, ModelBenchmarkChart, ContextCacheRadarChart } from '../charts/AdditionalGraphs';
import { ModelLogo } from '../ModelLogo';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenNewProject: () => void;
  onSelectProject: (project: ProjectItem) => void;
  user?: UserProfile;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenNewProject,
  onSelectProject,
  user
}) => {
  const [telemetryLive, setTelemetryLive] = useState(true);
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'daily' | 'throughput' | 'benchmark' | 'cache'>('daily');

  // User-provided dailyData definition for 90-day activity BarChart
  const dailyData = React.useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => {
      const date = new Date(2024, 0, 1);
      date.setDate(date.getDate() + i);
      return {
        day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: Math.floor(50 + Math.sin(i / 7) * 30 + ((i * 7) % 37) - 18),
      };
    });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-1">
            <span>Production Workspace</span>
            <span>/</span>
            <span>Overview</span>
            {user && (
              <>
                <span>•</span>
                <span className="font-mono text-blue-600 font-semibold">{user.email}</span>
              </>
            )}
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold text-[10px] uppercase tracking-wider ml-1">
              {user?.plan || 'Pro'} Plan
            </span>
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">
            Workspace Dashboard
          </h1>
          <p className="text-on-surface-variant font-body-md mt-1">
            {user ? `Logged in as ${user.name}. ` : ''}Global context orchestration, active model benchmarks, and connected project memory graphs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('project-workspace')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">terminal</span>
            <span>Quick Context</span>
            <kbd className="text-[10px] font-mono bg-surface-container px-1 py-0.5 rounded text-on-surface-variant">⌘K</kbd>
          </button>

          <button
            onClick={() => onNavigate('project-workspace')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>New Chat</span>
          </button>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Total Active Context</span>
            <span className="material-symbols-outlined text-primary text-[20px]">memory</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-on-surface tracking-tight">4.2M</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">Tokens</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-primary font-medium">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+12% this week</span>
            <span className="text-on-surface-variant ml-auto">32 Project nodes cached</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('credentials')}
          className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between cursor-pointer hover:border-secondary/40 transition-colors"
          title="Manage API Tokens & Models"
        >
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Integrated Models</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">neurology</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-on-surface tracking-tight">6</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">Active</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-primary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>All providers healthy</span>
            <span className="text-on-surface-variant ml-auto">99.9% routing uptime</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Context Ingestions</span>
            <span className="material-symbols-outlined text-tertiary-container text-[20px]">dataset</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-on-surface tracking-tight">1,842</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">Files</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[14px] text-secondary">sync</span>
            <span>28 repos synced</span>
            <span className="text-primary ml-auto font-semibold">Git webhook active</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Avg Query Latency</span>
            <span className="material-symbols-outlined text-secondary-container text-[20px]">speed</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-on-surface tracking-tight">420</span>
            <span className="text-xs text-on-surface-variant ml-1 font-medium">ms</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-primary font-medium">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>-45ms optimization</span>
            <span className="text-on-surface-variant ml-auto">Dynamic tier active</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Interactive Analytics Suite & Quick Context Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Comprehensive Analytics & Visualizations */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          {/* Header & Visualization Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                <h2 className="font-headline-md text-on-surface text-lg font-bold">Context Telemetry &amp; Analytics</h2>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                90-day activity tracking, multi-model benchmarks, and vector cache efficiency
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab Selector */}
              <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveAnalyticsTab('daily')}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeAnalyticsTab === 'daily'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  90-Day Activity
                </button>
                <button
                  onClick={() => setActiveAnalyticsTab('throughput')}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeAnalyticsTab === 'throughput'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Throughput Flow
                </button>
                <button
                  onClick={() => setActiveAnalyticsTab('benchmark')}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeAnalyticsTab === 'benchmark'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Model Speeds
                </button>
                <button
                  onClick={() => setActiveAnalyticsTab('cache')}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeAnalyticsTab === 'cache'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Vector Cache
                </button>
              </div>

              <button
                onClick={() => setTelemetryLive(!telemetryLive)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer ${
                  telemetryLive 
                    ? 'bg-primary-container/20 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant text-on-surface-variant'
                }`}
                title="Toggle Real-Time Stream"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${telemetryLive ? 'bg-primary animate-pulse' : 'bg-slate-400'}`}></span>
                <span>{telemetryLive ? 'Live Stream' : 'Paused'}</span>
              </button>
            </div>
          </div>

          {/* Active Visualization View */}
          <div className="my-4">
            {activeAnalyticsTab === 'daily' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 90-Day Context Ingestion Stats Summary */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-low/60 p-3.5 rounded-xl border border-outline-variant/20 text-xs">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">90-Day Token Volume</span>
                      <span className="text-base font-extrabold text-on-surface">5,842,910 tokens</span>
                    </div>
                    <div className="w-px h-7 bg-outline-variant/30 hidden sm:block"></div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Daily Mean</span>
                      <span className="text-base font-extrabold text-primary">64,921 / day</span>
                    </div>
                    <div className="w-px h-7 bg-outline-variant/30 hidden sm:block"></div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Active Ingestion Days</span>
                      <span className="text-base font-extrabold text-secondary">90 / 90 (100%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-on-surface-variant text-[11px] ml-auto">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span>Hover over any bar to inspect date &amp; volume</span>
                  </div>
                </div>

                {/* The Requested BarChart Component */}
                <div className="w-full bg-surface-container-low/30 rounded-xl p-3 border border-outline-variant/20 shadow-inner">
                  <BarChart aspectRatio="4 / 1" barGap={0.1} data={dailyData} margin={{ top: 8, right: 8, bottom: 40, left: 8 }} xDataKey="day">
                    <Grid horizontal />
                    <Bar dataKey="value" lineCap="butt" />
                    <BarXAxis maxLabels={8} />
                    <ChartTooltip />
                  </BarChart>
                </div>
              </div>
            )}

            {activeAnalyticsTab === 'throughput' && (
              <div className="animate-in fade-in duration-200">
                <ThroughputAreaChart />
              </div>
            )}

            {activeAnalyticsTab === 'benchmark' && (
              <div className="animate-in fade-in duration-200">
                <ModelBenchmarkChart />
              </div>
            )}

            {activeAnalyticsTab === 'cache' && (
              <div className="animate-in fade-in duration-200">
                <ContextCacheRadarChart />
              </div>
            )}
          </div>

          {/* Model Latency Metrics Footnotes with Authentic Model Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-outline-variant/20">
            <div className="p-2.5 rounded-xl bg-surface-container-low text-left flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center p-1 border border-outline-variant/20 flex-shrink-0">
                <ModelLogo model="openai" className="w-4 h-4 text-slate-900" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block truncate">GPT-4o</span>
                <span className="text-xs font-extrabold text-on-surface">380 ms</span>
                <span className="text-[9px] text-primary block">Avg Response</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low text-left flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center p-1 border border-outline-variant/20 flex-shrink-0">
                <ModelLogo model="claude" className="w-4 h-4 text-amber-700" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block truncate">Claude 3.5</span>
                <span className="text-xs font-extrabold text-on-surface">440 ms</span>
                <span className="text-[9px] text-secondary block">Avg Response</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low text-left flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center p-1 border border-outline-variant/20 flex-shrink-0">
                <ModelLogo model="gemini" className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block truncate">Gemini 2.0</span>
                <span className="text-xs font-extrabold text-on-surface">280 ms</span>
                <span className="text-[9px] text-amber-600 block">Flash Speed</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low text-left flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center p-1 border border-outline-variant/20 flex-shrink-0">
                <ModelLogo model="deepseek" className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block truncate">DeepSeek V3</span>
                <span className="text-xs font-extrabold text-on-surface">240 ms</span>
                <span className="text-[9px] text-emerald-600 block">128k Context</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Context Actions */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-headline-md text-on-surface">Quick Context Actions</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Accelerate your workflow with one click</p>

            <div className="mt-4 space-y-2.5">
              <div 
                onClick={() => onNavigate('project-workspace')}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3 border border-outline-variant/20"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">forum</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Multi-Model Chat</h3>
                  <p className="text-[11px] text-on-surface-variant">Query across 3 models simultaneously</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] ml-auto">arrow_forward</span>
              </div>

              <div 
                onClick={() => alert('GitHub AST Importer:\nConnected to github.com/context-studio/context-core\nReady to parse 324 files.')}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3 border border-outline-variant/20"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">code_blocks</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Ingest GitHub Repo / Docs</h3>
                  <p className="text-[11px] text-on-surface-variant">Parse AST &amp; vector embeddings</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] ml-auto">arrow_forward</span>
              </div>

              <div 
                onClick={() => alert('Context Snapshot exported:\nsnapshot_context_2024.json (1.8MB) downloaded.')}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3 border border-outline-variant/20"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">file_download</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Export Context Snapshot</h3>
                  <p className="text-[11px] text-on-surface-variant">Download portable memory graph</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] ml-auto">arrow_forward</span>
              </div>

              <div 
                onClick={() => onNavigate('audit-logs')}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3 border border-outline-variant/20"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Audit Token Usage</h3>
                  <p className="text-[11px] text-on-surface-variant">Review per-model compute billing</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] ml-auto">arrow_forward</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-secondary-fixed/30 border border-secondary-fixed text-[11px] text-on-secondary-fixed flex items-center justify-between">
            <span>Dynamic Model Cascade is ON</span>
            <button 
              onClick={() => onNavigate('settings')}
              className="text-secondary font-bold underline hover:no-underline cursor-pointer"
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Active Projects & Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Projects List */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
            <div>
              <h2 className="font-headline-md text-on-surface">Active Projects</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Shared memory graphs across active development scopes</p>
            </div>
            <button
              onClick={onOpenNewProject}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>New Project</span>
            </button>
          </div>

          <div className="divide-y divide-outline-variant/20 mt-2">
            {INITIAL_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onNavigate('project-workspace');
                }}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low/60 px-3 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                    <span className={`material-symbols-outlined ${proj.iconColor} text-[22px]`}>
                      {proj.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                        {proj.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${proj.categoryBadgeClass}`}>
                        {proj.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
                      <span>Models: {proj.models.join(', ')}</span>
                      <span>•</span>
                      <span>{proj.updatedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-12 sm:pl-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-on-surface block">{proj.tokensUsed}</span>
                    <div className="w-24 bg-surface-container rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${proj.tokenPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors text-[20px]">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center text-xs text-on-surface-variant">
            <span>Showing 4 of 14 active projects</span>
            <button 
              onClick={() => onNavigate('project-workspace')}
              className="text-secondary font-bold hover:underline cursor-pointer"
            >
              View all 14 projects →
            </button>
          </div>
        </div>

        {/* Right: Recent Activity & Model Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Activity */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-headline-md text-on-surface text-sm">Recent Activity</h3>
              <button 
                onClick={() => onNavigate('audit-logs')}
                className="text-[11px] text-secondary font-semibold hover:underline cursor-pointer"
              >
                View Audit
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">bolt</span>
                <div>
                  <p className="text-on-surface font-medium">Batch inference completed (2,410 tokens)</p>
                  <span className="text-[10px] text-on-surface-variant">14m ago • E-commerce Platform</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">description</span>
                <div>
                  <p className="text-on-surface font-medium">PRD generated via Claude 3.5 Sonnet</p>
                  <span className="text-[10px] text-on-surface-variant">32m ago • E-commerce Platform</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-tertiary-container text-[18px] shrink-0 mt-0.5">sync</span>
                <div>
                  <p className="text-on-surface font-medium">Vector store re-indexed (12 files)</p>
                  <span className="text-[10px] text-on-surface-variant">1h ago • Mobile App Redesign</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">autorenew</span>
                <div>
                  <p className="text-on-surface font-medium">Google Vertex AI envelope key rotated</p>
                  <span className="text-[10px] text-on-surface-variant">2h ago • Automated Lifecycle</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Health & Status */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <h3 className="font-headline-md text-on-surface text-sm mb-3">Model Health &amp; Status</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-on-surface">OpenAI API</span>
                <span className="text-primary font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 99.98%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-on-surface">Anthropic API</span>
                <span className="text-primary font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 99.95%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-on-surface">Google Vertex AI</span>
                <span className="text-primary font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 100.0%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-on-surface">Local Ollama Node</span>
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 99.4%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
