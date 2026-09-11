import React from 'react';

interface ContextLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const ContextLogo: React.FC<ContextLogoProps> = ({ 
  className = "w-8 h-8", 
  size,
  showText = false 
}) => {
  const dimension = size ? `${size}px` : undefined;

  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? '' : 'justify-center'}`}>
      <img
        src="/logo.svg"
        alt="Brand Logo"
        referrerPolicy="no-referrer"
        className={`object-contain select-none shrink-0 ${className}`}
        style={dimension ? { width: dimension, height: dimension } : undefined}
      />

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className="font-bold text-[16px] text-slate-900 tracking-tight">
            Context <span className="text-blue-600">Studio</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Multi-Model AI
          </span>
        </div>
      )}
    </div>
  );
};
