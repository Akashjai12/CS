import { ProjectItem, CredentialItem, AuditEvent } from '../types';

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    category: 'Production',
    categoryBadgeClass: 'bg-primary-fixed text-on-primary-fixed',
    models: ['GPT-4o', 'Claude 3.5'],
    tokensUsed: '1.2M Tokens',
    tokenPercent: 84,
    updatedAt: 'Updated 14m ago',
    icon: 'storefront',
    iconColor: 'text-primary'
  },
  {
    id: 'proj-2',
    name: 'Healthcare Research Synthesis',
    category: 'Research',
    categoryBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
    models: ['Claude 3.5', 'Gemini 1.5'],
    tokensUsed: '2.1M Tokens',
    tokenPercent: 62,
    updatedAt: 'Updated 1h ago',
    icon: 'science',
    iconColor: 'text-secondary'
  },
  {
    id: 'proj-3',
    name: 'Mobile App Redesign (v2)',
    category: 'Design & Code',
    categoryBadgeClass: 'bg-surface-container-highest text-on-surface',
    models: ['GPT-4o', 'Llama 3'],
    tokensUsed: '780k Tokens',
    tokenPercent: 91,
    updatedAt: 'Updated 3h ago',
    icon: 'devices',
    iconColor: 'text-secondary-container'
  },
  {
    id: 'proj-4',
    name: 'Legal Contract Analysis',
    category: 'Compliance',
    categoryBadgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    models: ['Claude 3.5'],
    tokensUsed: '620k Tokens',
    tokenPercent: 45,
    updatedAt: 'Updated yesterday',
    icon: 'gavel',
    iconColor: 'text-tertiary-container'
  }
];

