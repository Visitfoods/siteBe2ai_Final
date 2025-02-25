'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/firebase';

export default function TestPage() {
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const firebaseConfig = auth.app.options;
      setConfig({
        apiKey: firebaseConfig.apiKey,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Teste de Configuração do Firebase
      </h1>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
          <h2 className="text-red-400 font-medium mb-2">Erro encontrado:</h2>
          <pre className="text-red-300 whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 p-6 rounded-lg">
          <h2 className="text-white font-medium mb-4">Configuração atual:</h2>
          <pre className="text-white/80 whitespace-pre-wrap">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 