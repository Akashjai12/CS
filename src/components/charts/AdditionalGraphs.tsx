import React, { useState } from 'react';
import { ModelLogo } from '../ModelLogo';

// ============================================================================
// 1. Throughput Area Chart with Glowing Gradient & Timeframe Switcher
// ============================================================================
export interface ThroughputDataPoint {
  date: string;
  ingested: number;
  generated: number;
  cached: number;
}

export const ThroughputAreaChart: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeMetric, setActiveMetric] = useState<'ingested' | 'generated' | 'all'>('all');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Generate data points according to range
  const count = range === '7d' ? 14 : range === '30d' ? 30 : 60;
  const data: ThroughputDataPoint[] = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(2024, 2, 1);
      d.setDate(d.getDate() + i * (range === '90d' ? 1.5 : 1));
      const base = 40 + Math.sin(i / 3) * 25 + ((i * 11) % 23);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ingested: Math.round(base * 12.4),
        generated: Math.round(base * 6.8 + Math.cos(i / 2) * 15),
        cached: Math.round(base * 4.2),
      };
    });
  }, [count, range]);

  const maxVal = Math.max(...data.map(d => Math.max(d.ingested, d.generated))) * 1.15;
  const width = 800;
  const height = 220;
  const padTop = 15;
  const padBottom = 35;
  const padLeft = 10;
  const padRight = 10;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  // Build SVG path strings
  const getPath = (key: 'ingested' | 'generated') => {
    if (data.length === 0) return '';
    const points = data.map((d, i) => {
      const x = padLeft + (i / (data.length - 1)) * plotW;
      const y = padTop + plotH - (d[key] / maxVal) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${points[0]} ` + points.slice(1).map(p => `L${p}`).join(' ');
  };

  const getArea = (key: 'ingested' | 'generated') => {
    const linePath = getPath(key);
    if (!linePath) return '';
    const bottomY = padTop + plotH;
    const firstX = padLeft;
    const lastX = padLeft + plotW;
    return `${linePath} L${lastX},${bottomY} L${firstX},${bottomY} Z`;
  };

  const hoveredItem = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="flex flex-col w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-headline-md text-on-surface text-base font-bold">Context Throughput &amp; Generation Flow</h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time multi-model context ingestion rates and synthetic token volume
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold">
            {(['7d', '30d', '90d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  range === t 
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="hidden sm:inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold">
            <button
              onClick={() => setActiveMetric('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeMetric === 'all' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant'}`}
            >
              Combined
            </button>
            <button
              onClick={() => setActiveMetric('ingested')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeMetric === 'ingested' ? 'bg-blue-600 text-white shadow-xs' : 'text-on-surface-variant'}`}
            >
              Ingested
            </button>
            <button
              onClick={() => setActiveMetric('generated')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeMetric === 'generated' ? 'bg-purple-600 text-white shadow-xs' : 'text-on-surface-variant'}`}
            >
              Output
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas with Glow Effects */}
      <div 
        className="relative w-full my-4 select-none cursor-crosshair"
        style={{ aspectRatio: '800 / 220' }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            {/* Blue Ingestion Gradient */}
            <linearGradient id="flow-ingest-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.0" />
            </linearGradient>

            {/* Violet Generation Gradient */}
            <linearGradient id="flow-gen-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#A855F7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.0" />
            </linearGradient>

            {/* Neon Line Glow */}
            <filter id="neon-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.6" />
            </filter>
            <filter id="purple-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#9333EA" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
            <line
              key={`h-line-${i}`}
              x1={padLeft}
              y1={padTop + plotH * ratio}
              x2={padLeft + plotW}
              y2={padTop + plotH * ratio}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {/* Ingested Area & Line (Blue) */}
          {(activeMetric === 'all' || activeMetric === 'ingested') && (
            <>
              <path d={getArea('ingested')} fill="url(#flow-ingest-grad)" />
              <path
                d={getPath('ingested')}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neon-glow)"
              />
            </>
          )}

          {/* Generated Area & Line (Purple) */}
          {(activeMetric === 'all' || activeMetric === 'generated') && (
            <>
              <path d={getArea('generated')} fill="url(#flow-gen-grad)" />
              <path
                d={getPath('generated')}
                fill="none"
                stroke="#9333EA"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#purple-glow)"
              />
            </>
          )}

          {/* Interactive Mouse Hit Area columns */}
          {data.map((_, i) => {
            const colW = plotW / data.length;
            const x = padLeft + i * colW;
            return (
              <rect
                key={`hit-${i}`}
                x={x}
                y={padTop}
                width={colW}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
              />
            );
          })}

          {/* Hover Crosshair & Dots */}
          {hoveredIdx !== null && (
            <>
              <line
                x1={padLeft + (hoveredIdx / (data.length - 1)) * plotW}
                y1={padTop}
                x2={padLeft + (hoveredIdx / (data.length - 1)) * plotW}
                y2={padTop + plotH}
                stroke="#64748B"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={padLeft + (hoveredIdx / (data.length - 1)) * plotW}
                cy={padTop + plotH - (data[hoveredIdx].ingested / maxVal) * plotH}
                r="5"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle
                cx={padLeft + (hoveredIdx / (data.length - 1)) * plotW}
                cy={padTop + plotH - (data[hoveredIdx].generated / maxVal) * plotH}
                r="5"
                fill="#9333EA"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </>
          )}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            if (i % Math.ceil(data.length / 8) !== 0 && i !== data.length - 1) return null;
            const x = padLeft + (i / (data.length - 1)) * plotW;
            return (
              <text
                key={`lbl-${i}`}
                x={x}
                y={padTop + plotH + 20}
                fontSize="10"
                textAnchor="middle"
                className="fill-slate-400 font-medium select-none"
              >
                {d.date}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredItem && (
          <div
            className="absolute top-2 pointer-events-none transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-2xl border border-slate-700 text-xs min-w-[150px] z-20"
            style={{
              left: `${(padLeft + (hoveredIdx! / (data.length - 1)) * plotW) / width * 100}%`
            }}
          >
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              {hoveredItem.date}
            </div>
            <div className="flex items-center justify-between gap-3 text-blue-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Ingested:
              </span>
              <span className="font-bold text-white">{(hoveredItem.ingested * 100).toLocaleString()} tks</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-purple-400 font-medium mt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Output:
              </span>
              <span className="font-bold text-white">{(hoveredItem.generated * 100).toLocaleString()} tks</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Stats Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-outline-variant/20 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-blue-600"></span>
            <span className="text-on-surface font-semibold">Context Ingestion</span>
            <span className="text-[11px] text-on-surface-variant">(1.84M tks/day avg)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-purple-600"></span>
            <span className="text-on-surface font-semibold">Generation Output</span>
            <span className="text-[11px] text-on-surface-variant">(720k tks/day avg)</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            +18.4% WoW
          </span>
          <span className="text-slate-300">|</span>
          <span>Cache Efficiency: <strong className="text-on-surface">94.2%</strong></span>
        </div>
      </div>
    </div>
  );
};