export const INITIAL_CREDENTIALS: CredentialItem[] = [
  {
    id: 'cred-1',
    name: 'OpenAI Production Endpoint',
    provider: 'OpenAI',
    type: 'GPT-4o / o1 / Embeddings',
    status: 'Active',
    statusBadge: 'Active',
    permissions: 'Full Project Read/Write, Multimodal Inference, Real-time Audio Graph',
    keyPrefix: 'sk-proj-ctx-',
    keySuffix: '49aF',
    realKey: 'sk-proj-ctx-b79f83ea2d41094c9902ac81249aF',
    createdAt: 'Apr 12, 2024',
    lastUsed: 'Used 2m ago',
    isBearer: false
  },
  {
    id: 'cred-2',
    name: 'Anthropic Claude API Key',
    provider: 'Anthropic',
    type: 'Claude 3.5 Sonnet / Haiku',
    status: 'Active',
    statusBadge: 'Active',
    permissions: 'Reasoning & Analysis, Memory Auto-Summarize, Context Cascade',
    keyPrefix: 'sk-ant-api03-',
    keySuffix: '88zK',
    realKey: 'sk-ant-api03-c1248aef00b9911ef6221190988zK',
    createdAt: 'Mar 28, 2024',
    lastUsed: 'Used 14m ago',
    isBearer: false
  },
  {
    id: 'cred-3',
    name: 'Google Cloud Vertex AI / Gemini Token',
    provider: 'Google Vertex',
    type: 'Gemini 1.5 Pro 2M Context',
    status: 'Active',
    statusBadge: 'Active',
    permissions: 'Multimodal Context, Vision, Code Execution Sandbox',
    keyPrefix: 'AIzaSyB',
    keySuffix: '91xQ',
    realKey: 'AIzaSyBN179vQ00aPz99Xlm3kaop8011qL91xQ',
    createdAt: 'May 02, 2024',
    lastUsed: 'Used 1 hour ago',
    isBearer: false
  },
  {
    id: 'cred-4',
    name: 'Context Studio Workspace Service Token',
    provider: 'Custom Token',
    type: 'Internal Scoped Bearer',
    status: 'Active',
    statusBadge: 'Active',
    permissions: 'Scope: CI/CD Pipeline Context Sync, GitHub Actions runner & CLI automated testing',
    keyPrefix: 'cs_live_sec_',
    keySuffix: '77bX',
    realKey: 'cs_live_sec_1091599a0ff391d83011cd77bX',
    createdAt: 'Jun 10, 2024',
    lastUsed: 'Used 3 hours ago',
    isBearer: true
  },
  {
    id: 'cred-5',
    name: 'Meta Llama / Ollama Local Gateway',
    provider: 'Meta Llama',
    type: 'Self-Hosted Ollama Bridge',
    status: 'Needs Rotation',
    statusBadge: 'Needs Rotation (Expires in 3 days)',
    permissions: 'Endpoint: https://ai-node-internal.contextstudio.internal:11434',
    keyPrefix: 'mta_local_',
    keySuffix: '12dL',
    realKey: 'mta_local_899201a0bc1144fe9821384012dL',
    createdAt: 'Jan 15, 2024',
    lastUsed: 'Used 2 days ago',
    endpointUrl: 'https://ai-node-internal.contextstudio.internal:11434',
    daysRemaining: 3
  },
  {
    id: 'cred-6',
    name: 'DeepSeek Inference API Gateway',
    provider: 'DeepSeek',
    type: 'DeepSeek V3 / R1 Reasoner',
    status: 'Active',
    statusBadge: 'Active',
    permissions: 'Full API Token, 128k Multi-head Latent Attention, Code Synthesizer',
    keyPrefix: 'sk-dsk-live-',
    keySuffix: '99qP',
    realKey: 'sk-dsk-live-01ba889c02ff4e311a8840299qP',
    createdAt: 'Jan 28, 2024',
    lastUsed: 'Used 5m ago',
    isBearer: false
  },
  {
    id: 'cred-7',
    name: 'Mistral AI Cloud Endpoint',
    provider: 'Mistral AI',
    type: 'Mistral Large 2 / Codestral',
    status: 'Active',
    statusBadge: 'Active',
    permissions: 'Function Calling, 128k Multi-lingual Tokenizer, JSON Output Enforcement',
    keyPrefix: 'mis_api_prod_',
    keySuffix: '33xL',
    realKey: 'mis_api_prod_771900ac11bf8823419033xL',
    createdAt: 'Feb 10, 2024',
    lastUsed: 'Used 22m ago',
    isBearer: false
  },
  {
    id: 'cred-8',
    name: 'Groq LPU Ultra-Low Latency Cluster',
    provider: 'Groq',
    type: 'Llama 3.1 70B on Groq LPUs',
    status: 'Active',
    statusBadge: 'Active',
    permissions: 'Extreme Speed Streaming (280+ t/s), Speculative Decoding Engine',
    keyPrefix: 'gsk_live_fast_',
    keySuffix: '51mK',
    realKey: 'gsk_live_fast_991823ab00cd11928451mK',
    createdAt: 'Feb 14, 2024',
    lastUsed: 'Used 1m ago',
    isBearer: false
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt-1',
    title: 'Anthropic Claude API Key Revoked',
    badgeText: 'Revoked',
    badgeType: 'error',
    category: 'Security Admin Action',
    timestamp: 'Just now • 14:32:04 UTC',
    description: 'Manual revocation executed by alex.morgan@contextstudio.ai via Admin Console. Key hash: sk-ant-api03...88zK invalidated immediately across all active context runners.',
    actor: 'alex.morgan@contextstudio.ai',
    ip: '198.51.100.42 (US-East)',
    scope: 'Scope: Claude 3.5 Sonnet Live',
    icon: 'key_off',
    payload: {
      event_id: 'evt_rev_993410a8',
      actor: 'alex.morgan@contextstudio.ai',
      key_hash_sha256: '8f37b67cc11b5e394f999...',
      reason: 'Routine credential decommissioning',
      propagation_latency_ms: 14,
      tls_fingerprint: '7a:39:ec:10:99:d2'
    }
  },
  {
    id: 'evt-2',
    title: 'OpenAI Production Endpoint Token Used',
    badgeText: 'Success',
    badgeType: 'success',
    category: 'Batch Inference',
    timestamp: '14 min ago • 14:18:22 UTC',
    description: 'Inference batch completed (2,410 tokens) for project "E-commerce Platform". Model target: gpt-4o / Real-time Audio Graph. Handshake signature validated.',
    actor: 'Production Orchestrator (Worker-04)',
    ip: '34.120.89.14 (GCP US-Central)',
    scope: 'Hash: ...49aF',
    icon: 'bolt',
    payload: {
      event_id: 'evt_inf_28471b02',
      project: 'E-commerce Platform',
      tokens_prompt: 1820,
      tokens_completion: 590,
      duration_ms: 348,
      caller: 'orchestrator-pool-prod-c',
      endpoint: 'https://api.openai.com/v1/chat/completions'
    }
  },
  {
    id: 'evt-3',
    title: 'Google Cloud Vertex AI Token Rotated',
    badgeText: 'Rotated',
    badgeType: 'rotated',
    category: 'Automated Lifecycle',
    timestamp: '1 hour ago • 13:30:19 UTC',
    description: 'Scheduled cryptographic envelope key rotation completed automatically. New SHA-256 fingerprint generated and propagated to 12 edge worker clusters without zero-downtime interruption.',
    actor: 'Auto-Prune Bot (Daemon)',
    ip: 'Fingerprint: 4cf8...901e',
    scope: 'Gemini 1.5 Pro',
    icon: 'autorenew',
    payload: {
      event_id: 'evt_rot_882001ba',
      provider: 'google-vertex',
      envelope_algo: 'AES-256-GCM',
      rotation_type: 'scheduled_30d',
      health_check: 'passed',
      sync_nodes: 12
    }
  },
  {
    id: 'evt-4',
    title: 'Context Studio Workspace Bearer Token Generated',
    badgeText: 'Created',
    badgeType: 'created',
    category: 'CI/CD Pipeline',
    timestamp: '2 hours ago • 12:28:10 UTC',
    description: 'Scoped service token cs_live_sec...77bX created with permissions: Read/Write Context Sync, Model Dispatch. Authenticated by GitHub Actions integration.',
    actor: 'GitHub Actions CI Runner (#9124)',
    ip: 'Signed OIDC',
    scope: 'Exp: in 90 days',
    icon: 'key',
    payload: {
      event_id: 'evt_gen_5511a0ff',
      issuer: 'oidc.github.actions',
      subject: 'repo:context-studio/context-core:ref:refs/heads/main',
      scopes: ['context:read', 'context:write', 'models:dispatch'],
      token_id: 'cs_live_sec_1099238877bX'
    }
  },
  {
    id: 'evt-5',
    title: 'Meta Llama Local Gateway Rotation Warning',
    badgeText: 'Expiring Soon',
    badgeType: 'warning',
    category: 'Self-Hosted Model',
    timestamp: '4 hours ago • 10:14:00 UTC',
    description: 'Key expiration warning triggered (3 days remaining until expiration). Endpoint target: https://ai-node-internal.contextstudio.internal:11434. Automatic renewal retry scheduled.',
    actor: 'Healthcheck Daemon',
    ip: '10.240.12.8',
    scope: 'Model: Llama-3-70B-Instruct',
    icon: 'warning',
    payload: {
      event_id: 'evt_warn_1109a47d',
      gateway: 'ollama-internal-gateway-west',
      days_remaining: 3,
      ttl_seconds: 259200,
      auto_rotate_action: 'queued_retry_at_midnight'
    }
  },
  {
    id: 'evt-6',
    title: 'Zero-Trust Ephemeral Key Scrubbing',
    badgeText: 'Secure Purge',
    badgeType: 'purple',
    category: 'Memory Sanitization',
    timestamp: '6 hours ago • 08:45:11 UTC',
    description: 'Client runtime ephemeral context caches purged after TLS 1.3 handshake verification across 4 worker threads. Zero memory trace confirmed via automated attestation.',
    actor: 'Secure Enclave Kernel',
    ip: 'TPM 2.0 Sealed',
    scope: 'Status: 100% Sanitized',
    icon: 'security',
    payload: {
      event_id: 'evt_scrub_441990cc',
      enclave_id: 'aws-nitro-enc-02',
      memory_blocks_cleared: 64,
      verification_code: '0xDEADBEEF_OK',
      attestation_status: 'VALID'
    }
  }
];

