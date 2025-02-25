'use client';

import { useState, useEffect } from 'react';
import { Schedule, getSchedule, updateSchedule } from '@/lib/firebase/firebaseUtils';
import { Clock } from 'lucide-react';
import Image from 'next/image';

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const data = await getSchedule();
      setSchedule(data);
    } catch (error) {
      console.error('Erro ao carregar horário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        days: formData.get('days') as string,
        hours: formData.get('hours') as string
      };

      await updateSchedule(data);
      setShowSuccess(true);
      
      // Atualizar dados locais
      setSchedule(prev => prev ? { ...prev, ...data } : null);
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-blue-500">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Image
            src="/logo/logobranco.png"
            alt="Be2AI Logo"
            width={120}
            height={40}
            className="w-auto h-auto"
          />
          <h1 className="text-2xl font-bold text-white">Gerenciar Horário</h1>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-white/80" />
            <h2 className="text-lg font-medium text-white">Horário de Funcionamento</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Dias da Semana
              </label>
              <input
                type="text"
                name="days"
                defaultValue={schedule?.days}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                placeholder="ex: Segunda à Sexta"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Horário
              </label>
              <input
                type="text"
                name="hours"
                defaultValue={schedule?.hours}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                placeholder="ex: 9h - 18h"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                {showSuccess && (
                  <div className="text-green-400 text-sm">
                    Horário atualizado com sucesso!
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 