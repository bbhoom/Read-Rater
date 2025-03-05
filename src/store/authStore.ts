import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  initializeUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      set({
        user: session?.user || null,
        session: session,
        loading: false
      });

      // Set up a listener for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        set({
          user: session?.user || null,
          session: session,
          loading: false
        });
      });
    } catch (error) {
      console.error('Error initializing user:', error);
      set({ user: null, session: null, loading: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    set({
      user: data.user,
      session: data.session
    });
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    // Check if user was created successfully
    if (data.user) {
      set({
        user: data.user,
        session: data.session
      });
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    set({
      user: null,
      session: null
    });
  },
}));