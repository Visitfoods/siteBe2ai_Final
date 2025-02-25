'use client';

import { useState, useEffect } from 'react';
import { SocialLinks, getSocialLinks, updateSocialLinks } from '@/lib/firebase/firebaseUtils';
import { Instagram, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

export default function SocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const data = await getSocialLinks();
      setSocialLinks(data);
    } catch (error) {
      console.error('Erro ao carregar links:', error);
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
        instagram: formData.get('instagram') as string,
        facebook: formData.get('facebook') as string,
        linkedin: formData.get('linkedin') as string,
        tiktok: formData.get('tiktok') as string
      };

      await updateSocialLinks(data);
      setShowSuccess(true);
      
      // Atualizar dados locais
      setSocialLinks(prev => prev ? { ...prev, ...data } : null);
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar links:', error);
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
          <h1 className="text-2xl font-bold text-white">Gerenciar Redes Sociais</h1>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="w-6 h-6 text-white/80" />
            <h2 className="text-lg font-medium text-white">Links das Redes Sociais</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </div>
              </label>
              <input
                type="url"
                name="instagram"
                defaultValue={socialLinks?.instagram}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                placeholder="https://instagram.com/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </div>
              </label>
              <input
                type="url"
                name="facebook"
                defaultValue={socialLinks?.facebook}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                placeholder="https://facebook.com/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </div>
              </label>
              <input
                type="url"
                name="linkedin"
                defaultValue={socialLinks?.linkedin}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                placeholder="https://linkedin.com/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z"/>
                  </svg>
                  TikTok
                </div>
              </label>
              <input
                type="url"
                name="tiktok"
                defaultValue={socialLinks?.tiktok}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                placeholder="https://tiktok.com/..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                {showSuccess && (
                  <div className="text-green-400 text-sm">
                    Links atualizados com sucesso!
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