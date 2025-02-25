'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { getServices, updateService, Service } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
      return;
    }

    if (!authLoading && user) {
      loadServices();
    }
  }, [user, authLoading, router]);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (serviceId: string, description: string) => {
    setSaving(serviceId);
    try {
      await updateService(serviceId, { description });
      // Atualiza o estado local
      setServices(prev => prev.map(service => 
        service.id === serviceId ? { ...service, description } : service
      ));
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    } finally {
      setSaving(null);
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
    return null;
  }

  return (
    <div className="w-full min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestão de Textos dos Serviços</h1>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="space-y-6">
            {services.map(service => (
              <div 
                key={service.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 space-y-4"
              >
                <h2 className="text-xl font-semibold text-white">{service.title}</h2>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    Descrição do Pop-up
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => {
                      setServices(prev => prev.map(s => 
                        s.id === service.id ? { ...s, description: e.target.value } : s
                      ));
                    }}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleUpdateService(service.id, service.description)}
                    disabled={saving === service.id}
                    className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-colors"
                  >
                    {saving === service.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        A guardar...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 