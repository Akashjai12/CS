export type ScreenId = 
  | 'landing'
  | 'dashboard'
  | 'settings'
  | 'credentials'
  | 'audit-logs'
  | 'create-project'
  | 'project-workspace';

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  categoryBadgeClass: string;
  models: string[];
  tokensUsed: string;
  tokenPercent: number;
  updatedAt: string;
  icon: string;
  iconColor: string;
}

export interface CredentialItem {
  id: string;
  name: string;
  provider:
    | 'OpenAI'
    | 'Anthropic'
    | 'Google Vertex'
    | 'Custom Token'
    | 'Meta Llama'
    | 'DeepSeek'
    | 'Mistral AI'
    | 'Groq'
    | 'Cohere'
    | 'Perplexity'
    | 'Qwen'
    | string;
  type: string;
  status: 'Active' | 'Needs Rotation' | 'Revoked';
  statusBadge: string;
  permissions: string;
  keyPrefix: string;
  keySuffix: string;
  realKey: string;
  createdAt: string;
  lastUsed: string;
  isBearer?: boolean;
  endpointUrl?: string;
  daysRemaining?: number;
}

export interface AuditEvent {
  id: string;
  title: string;
  badgeText: string;
  badgeType: 'error' | 'success' | 'rotated' | 'created' | 'warning' | 'purple';
  category: string;
  timestamp: string;
  description: string;
  actor: string;
  ip: string;
  scope: string;
  payload: Record<string, any>;
  icon: string;
}

export interface SettingToggle {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  icon: string;
  locked?: boolean;
  lockedReason?: string;
  category: 'memory' | 'models' | 'security' | 'notifications';
}

export interface LoginSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  isCurrent: boolean;
  lastActive: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl?: string;
  role: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  organization: string;
  jobTitle: string;
  timezone: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
  ssoProvider: 'Google Workspace' | 'GitHub' | 'Email & Password';
  lastLogin: string;
  lastLoginIp: string;
  accountCreated: string;
}
