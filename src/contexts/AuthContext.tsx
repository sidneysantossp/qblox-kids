import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao obter informações do usuário:', error);
    return null;
  }
  return data;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (emailOrUsername: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (emailOrUsername: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função auxiliar para verificar se é um email válido
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função auxiliar para traduzir mensagens de erro do Supabase
const translateError = (errorMessage: string): string => {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos',
    'Email not confirmed': 'E-mail não confirmado',
    'User already registered': 'Este e-mail já está cadastrado',
    'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de e-mail inválido',
    'Invalid email': 'E-mail inválido',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos',
    'Signup requires a valid password': 'É necessário fornecer uma senha válida',
  };

  // Procurar por correspondência exata ou parcial
  for (const [key, value] of Object.entries(translations)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  return errorMessage;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('[AuthContext] Carregando profile para usuário:', session.user.id);
        getProfile(session.user.id).then((profileData) => {
          console.log('[AuthContext] Profile carregado:', profileData);
          setProfile(profileData);
          setLoading(false); // Só marca como carregado após o profile estar pronto
        });
      } else {
        setLoading(false); // Se não há usuário, pode marcar como carregado imediatamente
      }
    });
    // In this function, do NOT use any await calls. Use `.then()` instead to avoid deadlocks.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth state changed:', event, 'User:', session?.user?.id);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('[AuthContext] Carregando profile após auth change:', session.user.id);
        getProfile(session.user.id).then((profileData) => {
          console.log('[AuthContext] Profile carregado após auth change:', profileData);
          setProfile(profileData);
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithUsername = async (emailOrUsername: string, password: string) => {
    try {
      // Se já for um email válido, usar diretamente. Caso contrário, adicionar @miaoda.com
      const email = isValidEmail(emailOrUsername) 
        ? emailOrUsername 
        : `${emailOrUsername}@miaoda.com`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const translatedError = new Error(translateError(error.message));
        throw translatedError;
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (emailOrUsername: string, password: string) => {
    try {
      // Se já for um email válido, usar diretamente. Caso contrário, adicionar @miaoda.com
      const email = isValidEmail(emailOrUsername) 
        ? emailOrUsername 
        : `${emailOrUsername}@miaoda.com`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        const translatedError = new Error(translateError(error.message));
        throw translatedError;
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signIn: signInWithUsername, signUp: signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}