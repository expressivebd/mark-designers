import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// Lazily created so a missing env var only fails an actual upload request,
// not the build (this route isn't statically evaluated at build time).
export function getSupabaseAdmin(): SupabaseClient {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are not set');
  }

  client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  return client;
}
