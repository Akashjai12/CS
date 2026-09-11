import React from 'react';

export type SupportedModelId = 
  | 'openai' 
  | 'gpt-4o' 
  | 'gpt-4' 
  | 'o1' 
  | 'o3-mini'
  | 'claude' 
  | 'claude-3-5' 
  | 'anthropic' 
  | 'gemini' 
  | 'gemini-1-5' 
  | 'gemini-2-0' 
  | 'google' 
  | 'llama' 
  | 'meta' 
  | 'mistral' 
  | 'codestral'
  | 'deepseek' 
  | 'deepseek-r1'
  | 'perplexity' 
  | 'groq' 
  | 'cohere' 
  | 'qwen';

interface ModelLogoProps {
  model: string;
  className?: string;
  size?: number;
}

export const ModelLogo: React.FC<ModelLogoProps> = ({ model, className = 'w-6 h-6', size }) => {
  const normalized = model.toLowerCase().replace(/[^a-z0-9]/g, '');
  const dimension = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  // OpenAI (GPT-4o, o1, etc.)
  if (normalized.includes('openai') || normalized.includes('gpt') || normalized.includes('o1') || normalized.includes('o3')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={dimension}
        aria-label="OpenAI"
      >
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1636a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813v6.7227zm1.1458-1.6706l3.69-2.1288 3.69 2.1288v4.2575l-3.69 2.1288-3.69-2.1288z" />
      </svg>
    );
  }

  // Anthropic Claude (Asterisk Sun)
  if (normalized.includes('claude') || normalized.includes('anthropic')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={dimension}
        aria-label="Anthropic Claude"
      >
        <path d="M12.923 2.25a.923.923 0 0 0-1.846 0v4.296l-3.038-3.038a.923.923 0 0 0-1.306 1.306l3.038 3.038H5.475a.923.923 0 0 0 0 1.846h4.296l-3.038 3.038a.923.923 0 0 0 1.306 1.306l3.038-3.038v4.296a.923.923 0 0 0 1.846 0v-4.296l3.038 3.038a.923.923 0 0 0 1.306-1.306l-3.038-3.038h4.296a.923.923 0 0 0 0-1.846h-4.296l3.038-3.038a.923.923 0 0 0-1.306-1.306l-3.038 3.038V2.25z" />
      </svg>
    );
  }

  // Google Gemini (Four-point star gradient)
  if (normalized.includes('gemini') || normalized.includes('google') || normalized.includes('vertex')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={dimension}
        aria-label="Google Gemini"
      >
        <defs>
          <linearGradient id="gemini-star-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1A73E8" />
            <stop offset="40%" stopColor="#8AB4F8" />
            <stop offset="70%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        <path
          d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
          fill="url(#gemini-star-grad)"
        />
      </svg>
    );
  }

  // Meta Llama (Infinity Ribbon)
  if (normalized.includes('llama') || normalized.includes('meta')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={dimension}
        aria-label="Meta Llama"
      >
        <path
          d="M18.178 8c5.096 0 5.096 8 0 8-2.604 0-4.48-2.5-6.178-5.5C10.302 7.5 8.426 5 5.822 5 .726 5 .726 13 5.822 13c2.604 0 4.48-2.5 6.178-5.5 1.698 3 3.574 5.5 6.178 5.5z"
          stroke="#0064E0"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Mistral AI (Pixelated staircase M)
  if (normalized.includes('mistral') || normalized.includes('codestral')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={dimension}
        aria-label="Mistral AI"
      >
        {/* Authentic Mistral Pixel Blocks */}
        <rect x="2" y="4" width="4" height="4" rx="0.5" fill="#FA520F" />
        <rect x="18" y="4" width="4" height="4" rx="0.5" fill="#FA520F" />
        
        <rect x="2" y="8" width="4" height="4" rx="0.5" fill="#FA520F" />
        <rect x="6" y="8" width="4" height="4" rx="0.5" fill="#FF8300" />
        <rect x="14" y="8" width="4" height="4" rx="0.5" fill="#FF8300" />
        <rect x="18" y="8" width="4" height="4" rx="0.5" fill="#FA520F" />
        
        <rect x="2" y="12" width="4" height="4" rx="0.5" fill="#FA520F" />
        <rect x="10" y="12" width="4" height="4" rx="0.5" fill="#FFB703" />
        <rect x="18" y="12" width="4" height="4" rx="0.5" fill="#FA520F" />
        
        <rect x="2" y="16" width="4" height="4" rx="0.5" fill="#FA520F" />
        <rect x="18" y="16" width="4" height="4" rx="0.5" fill="#FA520F" />
      </svg>
    );
  }

  // DeepSeek (Blue Whale Fin / Leaping Emblem)
  if (normalized.includes('deepseek')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={dimension}
        aria-label="DeepSeek"
      >
        <defs>
          <linearGradient id="deepseek-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        {/* Leaping whale dorsal streamline */}
        <path
          d="M3 13.5 C4.5 9 8 5 13.5 4 C16 3.5 19 4 21 6 C18 7.5 15.5 10 15 13 C14.5 15.5 16 17.5 18 19 C14 20 10 19.5 7 17.5 C5 16 3.5 14.5 3 13.5 Z"
          fill="url(#deepseek-grad)"
        />
        <circle cx="16.5" cy="8" r="1.2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Perplexity AI (Woven Asterisk)
  if (normalized.includes('perplexity') || normalized.includes('sonar')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#20808D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={dimension}
        aria-label="Perplexity"
      >
        <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
        <circle cx="12" cy="12" r="3" fill="#20808D" />
      </svg>
    );
  }

  // Groq (Energetic Lightning Bolt / Groq LPU)
  if (normalized.includes('groq')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={dimension}
        aria-label="Groq"
      >
        <rect width="24" height="24" rx="6" fill="#F03E2F" />
        <path
          d="M13.5 4L7 13.5H12L10.5 20L17 10.5H12L13.5 4Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Cohere (Coral organic flowing mark)
  if (normalized.includes('cohere')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={dimension}
        aria-label="Cohere"
      >
        <circle cx="8.5" cy="8.5" r="4.5" fill="#39594C" />
        <circle cx="15.5" cy="8.5" r="4.5" fill="#D25C37" />
        <circle cx="12" cy="15.5" r="4.5" fill="#D9A371" />
      </svg>
    );
  }

  // Qwen (Purple geometric crystal)
  if (normalized.includes('qwen')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={dimension}
        aria-label="Qwen"
      >
        <polygon points="12,2 21,7.5 21,16.5 12,22 3,16.5 3,7.5" fill="#6B21A8" />
        <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" fill="#A855F7" />
      </svg>
    );
  }

  // Default fallback AI Icon
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={dimension}
    >
      <path d="M12 2a8 8 0 0 0-8 8c0 3.3 2 6.1 4.9 7.3V19a2 2 0 0 0 2 2h2.2a2 2 0 0 0 2-2v-1.7c2.9-1.2 4.9-4 4.9-7.3a8 8 0 0 0-8-8z" />
      <line x1="10" y1="22" x2="14" y2="22" />
    </svg>
  );
};
