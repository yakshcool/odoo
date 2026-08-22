/* ==========================================================================
   GlobeTrotter Supabase Client & Database Persistence Layer
   ========================================================================== */

export const SUPABASE_URL = "https://nkp9Dn07erovNxVw.supabase.co"; 
export const SUPABASE_ANON_KEY = "sb_publishable_Js_j_vNkp9Dn07erovNxVw_t_lDebQE";

let supabaseClient = null;

export function initSupabase() {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("Supabase client successfully initialized with project API key.");
    } catch (e) {
      console.warn("Supabase init note:", e);
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

// --- Supabase Authentication Methods ---
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

// --- Supabase Data Sync Helpers ---
export async function fetchUserTripsFromSupabase(userId) {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from('trips').select('*').eq('user_id', userId);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn("Supabase fetch trips note:", e);
    return [];
  }
}

export async function saveTripToSupabase(tripObj) {
  const sb = getSupabase();
  if (!sb) return tripObj;
  try {
    const { data, error } = await sb.from('trips').upsert(tripObj);
    if (error) console.warn("Supabase upsert trip note:", error);
    return data;
  } catch (e) {
    console.warn("Supabase save trip note:", e);
  }
}
