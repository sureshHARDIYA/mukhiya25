// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations that need elevated permissions
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database Types (will be generated from Supabase CLI later)
export interface Intent {
  id: number;
  name: string;
  description: string;
  confidence_threshold: number;
  created_at: string;
}

export interface Response {
  id: number;
  intent_id: number;
  trigger_patterns: string[];
  response_text: string;
  response_type: string;
  response_data: Record<string, unknown> | null;
  follow_up_questions: string[];
  created_at: string;
  intents?: Intent;
}

export interface UserQuery {
  id: number;
  query: string;
  detected_intent: string;
  confidence: number;
  response_id: number | null;
  user_feedback: number | null;
  created_at: string;
}
