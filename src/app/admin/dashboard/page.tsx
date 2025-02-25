'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Bem-vindo ao Painel Administrativo
      </h1>
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
        <p className="text-white/80">
          Você está logado como: <span className="text-white">{user?.email}</span>
        </p>
        <p className="text-white/60 mt-4">
          Use o menu lateral para navegar entre as seções do painel administrativo.
        </p>
      </div>
    </div>
  );
} 