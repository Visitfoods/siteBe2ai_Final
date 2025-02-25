'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { Schedule, getSchedule, SocialLinks, getSocialLinks, Address, getAddress } from '@/lib/firebase/firebaseUtils';

export default function Footer() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para obter o ano atual
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [scheduleData, socialData, addressData] = await Promise.all([
        getSchedule(),
        getSocialLinks(),
        getAddress()
      ]);
      setSchedule(scheduleData);
      setSocialLinks(socialData);
      setAddress(addressData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: Address | null) => {
    if (!address) return 'Carregando...';
    return `${address.street}, ${address.number}\n${address.city} - ${address.zipCode}`;
  };

  return (
    <footer className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Morada */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0 text-center">
            <h3 className="text-lg font-semibold mb-4">MORADA</h3>
            {loading ? (
              <p className="text-white/80">Carregando...</p>
            ) : (
              <p className="text-white/80 whitespace-pre-line">
                {formatAddress(address)}
              </p>
            )}
          </div>

          {/* Horário */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0 text-center">
            <h3 className="text-lg font-semibold mb-4">HORÁRIO</h3>
            {loading ? (
              <p className="text-white/80">Carregando...</p>
            ) : (
              <p className="text-white/80">
                {schedule?.days}<br />
                {schedule?.hours}
              </p>
            )}
          </div>

          {/* Redes Sociais */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">REDES SOCIAIS</h3>
            <div className="flex justify-evenly w-full">
              {socialLinks?.instagram && (
                <Link 
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <Instagram className="w-8 h-8" />
                </Link>
              )}
              
              {socialLinks?.facebook && (
                <Link 
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <Facebook className="w-8 h-8" />
                </Link>
              )}
              
              {socialLinks?.linkedin && (
                <Link 
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <Linkedin className="w-8 h-8" />
                </Link>
              )}
              
              {socialLinks?.tiktok && (
                <Link 
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Links e Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white/80">
            © {getCurrentYear()} Be2AI. Todos os direitos reservados.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              href="/politica-privacidade"
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link 
              href="https://www.livroreclamacoes.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Livro de Reclamações
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 