// ============================================================================
// 2. Multi-Model Performance Benchmark Chart with Authentic AI Logos
// ============================================================================
export interface ModelBenchmarkData {
  id: string;
  name: string;
  provider: string;
  latencyMs: number;
  tokensPerSec: number;
  contextWindow: string;
  costScore: number;
  highlight?: boolean;
}

export const ModelBenchmarkChart: React.FC = () => {
  const [metric, setMetric] = useState<'latency' | 'speed'>('latency');

  const models: ModelBenchmarkData[] = [
    { id: 'groq', name: 'Llama 3.1 70B (Groq LPU)', provider: 'Groq', latencyMs: 140, tokensPerSec: 280, contextWindow: '128k', costScore: 95, highlight: true },
    { id: 'deepseek', name: 'DeepSeek V3', provider: 'DeepSeek', latencyMs: 240, tokensPerSec: 120, contextWindow: '128k', costScore: 98, highlight: true },
    { id: 'gemini', name: 'Gemini 2.0 Flash', provider: 'Google Vertex', latencyMs: 280, tokensPerSec: 165, contextWindow: '1M', costScore: 92 },
    { id: 'openai', name: 'GPT-4o', provider: 'OpenAI', latencyMs: 380, tokensPerSec: 92, contextWindow: '128k', costScore: 80 },
    { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', latencyMs: 440, tokensPerSec: 78, contextWindow: '200k', costScore: 84 },
    { id: 'mistral', name: 'Mistral Large 2', provider: 'Mistral AI', latencyMs: 390, tokensPerSec: 85, contextWindow: '128k', costScore: 88 },
    { id: 'cohere', name: 'Command R+', provider: 'Cohere', latencyMs: 490, tokensPerSec: 72, contextWindow: '128k', costScore: 78 },
    { id: 'meta', name: 'Llama 3.1 405B', provider: 'Meta AI', latencyMs: 560, tokensPerSec: 64, contextWindow: '128k', costScore: 85 },
  ];

  const maxVal = metric === 'latency' ? 650 : 320;

  return (
    <div className="flex flex-col w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
            <h3 className="font-headline-md text-on-surface text-base font-bold">Multi-Model Routing Benchmarks</h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time latency (TTFT) and inference throughput across connected AI providers
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setMetric('latency')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'latency' 
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Response Latency (ms)
          </button>
          <button
            onClick={() => setMetric('speed')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'speed' 
                ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Speed (tokens/sec)
          </button>
        </div>
      </div>

      {/* Model Benchmark Horizontal Bars */}
      <div className="space-y-3.5 my-4">
        {models.map((m) => {
          const val = metric === 'latency' ? m.latencyMs : m.tokensPerSec;
          const pct = Math.min(100, Math.max(12, (val / maxVal) * 100));

          return (
            <div key={m.id} className="flex flex-col sm:flex-row sm:items-center gap-2 group hover:bg-surface-container-low/50 p-2 rounded-xl transition-colors">
              {/* Model Header with Proper Brand Logo */}
              <div className="flex items-center gap-3 w-56 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center p-1.5 shadow-xs border border-outline-variant/30 group-hover:scale-105 transition-transform">
                  <ModelLogo model={m.id} className="w-5 h-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-on-surface truncate">{m.name}</span>
                    {m.highlight && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-primary-container text-on-primary-container font-extrabold uppercase">
                        Fast
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant">{m.provider} • {m.contextWindow}</span>
                </div>
              </div>

              {/* Progress Track & Animated Bar */}
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-3.5 bg-surface-container-low rounded-full overflow-hidden relative border border-outline-variant/20">
                  <div
                    className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                      metric === 'latency'
                        ? val < 300 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                          : val < 450 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-400' 
                            : 'bg-gradient-to-r from-amber-500 to-rose-400'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  >
                    {/* Animated Shimmer Stripe */}
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>

                <div className="w-20 text-right flex-shrink-0">
                  <span className="text-xs font-extrabold text-on-surface">
                    {val} {metric === 'latency' ? 'ms' : 't/s'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
        <span>💡 Lower latency is better for real-time interaction; higher tokens/sec is better for batch generation.</span>
        <span className="text-primary font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          Live benchmarks refreshed 30s ago
        </span>
      </div>
    </div>
  );
};


// ============================================================================
// 3. Context Cache & Memory Health Radial Breakdown Graph
// ============================================================================
export const ContextCacheRadarChart: React.FC = () => {
  const tiers = [
    { label: 'L1 KV Cache (Instant RAM)', pct: 88.4, color: '#2563EB', desc: '< 2ms latency' },
    { label: 'L2 Vector Memory Graph', pct: 9.2, color: '#9333EA', desc: '14ms semantic recall' },
    { label: 'L3 Cold Provider Fallback', pct: 2.4, color: '#F59E0B', desc: 'Full API dispatch' },
  ];

  return (
    <div className="flex flex-col w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
        <div>
          <h3 className="font-headline-md text-on-surface text-base font-bold">Context Cache &amp; Vector Density</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Tiered memory hierarchy distribution and cost reduction ratios
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
          97.6% Cache Hit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
        {/* Radial Arc SVG Gauge */}
        <div className="md:col-span-5 flex items-center justify-center relative">
          <svg viewBox="0 0 160 160" className="w-44 h-44 transform -rotate-90">
            {/* Background Ring */}
            <circle cx="80" cy="80" r="60" stroke="#F1F5F9" strokeWidth="16" fill="transparent" />
            
            {/* Tier 1 Ring (Blue) */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#2563EB"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${(88.4 / 100) * 377} 377`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />

            {/* Tier 2 Ring (Purple) */}
            <circle
              cx="80"
              cy="80"
              r="44"
              stroke="#9333EA"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${(65 / 100) * 276} 276`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-2xl font-extrabold text-on-surface">4.2M</span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Cached Tokens</span>
          </div>
        </div>

        {/* Tier Details */}
        <div className="md:col-span-7 space-y-3.5">
          {tiers.map((t, i) => (
            <div key={i} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-md" style={{ backgroundColor: t.color }}></span>
                <div>
                  <span className="text-xs font-bold text-on-surface block">{t.label}</span>
                  <span className="text-[11px] text-on-surface-variant">{t.desc}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-on-surface">{t.pct}%</span>
                <span className="text-[10px] text-emerald-600 block font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
        <span>Estimated monthly API cost saved by caching: <strong className="text-emerald-700 font-bold">$1,420.00</strong></span>
        <button className="text-primary font-bold hover:underline">Configure Memory Tiers →</button>
      </div>
    </div>
  );
};
