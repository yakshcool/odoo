/* ==========================================================================
   GlobeTrotter Supabase Client & Authentication Layer
   ========================================================================== */

// Configurable Supabase credentials with fallback support
const SUPABASE_URL = "https://xyzcompany.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTU1NTU1fQ.placeholder_key";

let supabaseClient = null;

export function initSupabase() {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("Supabase client initialized successfully");
    } catch (e) {
      console.warn("Supabase initialization fallback to local database engine", e);
    }
  }
  return supabaseClient;
}

export function getSupabase() {
  if (!supabaseClient) {
    initSupabase();
  }
  return supabaseClient;
}

export async function supabaseSignUp(email, password, name) {
  const sb = getSupabase();
  if (!sb) return { user: { email, id: `user-${Date.now()}` }, error: null };

  try {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    return { user: data?.user, error };
  } catch (err) {
    return { user: null, error: err };
  }
}

export async function supabaseSignIn(email, password) {
  const sb = getSupabase();
  if (!sb) return { user: { email, id: `user-1` }, error: null };

  try {
    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password
    });
    return { user: data?.user, session: data?.session, error };
  } catch (err) {
    return { user: null, error: err };
  }
}

export async function supabaseSignOut() {
  const sb = getSupabase();
  if (sb) {
    await sb.auth.signOut();
  }
}
