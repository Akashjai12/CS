import React, { createContext, useContext, useState, useRef } from 'react';

export interface BarChartItem {
  [key: string]: any;
}

export interface BarChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface ChartContextValue {
  data: BarChartItem[];
  xDataKey: string;
  margin: BarChartMargin;
  aspectRatio: string | number;
  barGap: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  hoveredItem: BarChartItem | null;
  hoverCoords: { x: number; y: number } | null;
  setHoverCoords: (coords: { x: number; y: number } | null) => void;
  maxValue: number;
  minValue: number;
  chartWidth: number;
  chartHeight: number;
  activeDataKey: string;
  setActiveDataKey: (key: string) => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export interface BarChartProps {
  data: BarChartItem[];
  aspectRatio?: string | number;
  barGap?: number;
  margin?: Partial<BarChartMargin>;
  xDataKey?: string;
  className?: string;
  children: React.ReactNode;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  aspectRatio = "4 / 1",
  barGap = 0.1,
  margin = { top: 8, right: 8, bottom: 40, left: 8 },
  xDataKey = "day",
  className = "",
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [activeDataKey, setActiveDataKey] = useState<string>('value');

  // Parse aspect ratio
  let ratioNumber = 4;
  if (typeof aspectRatio === 'number') {
    ratioNumber = aspectRatio;
  } else if (typeof aspectRatio === 'string' && aspectRatio.includes('/')) {
    const [w, h] = aspectRatio.split('/').map(s => parseFloat(s.trim()));
    if (w && h) ratioNumber = w / h;
  }

  const resolvedMargin: BarChartMargin = {
    top: margin.top ?? 8,
    right: margin.right ?? 8,
    bottom: margin.bottom ?? 40,
    left: margin.left ?? 8,
  };

  const chartWidth = 900;
  const chartHeight = Math.round(chartWidth / ratioNumber);

  // Compute min and max
  let maxValue = 0;
  let minValue = 0;
  if (data && data.length > 0) {
    const values = data.map(d => typeof d[activeDataKey] === 'number' ? d[activeDataKey] : 0);
    maxValue = Math.max(...values, 10);
    minValue = Math.min(0, ...values);
  }

  const hoveredItem = hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : null;

  return (
    <ChartContext.Provider
      value={{
        data,
        xDataKey,
        margin: resolvedMargin,
        aspectRatio,
        barGap,
        hoveredIndex,
        setHoveredIndex,
        hoveredItem,
        hoverCoords,
        setHoverCoords,
        maxValue,
        minValue,
        chartWidth,
        chartHeight,
        activeDataKey,
        setActiveDataKey,
      }}
    >
      <div 
        ref={containerRef}
        className={`relative w-full overflow-hidden select-none ${className}`}
        style={{ aspectRatio: typeof aspectRatio === 'string' ? aspectRatio : `${aspectRatio} / 1` }}
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Primary Bar Gradient */}
            <linearGradient id="bar-gradient-primary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
            </linearGradient>

            {/* Hovered Bar Gradient (Vibrant Cyan-Blue with specular sheen) */}
            <linearGradient id="bar-gradient-hover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="1" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.75" />
            </linearGradient>

            {/* Glowing Drop Shadow Filter for Hovered Bar */}
            <filter id="bar-hover-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="-2" stdDeviation="4" floodColor="#0066FF" floodOpacity="0.4" />
            </filter>
          </defs>

          {children}
        </svg>
      </div>
    </ChartContext.Provider>
  );
};

// ==========================================
// Subcomponent: Grid
// ==========================================
export interface GridProps {
  horizontal?: boolean;
  vertical?: boolean;
  stroke?: string;
  strokeDasharray?: string;
}

export const Grid: React.FC<GridProps> = ({
  horizontal = true,
  vertical = false,
  stroke = "currentColor",
  strokeDasharray = "3 3"
}) => {
  const ctx = useContext(ChartContext);
  if (!ctx) return null;

  const { chartWidth, chartHeight, margin } = ctx;
  const plotTop = margin.top;
  const plotBottom = chartHeight - margin.bottom;
  const plotLeft = margin.left;
  const plotRight = chartWidth - margin.right;
  const plotHeight = plotBottom - plotTop;

  const steps = 4;
  const lines: number[] = [];
  for (let i = 0; i <= steps; i++) {
    lines.push(plotTop + (plotHeight * (i / steps)));
  }

  return (
    <g className="chart-grid text-slate-200 dark:text-slate-700/60" opacity={0.8}>
      {horizontal && lines.map((y, idx) => (
        <line
          key={`h-grid-${idx}`}
          x1={plotLeft}
          y1={y}
          x2={plotRight}
          y2={y}
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray={idx === steps ? undefined : strokeDasharray}
          opacity={idx === steps ? 0.9 : 0.6}
        />
      ))}
    </g>
  );
};

// ==========================================
// Subcomponent: Bar
// ==========================================
export interface BarProps {
  dataKey?: string;
  lineCap?: 'butt' | 'round' | 'square';
  fill?: string;
  hoverFill?: string;
  radius?: number;
}

