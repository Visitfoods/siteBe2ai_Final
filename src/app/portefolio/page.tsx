'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import VideoModal from '@/components/VideoModal';

interface Category {
  id: string;
  title: string;
  image: string;
  videos: string[];
}

export default function PortfolioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const categories: Category[] = [
    {
      id: 'clones-digitais',
      title: 'Clones Digitais',
      image: '/fotoscategoriasportefolio/Clonedigital.png',
      videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
    },
    {
      id: 'mascotes-digitais',
      title: 'Mascotes Digitais',
      image: '/fotoscategoriasportefolio/Mascote Digital.png',
      videos: [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      ]
    },
    {
      id: 'virtual-guide',
      title: 'Virtual Guide',
      image: '/fotoscategoriasportefolio/Virtual Guide.png',
      videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4']
    },
    {
      id: 'redes-sociais',
      title: 'Conteúdos para as Redes Sociais',
      image: '/fotoscategoriasportefolio/Conteudo Redes.webp',
      videos: [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
      ]
    }
  ];

  const handleCategoryClick = (category: Category) => {
    setCurrentCategory(category);
    setCurrentVideoIndex(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Efeito para ativar animações de scroll
  useEffect(() => {
    let isScrollAnimating = false;
    let rafId: number;

    const handleScroll = () => {
      if (!isScrollAnimating) {
        isScrollAnimating = true;
        rafId = requestAnimationFrame(() => {
          // Ativar scroll reveal nos elementos
          const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
          scrollRevealElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight * 0.8;
            if (isVisible) {
              element.classList.add('active');
            }
          });
          
          isScrollAnimating = false;
        });
      }
    };

    // Executar uma vez no carregamento para verificar elementos já visíveis
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Variantes para animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <main className="relative w-full min-h-screen">
      {/* Estilo global para dispositivos móveis */}
      <style jsx global>{`
        @media (max-width: 767px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      
      {/* Background com gradiente idêntico ao da home */}
      <div className="absolute inset-0 -z-10" style={{
        background: 'radial-gradient(circle at 100% 0%, rgb(147, 51, 234) 0%, rgba(88, 28, 135, 1) 30%, rgba(15, 3, 35, 1) 60%)'
      }} />
      
      <section className="relative w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-white mb-4"
          >
            Portfólio
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-center text-white/80 mb-16 max-w-3xl mx-auto"
          >
            Explore os nossos projetos
          </motion.p>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 portfolio-grid"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`scroll-reveal scroll-reveal-delay-${index % 3 + 1} relative overflow-hidden shadow-xl cursor-pointer bg-white/5 backdrop-blur-sm border-0 hover:border-white/20 transition-all duration-300`}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative h-64 xs:h-72 sm:h-80 md:h-96 w-full">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    className="transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end">
                    <div className="p-4 sm:p-6 md:p-8 w-full">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{category.title}</h2>
                      <div className="flex items-center mt-3">
                        <div className="bg-purple-700/50 backdrop-blur-lg p-1.5 sm:p-2 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110 border border-white/10 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white sm:w-5 sm:h-5">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </div>
                        <p className="text-white text-base sm:text-lg">
                          Ver {category.videos.length > 1 ? 'vídeos' : 'vídeo'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {currentCategory && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          videos={currentCategory.videos}
          currentVideoIndex={currentVideoIndex}
          setCurrentVideoIndex={setCurrentVideoIndex}
        />
      )}
    </main>
  );
} 