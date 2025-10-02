import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Dev-friendly fallback to avoid runtime crashes when env is missing
    console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Running in mock mode.');

    const resolved = (data = null) => ({ data, error: null });
    const thenable = (data = null) => ({
      then: (onFulfilled) => Promise.resolve(resolved(data)).then(onFulfilled),
      catch: (onRejected) => Promise.resolve(resolved(data)).catch(onRejected),
      finally: (onFinally) => Promise.resolve().finally(onFinally),
    });

    const builder = () => {
      const api = {
        select: () => api,
        insert: () => thenable(),
        update: () => thenable(),
        delete: () => thenable(),
        eq: () => api,
        order: () => thenable([]),
      };
      return api;
    };

    client = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => builder(),
    };
  } else {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error('[Supabase] Initialization error:', e);
}

export const supabase = client;


