'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, HelpCircle, LogOut, Clock, Share2, MapPin, Video, Menu, X, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (pathname === '/admin/login') {
    return children;
  }

  const navigation = [
    { name: 'FAQs', href: '/admin/dashboard/faqs', icon: HelpCircle },
    { name: 'Mensagens', href: '/admin/dashboard/messages', icon: MessageSquare },
    { name: 'Horário', href: '/admin/dashboard/schedule', icon: Clock },
    { name: 'Morada', href: '/admin/dashboard/address', icon: MapPin },
    { name: 'Vídeos', href: '/admin/dashboard/videos', icon: Video },
    { name: 'Serviços', href: '/admin/dashboard/services', icon: Settings },
    {
      name: 'Redes Sociais',
      href: '/admin/dashboard/social',
      icon: Share2
    }
  ];

  const Sidebar = () => (
    <div className={`${isMobile ? (isMobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden') : 'fixed top-0 left-0 h-full w-64'}`}>
      <div className="h-full bg-white/10 backdrop-blur-xl border-r border-white/20">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/20 flex justify-between items-center">
            <Image
              src="/logo/logobranco.png"
              alt="Be2AI Logo"
              width={120}
              height={40}
              className="w-auto h-auto"
            />
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-blue-500">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`${isMobile ? 'pl-0' : 'pl-64'} min-h-screen`}>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
} 