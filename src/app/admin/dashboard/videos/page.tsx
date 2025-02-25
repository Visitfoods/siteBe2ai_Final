'use client';

import { useState, useEffect, useRef } from 'react';
import { HomeVideos, getHomeVideos, updateHomeVideos } from '@/lib/firebase/firebaseUtils';
import { Video, Upload } from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState<Omit<HomeVideos, 'id'>>({
    heroVideo: '',
    secondaryVideo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{hero?: string, secondary?: string}>({});
  const heroInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  // Carrega os dados do Firebase quando o componente é montado
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getHomeVideos();
        if (data) {
          // Remove o id e atualiza o estado com os dados do Firebase
          const { id, ...videosData } = data;
          setVideos(videosData);
        }
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);

    try {
      await updateHomeVideos(videos);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar vídeos:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVideos(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'secondary') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é um vídeo
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione um arquivo de vídeo.');
      return;
    }

    setUploadStatus(prev => ({ ...prev, [type]: 'Enviando...' }));

    const formData = new FormData();
    formData.append('video', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do vídeo');
      }

      const data = await response.json();
      
      // Atualizar o caminho do vídeo no estado
      setVideos(prev => ({
        ...prev,
        [type === 'hero' ? 'heroVideo' : 'secondaryVideo']: `/Video/${file.name}`
      }));

      setUploadStatus(prev => ({ ...prev, [type]: 'Upload concluído!' }));

      // Limpar o status após 3 segundos
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [type]: undefined }));
      }, 3000);

    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadStatus(prev => ({ ...prev, [type]: 'Erro no upload' }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Gerenciar Vídeos</h1>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
          <h2 className="text-base sm:text-lg font-medium text-white">Vídeos da Página Inicial</h2>
        </div>

        {showSuccess && (
          <div className="bg-green-500/10 text-green-400 px-3 sm:px-4 py-2 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            Vídeos atualizados com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Vídeo Principal (Hero)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="heroVideo"
                  value={videos.heroVideo}
                  onChange={handleChange}
                  placeholder="/Video/nome-do-video.mp4"
                  className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20 text-sm sm:text-base"
                  required
                />
                {uploadStatus.hero && (
                  <p className="mt-2 text-xs sm:text-sm text-white/60">{uploadStatus.hero}</p>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'hero')}
                  className="hidden"
                  ref={heroInputRef}
                />
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Vídeo Secundário
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="secondaryVideo"
                  value={videos.secondaryVideo}
                  onChange={handleChange}
                  placeholder="/Video/nome-do-video.mp4"
                  className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20 text-sm sm:text-base"
                  required
                />
                {uploadStatus.secondary && (
                  <p className="mt-2 text-xs sm:text-sm text-white/60">{uploadStatus.secondary}</p>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'secondary')}
                  className="hidden"
                  ref={secondaryInputRef}
                />
                <button
                  type="button"
                  onClick={() => secondaryInputRef.current?.click()}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`w-full sm:w-auto px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded disabled:opacity-50 text-sm sm:text-base ${
                saving ? 'cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 