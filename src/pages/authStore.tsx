import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
    user: any | null;
    signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signUp: (email: string, password: string, username: string) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    signIn: async (email, password) => {
        // Clear any existing session
        await supabase.auth.signOut();

        // Attempt to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw error;
        }

        // Update the user in the store
        set({ user: data.user });

        return { data, error };
    },

    signUp: async (email, password, username) => {
        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) {
            throw error;
        }

        // If user is created, add to users table
        if (data.user) {
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    id: data.user.id,
                    email: data.user.email,
                    username: username
                });

            if (insertError) {
                throw insertError;
            }
        }

        return { data, error };
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
    }
}));

// Add a listener to update user state
supabase.auth.onAuthStateChange((event, session) => {
    const authStore = useAuthStore.getState();

    if (event === 'SIGNED_IN') {
        authStore.user = session?.user || null;
    } else if (event === 'SIGNED_OUT') {
        authStore.user = null;
    }
});