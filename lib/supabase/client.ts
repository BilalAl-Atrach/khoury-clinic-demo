import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// The demo runs entirely on the in-memory Zustand store (see lib/store/demo-store.ts)
// so the app functions with zero configuration. Once NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY are set (see SETUP_SUPABASE.md), this client is ready
// to use — swap store actions for calls to `supabase.from(...)` one at a time.
let client: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY — see SETUP_SUPABASE.md."
    );
  }
  if (!client) {
    client = createClient<Database>(url as string, anonKey as string);
  }
  return client;
}