export const Bar: React.FC<BarProps> = ({
  dataKey = 'value',
  lineCap = 'butt',
  fill,
  hoverFill,
  radius = 2
}) => {
  const ctx = useContext(ChartContext);
  if (!ctx) return null;

  const {
    data,
    margin,
    chartWidth,
    chartHeight,
    barGap,
    maxValue,
    minValue,
    hoveredIndex,
    setHoveredIndex,
    setHoverCoords
  } = ctx;

  const plotTop = margin.top;
  const plotBottom = chartHeight - margin.bottom;
  const plotLeft = margin.left;
  const plotRight = chartWidth - margin.right;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const totalSlots = data.length;
  if (totalSlots === 0) return null;

  const slotWidth = plotWidth / totalSlots;
  const barWidth = Math.max(1.5, slotWidth * (1 - barGap));
  const innerGap = (slotWidth - barWidth) / 2;

  const valRange = maxValue - minValue || 1;

  return (
    <g className="chart-bars">
      {data.map((item, idx) => {
        const val = typeof item[dataKey] === 'number' ? item[dataKey] : 0;
        const normalizedH = Math.max(2, ((val - minValue) / valRange) * plotHeight);
        const x = plotLeft + (idx * slotWidth) + innerGap;
        const y = plotBottom - normalizedH;
        const isHovered = hoveredIndex === idx;

        return (
          <g
            key={`bar-${idx}`}
            className="cursor-pointer transition-all"
            onMouseEnter={(e) => {
              setHoveredIndex(idx);
              const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
              setHoverCoords({ x: rect.x + rect.width / 2, y: rect.y });
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              setHoverCoords(null);
            }}
          >
            {/* Invisible expanded hit target for smooth mobile & mouse hover */}
            <rect
              x={plotLeft + (idx * slotWidth)}
              y={plotTop}
              width={slotWidth}
              height={plotHeight}
              fill="transparent"
            />

            {/* Hover Column Guide Shadow */}
            {isHovered && (
              <rect
                x={plotLeft + (idx * slotWidth)}
                y={plotTop}
                width={slotWidth}
                height={plotHeight}
                fill="currentColor"
                className="text-blue-500/10"
              />
            )}

            {/* Actual Rendered Data Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={normalizedH}
              rx={lineCap === 'round' ? barWidth / 2 : radius}
              fill={isHovered 
                ? (hoverFill || "url(#bar-gradient-hover)") 
                : (fill || "url(#bar-gradient-primary)")}
              filter={isHovered ? "url(#bar-hover-glow)" : undefined}
              className="transition-all duration-100 ease-out"
            />
          </g>
        );
      })}
    </g>
  );
};

// ==========================================
// Subcomponent: BarXAxis
// ==========================================
export interface BarXAxisProps {
  maxLabels?: number;
  className?: string;
  fontSize?: number;
}

export const BarXAxis: React.FC<BarXAxisProps> = ({
  maxLabels = 8,
  className = "text-[11px] font-medium text-slate-400 fill-current",
  fontSize = 10
}) => {
  const ctx = useContext(ChartContext);
  if (!ctx) return null;

  const { data, margin, chartWidth, chartHeight, xDataKey } = ctx;
  const plotLeft = margin.left;
  const plotRight = chartWidth - margin.right;
  const plotWidth = plotRight - plotLeft;
  const plotBottom = chartHeight - margin.bottom;

  const total = data.length;
  if (total === 0) return null;

  // Calculate label step to respect maxLabels
  const step = Math.max(1, Math.floor(total / (maxLabels - 1)));
  const labelIndices: number[] = [];
  for (let i = 0; i < total; i += step) {
    labelIndices.push(i);
  }
  // Ensure the last item is represented
  if (labelIndices[labelIndices.length - 1] !== total - 1) {
    labelIndices.push(total - 1);
  }

  const slotWidth = plotWidth / total;

  return (
    <g className="chart-x-axis">
      {labelIndices.map((idx) => {
        const item = data[idx];
        const labelText = item ? item[xDataKey] : '';
        const x = plotLeft + (idx * slotWidth) + slotWidth / 2;
        const y = plotBottom + 18;

        return (
          <text
            key={`x-label-${idx}`}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize={fontSize}
            className={className}
          >
            {labelText}
          </text>
        );
      })}
    </g>
  );
};

// ==========================================
// Subcomponent: ChartTooltip
// ==========================================
export interface ChartTooltipProps {
  renderContent?: (item: BarChartItem) => React.ReactNode;
  unit?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  renderContent,
  unit = "tokens"
}) => {
  const ctx = useContext(ChartContext);
  if (!ctx || ctx.hoveredIndex === null || !ctx.hoveredItem) return null;

  const {
    hoveredIndex,
    hoveredItem,
    data,
    margin,
    chartWidth,
    chartHeight,
    xDataKey,
    activeDataKey
  } = ctx;

  const plotLeft = margin.left;
  const plotRight = chartWidth - margin.right;
  const plotWidth = plotRight - plotLeft;
  const slotWidth = plotWidth / data.length;

  const activeX = plotLeft + (hoveredIndex * slotWidth) + slotWidth / 2;
  const pctX = (activeX / chartWidth) * 100;
  
  const val = hoveredItem[activeDataKey] ?? 0;
  const day = hoveredItem[xDataKey] ?? `Day ${hoveredIndex + 1}`;

  return (
    <foreignObject
      x={0}
      y={0}
      width="100%"
      height="100%"
      className="pointer-events-none overflow-visible"
    >
      <div 
        className="absolute top-2 transition-all duration-75 pointer-events-none transform -translate-x-1/2"
        style={{ left: `${pctX}%` }}
      >
        {renderContent ? (
          renderContent(hoveredItem)
        ) : (
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col items-center gap-1 min-w-[110px]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {day}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-sm text-cyan-400">
                {val.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                {unit}
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping mt-0.5"></div>
          </div>
        )}
      </div>
    </foreignObject>
  );
};
