/* ==========================================================================
   GlobeTrotter Supabase Client & Dynamic Connection Manager
   ========================================================================== */

const SUPABASE_CONFIG_KEY = 'GLOBETROTTER_SUPABASE_CONFIG';

export function getSupabaseConfig() {
  const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return {
    url: "https://vNkp9Dn07erovNxVw.supabase.co",
    key: "sb_publishable_Js_j_vNkp9Dn07erovNxVw_t_lDebQE"
  };
}

export function saveSupabaseConfig(url, key) {
  const config = { url, key };
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  initSupabase();
  return config;
}

let supabaseClient = null;

export function initSupabase() {
  const config = getSupabaseConfig();
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(config.url, config.key);
      console.log("Supabase client initialized with URL:", config.url);
    } catch (e) {
      console.warn("Supabase init fallback:", e);
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

// --- Supabase Auth Functions ---
export async function supabaseSignUp(email, password, name) {
  const sb = getSupabase();
  if (!sb) return { user: { email, id: `user-${Date.now()}` }, error: null };

  try {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
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
    try { await sb.auth.signOut(); } catch (e) {}
  }
}

// --- Supabase Table Sync Functions ---
export async function syncTripToSupabase(tripObj) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('trips').upsert(tripObj);
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}
