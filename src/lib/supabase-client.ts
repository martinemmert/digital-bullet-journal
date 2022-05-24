import { createClient, Session } from "@supabase/supabase-js";
import { createSignal } from "solid-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const [session, setSession] = createSignal<Session>(supabase.auth.session());

supabase.auth.onAuthStateChange((event, session) => {
  setSession(session);
});

function logout() {
  void supabase.auth.signOut();
}

export { session, supabase, logout };
