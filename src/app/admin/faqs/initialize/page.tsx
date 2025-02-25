'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InitializeFAQsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInitialize = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/admin/faqs');
        }, 2000);
      } else {
        setError(data.message || data.error || 'Erro ao inicializar FAQs');
      }
    } catch (err) {
      setError('Erro ao inicializar FAQs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Inicializar FAQs</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="mb-6 text-gray-300">
            Esta ação irá inicializar as FAQs no banco de dados. 
            Só prossiga se tiver certeza que deseja fazer isso.
          </p>

          <button
            onClick={handleInitialize}
            disabled={loading}
            className={`w-full py-2 px-4 rounded ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'Inicializando...' : 'Inicializar FAQs'}
          </button>

          {message && (
            <div className="mt-4 p-4 bg-green-600/20 border border-green-600 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-600/20 border border-red-600 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 