'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { User, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('Configurando listener de autenticação...');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Estado de autenticação mudou:', user ? 'Usuário logado' : 'Usuário não logado');
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido:', userCredential.user.uid);
      
      // Definir cookie de sessão
      document.cookie = `session=${await userCredential.user.getIdToken()}; path=/`;
      
      console.log('Redirecionando para o dashboard...');
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const handleRedirect = async () => {
    await router.push('/admin/login');
    window.location.reload();
  };

  const signOut = async () => {
    try {
      console.log('Fazendo logout...');
      await firebaseSignOut(auth);
      
      // Remover cookie de sessão
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      console.log('Logout bem-sucedido, redirecionando para login...');
      // Forçar redirecionamento direto
      window.location.assign('/admin/login');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 