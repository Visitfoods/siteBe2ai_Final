'use client';

import { useState } from 'react';
import { createInitialServices } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function InitServicesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleInit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createInitialServices();
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/dashboard/services');
        }, 2000);
      } else {
        setError('Erro ao criar serviços. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao criar serviços. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="w-full min-h-screen text-white">
      <div className="max-w-lg mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Inicializar Serviços</h1>
          
          <p className="text-white/80 mb-6">
            Esta página irá criar todos os serviços iniciais no Firebase. Use apenas uma vez.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-md mb-4">
              Serviços criados com sucesso! Redirecionando...
            </div>
          )}

          <button
            onClick={handleInit}
            disabled={loading || success}
            className="w-full bg-white/10 border border-white/20 text-white py-2 px-4 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Inicializando...
              </span>
            ) : (
              'Inicializar Serviços'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 