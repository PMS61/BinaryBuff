import { authApi } from './api';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current authenticated user from Supabase
 * @returns {Promise<Object|null>} The current user or null if not authenticated
 */
export async function getSupabaseUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error getting Supabase user:', error);
    return null;
  }
}

/**
 * Sign out the current user from both Supabase and our backend
 * @returns {Promise<{error: any|null}>}
 */
export async function signOut() {
  try {
    // Sign out from our backend API
    const token = localStorage.getItem('auth_token');
    if (token) {
      await authApi.logout(token);
    }
    
    // Also sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile_picture');
    
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error };
  }
}

// Auth functions that use our FastAPI backend
export const signInWithEmail = async (email, password) => {
  try {
    console.log('Signing in with email', email);
    const data = await authApi.login(email, password);
    console.log('Login successful', data);
    localStorage.setItem('auth_token', data.token);
    return { data, error: null };
  } catch (error) {
    console.error('Login failed', error);
    return { 
      data: null, 
      error: error.message || "Login failed"
    };
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    console.log('Signing up with email', email);
    const data = await authApi.register(email, password);
    console.log('Registration successful', data);
    localStorage.setItem('auth_token', data.token);
    return { data, error: null };
  } catch (error) {
    console.error('Registration failed', error);
    return { data: null, error: error.message || "Registration failed" };
  }
};

export const signInWithGoogle = async () => {
  // The current implementation is redirecting to the backend login URL
  // But we need to handle this differently for production vs development
  
  // Get the API URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // Store the current URL as the return URL (for after authentication)
  const returnUrl = window.location.origin + '/dashboard';
  
  // Redirect with the return URL as a parameter
  window.location.href = `${apiUrl}/auth/google/login?redirect_url=${encodeURIComponent(returnUrl)}`;
  
  return { data: null, error: null };
};

/**
 * Get the current authenticated user from our backend
 * @returns {Promise<Object|null>} The current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }
    
    const userData = await authApi.getUser(token);
    // Store the profile picture URL in local storage if it exists
    if (userData && userData.profile_picture) {
      localStorage.setItem('user_profile_picture', userData.profile_picture);
    }
    
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    // If the token is invalid, clear it
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile_picture');
    return null;
  }
};
