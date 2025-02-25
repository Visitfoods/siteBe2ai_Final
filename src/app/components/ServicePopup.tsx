import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getServices, type Service } from '@/lib/firebase/firebaseUtils';

interface ServicePopupProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClose: () => void;
}

export default function ServicePopup({ title, description: defaultDescription, icon: Icon, onClose }: ServicePopupProps) {
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState(defaultDescription);

  useEffect(() => {
    const loadServiceDescription = async () => {
      try {
        const services = await getServices();
        const service = services.find(s => s.title === title);
        if (service) {
          setDescription(service.description);
        }
      } catch (error) {
        console.error('Erro ao carregar descrição do serviço:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServiceDescription();
  }, [title]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Overlay com blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Card do Serviço */}
      <div className="relative w-full max-w-lg bg-[#0A0215]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent" />
        
        {/* Conteúdo */}
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70 hover:text-white" />
            </button>
          </div>

          {/* Descrição */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-white/70" />
              </div>
            ) : (
              <p className="text-white/80 leading-relaxed">
                {description || "Descrição do serviço em breve..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 