export const BRAND_ASSETS = {
  headerLogo: '/logo.svg',
  hubLogo: '/logo.svg',
  mockupLogo: '/logo.svg',
  bottomLogo: '/logo.svg',
  footerLogo: '/logo.svg',
  avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1XHb0WlAgWLjScAmx6NT3K_jz6JxY-8FZ2-3q7dbnRY_ec1ij1av3dCod8L5rSVVPpdXrK0fc-txAOjws4xHk8WIPVUOp0ZWt0nGgoJFlAb_kOXfprtfQ-r3TJQtqdp1kg1RZUK9UKYcHo0Xu9w3HfaZi7KXWljIkzAej_WmCQ-dCPRg6SkxBU4Xt8Lnhs2Mhvke-fvH38my4cJt2CLoJR9-T6-LhMHC8m8_3kuaVnkTKQk60w-U651-hkNn2v-ga015UZHs5AVTA',
  modalLogo: '/logo.svg'
};

export const DEFAULT_USER_PROFILE = {
  id: 'usr_ctx_98f418d1a',
  name: 'Lalchan Jaiswal',
  email: 'jaiswallalchan16@gmail.com',
  username: 'lalchan16',
  avatarUrl: '',
  role: 'Workspace Owner & Lead Architect',
  plan: 'Pro' as const,
  organization: 'Context AI Labs',
  jobTitle: 'Principal AI Systems Engineer',
  timezone: 'America/Los_Angeles (UTC-07:00)',
  phoneNumber: '+1 (415) 890-3412',
  twoFactorEnabled: true,
  ssoProvider: 'Google Workspace' as const,
  lastLogin: 'Today, 9:42 PM (Google OIDC Verified)',
  lastLoginIp: '104.28.19.44 (San Francisco, CA)',
  accountCreated: 'Jan 14, 2025'
};

export const DEFAULT_LOGIN_SESSIONS = [
  {
    id: 'sess_cur_981a',
    device: 'MacBook Pro 16" (M3 Max)',
    browser: 'Chrome 128.0.6613',
    os: 'macOS Sonoma 14.6',
    location: 'San Francisco, CA, US',
    ipAddress: '104.28.19.44',
    isCurrent: true,
    lastActive: 'Active Now'
  },
  {
    id: 'sess_mob_412b',
    device: 'iPhone 16 Pro',
    browser: 'Mobile Safari 18.1',
    os: 'iOS 18.1',
    location: 'San Jose, CA, US',
    ipAddress: '172.56.21.90',
    isCurrent: false,
    lastActive: '2 hours ago'
  },
  {
    id: 'sess_work_882c',
    device: 'Linux Workstation',
    browser: 'Firefox Developer Edition',
    os: 'Ubuntu 24.04 LTS',
    location: 'Palo Alto, CA, US',
    ipAddress: '198.51.100.24',
    isCurrent: false,
    lastActive: 'Yesterday at 5:14 PM'
  }
];

