// Auto-generated database types from ZERO Builder
// Do not edit manually
export interface Profiles {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  status: string;
  active_conversation_count: number;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfilesInsert {
  full_name: string;
  role?: string;
  avatar_url: string | null;
  status?: string;
  active_conversation_count?: number;
  organization_id: string | null;
}

export interface Organizations {
  id?: string;
  name: string;
  owner_id: string;
  subscription_plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  agent_limit: number;
  conversation_limit?: number | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationsInsert {
  name: string;
  owner_id: string;
  subscription_plan?: string;
  subscription_status?: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  agent_limit?: number;
  conversation_limit?: number | null;
}

export interface WidgetSettings {
  id?: string;
  organization_id: string;
  position: string;
  primary_color: string;
  greeting_message: string;
  offline_message: string;
  business_hours_enabled: boolean;
  business_hours?: Record<string, unknown> | null;
  avatar_url: string | null;
  logo_url: string | null;
  show_branding: boolean;
  widget_code: string;
  created_at: string;
  updated_at: string;
}

export interface WidgetSettingsInsert {
  organization_id: string;
  position?: string;
  primary_color?: string;
  greeting_message?: string;
  offline_message?: string;
  business_hours_enabled?: boolean;
  business_hours?: Record<string, unknown> | null;
  avatar_url: string | null;
  logo_url: string | null;
  show_branding?: boolean;
  widget_code: string;
}

export interface Visitors {
  id?: string;
  organization_id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  location: string | null;
  browser: string | null;
  current_page_url: string | null;
  first_seen_at: string;
  last_seen_at: string;
  total_conversations: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitorsInsert {
  organization_id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  location: string | null;
  browser: string | null;
  current_page_url: string | null;
  first_seen_at?: string;
  last_seen_at?: string;
  total_conversations?: number;
  notes: string | null;
}

export interface Conversations {
  id?: string;
  organization_id: string;
  visitor_id: string;
  assigned_agent_id: string | null;
  status: string;
  channel: string;
  started_at: string;
  ended_at: string | null;
  rating: number | null;
  tags?: unknown | null;
  visitor_name: string | null;
  visitor_email: string | null;
  first_response_time_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationsInsert {
  organization_id: string;
  visitor_id: string;
  assigned_agent_id: string | null;
  status?: string;
  channel?: string;
  started_at?: string;
  ended_at: string | null;
  rating: number | null;
  tags?: unknown | null;
  visitor_name: string | null;
  visitor_email: string | null;
  first_response_time_seconds: number | null;
}

export interface Messages {
  id?: string;
  conversation_id: string;
  sender_type: string;
  sender_id: string | null;
  body: string;
  attachments?: Record<string, unknown> | null;
  read: boolean;
  sent_at: string;
  created_at: string;
  updated_at: string;
}

export interface MessagesInsert {
  conversation_id: string;
  sender_type: string;
  sender_id: string | null;
  body: string;
  attachments?: Record<string, unknown> | null;
  read?: boolean;
  sent_at?: string;
}

export interface CannedResponses {
  id?: string;
  organization_id: string;
  title: string;
  body: string;
  shortcut_code: string;
  category: string | null;
  use_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CannedResponsesInsert {
  organization_id: string;
  title: string;
  body: string;
  shortcut_code: string;
  category: string | null;
  use_count?: number;
  created_by: string | null;
}
