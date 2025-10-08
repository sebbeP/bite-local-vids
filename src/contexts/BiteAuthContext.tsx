// @ts-nocheck - Temporary: Types will update after migration
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  uid: string;
  email: string;
  fname?: string;
  lname?: string;
  logopath?: string;
  lang?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fname?: string, lname?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within BiteAuthProvider');
  }
  return context;
};

export const BiteAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (uid: string) => {
    try {
      // @ts-ignore - Types will update after migration
      const { data, error } = await supabase
        .from('"Users"."User"')
        .select('*')
        .eq('uid', uid)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          uid: data.uid,
          email: data.email,
          fname: data.fname,
          lname: data.lname,
          logopath: data.logopath,
          lang: data.lang,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fname?: string, lname?: string) => {
    try {
      setLoading(true);
      
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create user profile in Users.User table
      // @ts-ignore - Types will update after migration
      const { error: profileError } = await supabase
        .from('"Users"."User"')
        .insert({
          uid: authData.user.id,
          email,
          fname: fname || '',
          lname: lname || '',
          createddate: new Date().toISOString().split('T')[0],
          suspended: false,
          wrongpasswordcount: 0,
          logintimes: 0,
        });

      if (profileError) throw profileError;

      // Create login credentials
      // @ts-ignore - Types will update after migration
      const { error: loginError } = await supabase
        .from('"Users"."LogIn"')
        .insert({
          uid: authData.user.id,
          email,
          createddate: new Date().toISOString().split('T')[0],
        });

      if (loginError) throw loginError;

      await loadUserProfile(authData.user.id);

      toast({
        title: 'Welcome to Bite!',
        description: 'Your account has been created successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      await loadUserProfile(data.user.id);

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
