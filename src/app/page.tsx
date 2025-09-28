'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Music, ChevronLeft, ChevronRight, UserCircle2, Map, Bot, Ghost, MessageSquareMore, HeadphonesIcon, Camera, Video, Code2, Wrench, ChevronDown, Handshake, MessageCircle, X, Send, Settings, Palette, MapPin, Clock, type LucideIcon } from "lucide-react";
import Footer from './components/Footer';
import { getServices, type Service as FirebaseService } from '@/lib/firebase/firebaseUtils';
import ServicePopup from './components/ServicePopup';

export const dynamic = 'force-dynamic';

interface MainTexts {
  title: string;
  description: string;
}

interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface FaqCategories {
  [key: string]: Faq[];
}

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

const iconMap = {
  Settings,
  UserCircle2,
  Map,
  Bot,
  Ghost,
  MessageSquareMore,
  HeadphonesIcon,
  Camera,
  Video,
  Code2,
  Palette
};

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const faqCategoriesRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string}>>([
    {type: 'bot', content: 'Olá! Como posso ajudar você hoje?'}
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<FaqCategory | null>(null);
  const [isDraggingFaq, setIsDraggingFaq] = useState(false);
  const [startXFaq, setStartXFaq] = useState(0);
  const [scrollLeftFaq, setScrollLeftFaq] = useState(0);
  const [faqs, setFaqs] = useState<Record<FaqCategory, Faq[]>>({} as Record<FaqCategory, Faq[]>);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [videoUrl, setVideoUrl] = useState('/Video/Be2AIvideo.mp4');
  const [mainTexts, setMainTexts] = useState<MainTexts>({
    title: "Impulsionamos o futuro",
    description: "A be2ai é uma empresa inovadora, dedicada à transformação digital através da inteligência artificial. Desenvolvemos soluções personalizadas que combinam tecnologia de ponta com necessidades específicas do seu negócio."
  });
  const [isInView, setIsInView] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [heroVideo, setHeroVideo] = useState('/Video/Be2AIvideo.mp4');
  const [secondaryVideo, setSecondaryVideo] = useState('/Video/Be2AIvideo.mp4');
  const [loading, setLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(0);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    description: string;
    icon: LucideIcon;
  } | null>(null);
  const [servicesData, setServicesData] = useState<FirebaseService[]>([]);

  // Memoizar os services para evitar recriações desnecessárias
  const services = React.useMemo(() => {
    if (servicesData.length === 0) {
      // Fallback para os serviços padrão se ainda não carregou do Firebase
      return [
        { 
          title: "À SUA MEDIDA",
          description: "Desenvolvemos soluções personalizadas que se adaptam perfeitamente às necessidades específicas do seu negócio, garantindo máxima eficiência e resultados.",
          icon: Settings 
        },
        { 
          title: "CLONES VIRTUAIS",
          description: "Crie uma réplica digital de si mesmo ou da sua equipa, permitindo interações personalizadas e atendimento 24/7 com a sua própria identidade.",
          icon: UserCircle2 
        },
        { 
          title: "GUIAS TURÍSTICOS VIRTUAIS",
          description: "Transforme a experiência turística com guias virtuais inteligentes que oferecem tours personalizados e informações culturais ricas em tempo real.",
          icon: Map 
        },
        { 
          title: "ASSISTENTES VIRTUAIS",
          description: "Automatize tarefas e melhore o atendimento com assistentes virtuais inteligentes que aprendem e se adaptam ao seu negócio.",
          icon: Bot 
        },
        { 
          title: "MASCOTES VIRTUAIS",
          description: "Dê vida à identidade da sua marca com mascotes virtuais interativas que criam conexões emocionais com seus clientes.",
          icon: Ghost 
        },
        { 
          title: "CHATBOTS",
          description: "Implemente chatbots inteligentes que oferecem suporte instantâneo e personalizado, melhorando a experiência do cliente.",
          icon: MessageSquareMore 
        },
        { 
          title: "ASSISTENTES PÓS-VENDA",
          description: "Mantenha seus clientes satisfeitos com assistentes pós-venda que garantem suporte contínuo e acompanhamento personalizado.",
          icon: HeadphonesIcon 
        },
        { 
          title: "SOFTWARE",
          description: "Desenvolvemos soluções de software sob medida, desde aplicações web até sistemas complexos de gestão empresarial.",
          icon: Code2 
        },
        { 
          title: "VISITAS VIRTUAIS",
          description: "Ofereça experiências imersivas com tours virtuais interativos que permitem explorar espaços de forma realista e envolvente.",
          icon: Video 
        },
        { 
          title: "FOTOGRAFIA",
          description: "Capture a essência do seu negócio com serviços de fotografia profissional que destacam o melhor dos seus produtos e serviços.",
          icon: Camera 
        },
        { 
          title: "VÍDEO",
          description: "Conte sua história através de produções audiovisuais de alta qualidade que engajam e inspiram seu público-alvo.",
          icon: Video 
        },
        { 
          title: "DESIGN",
          description: "Crie uma identidade visual impactante com designs modernos e criativos que comunicam a essência da sua marca.",
          icon: Palette 
        }
      ];
    }

    // Mapear os serviços do Firebase para o formato necessário
    return servicesData.map(service => ({
      title: service.title,
      description: service.description,
      icon: iconMap[service.icon as keyof typeof iconMap] || Settings
    }));
  }, [servicesData]);

  // Memoizar as categorias de FAQ
  const faqCategories = React.useMemo(() => [
    "Sobre a Empresa",
    "Serviços e Soluções",
    "Implementação e Integração"
  ] as const, []);

  type FaqCategory = typeof faqCategories[number];

  // Carregar dados iniciais apenas uma vez
  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        const [faqsData, servicesData] = await Promise.all([
          fetchFaqs(),
          getServices()
        ]);

        if (!mounted) return;

        if (servicesData) {
          setServicesData(servicesData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  // Atualizar vídeos periodicamente com cleanup adequado
  // Vídeos agora são estáticos - não precisamos de carregar do Firebase

  // Otimizar fetchFaqs para usar cache
  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faqs', {
        next: { revalidate: 60 } // Cache por 1 minuto
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar FAQs');
      }
      
      const data = await response.json();
      const faqsByCategory = data.faqs.reduce((acc: Record<FaqCategory, Faq[]>, faq: Faq) => {
        if (!acc[faq.category as FaqCategory]) {
          acc[faq.category as FaqCategory] = [];
        }
        acc[faq.category as FaqCategory].push(faq);
        return acc;
      }, {} as Record<FaqCategory, Faq[]>);

      setFaqs(faqsByCategory);
      return data;
    } catch (error) {
      console.error('Erro ao carregar FAQs:', error);
      return null;
    } finally {
      setIsLoadingFaqs(false);
    }
  };

  // Otimizar handleSubmit para evitar múltiplos envios
  const handleSubmit = React.useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      mensagem: formData.get("mensagem"),
      dataEnvio: new Date().toISOString(),
      status: 'não lida' as const
    };

    try {
      await Promise.all([
        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      ]);

      setShowSuccess(true);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [isSubmitting]);

  // Memoizar funções de manipulação de eventos
  const handleScroll = React.useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:be2aigeral@gmail.com?subject=Contacto via Website";
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center gap-2 h-6">
      <div className="w-2 h-2 bg-white animate-[bounce_0.9s_infinite_-0.3s]"></div>
      <div className="w-2 h-2 bg-white animate-[bounce_0.9s_infinite_-0.15s]"></div>
      <div className="w-2 h-2 bg-white animate-[bounce_0.9s_infinite]"></div>
    </div>
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Reduzi a sensibilidade do arraste para 1.5
    trackRef.current.style.transform = `translate3d(${scrollLeft - walk}px, 0, 0)`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      // Adiciona um timeout para remover a transição após ela completar
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = 'none';
        }
      }, 500);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(parseInt(trackRef.current.style.transform.replace('translate3d(', '').replace('px, 0, 0)', '')) || 0);
    trackRef.current.style.transition = 'none'; // Remove a transição durante o arrasto
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const calculateTransform = () => {
    if (!trackRef.current || isDragging) return;
    
    const scrollProgress = window.scrollY;
    const speed = 0.5;
    const transform = scrollProgress * speed;
    
    requestAnimationFrame(() => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${transform}px, 0, 0)`;
      }
    });
  };

  useEffect(() => {
    let isAnimating = false;
    let rafId: number;

    const handleScroll = () => {
      if (!isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(() => {
          calculateTransform();
          isAnimating = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDragging]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFaqMouseDown = (e: React.MouseEvent) => {
    if (!faqCategoriesRef.current) return;
    setIsDraggingFaq(true);
    setStartXFaq(e.pageX - faqCategoriesRef.current.offsetLeft);
    setScrollLeftFaq(faqCategoriesRef.current.scrollLeft);
  };

  const handleFaqMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingFaq || !faqCategoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - faqCategoriesRef.current.offsetLeft;
    const walk = (x - startXFaq) * 2;
    faqCategoriesRef.current.scrollLeft = scrollLeftFaq - walk;
  };

  const handleFaqMouseUp = () => {
    setIsDraggingFaq(false);
  };

  const handleFaqMouseLeave = () => {
    setIsDraggingFaq(false);
  };

  useEffect(() => {
    let isAnimating = false;
    let rafId: number;

    const handleScroll = () => {
      if (!isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(() => {
          const position = window.pageYOffset;
          setScrollPosition(position);
          
          // Ativar scroll reveal nos elementos
          const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
          scrollRevealElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight * 0.8;
            if (isVisible) {
              element.classList.add('active');
            }
          });
          
          const servicesSection = document.querySelector('.services-gradient') as HTMLElement;
          const faqSection = document.querySelector('.faq-gradient') as HTMLElement;
          
          if (servicesSection && faqSection) {
            const servicesSectionRect = servicesSection.getBoundingClientRect();
            const transitionPoint = servicesSectionRect.bottom;
            const scrollPercentage = Math.min(Math.max((window.innerHeight - transitionPoint) / window.innerHeight, 0), 1);
            
            servicesSection.style.opacity = `${Math.max(1 - scrollPercentage, 0.1)}`;
            faqSection.style.opacity = `${Math.max(scrollPercentage, 0.1)}`;
          }
          
          isAnimating = false;
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

  return (
    <main className="relative w-full">
      {/* Hero Section com Vídeo */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Vídeo em background */}
        <video
          key={`hero-${videoKey}`}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={`${heroVideo}?v=${videoKey}`} type={heroVideo.toLowerCase().endsWith('.mp4') ? 'video/mp4' : heroVideo.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          Seu navegador não suporta o elemento de vídeo.
        </video>

        {/* Overlay escuro para melhorar a visibilidade */}
        <div className="absolute top-0 left-0 w-full h-full" />

        {/* Botão Fala Comigo com Glassmorphism */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed lg:absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50 
            px-4 py-2 sm:px-6 sm:py-3 lg:px-10 lg:py-5
            bg-white/10 backdrop-blur-md 
            border border-white/20 
            text-white text-sm sm:text-base lg:text-xl font-medium
            transition-all duration-300
            hover:bg-white/20 hover:border-white/30 hover:scale-105
            hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]
            focus:outline-none focus:ring-2 focus:ring-white/30
            group"
        >
          <span className="relative flex items-center gap-2 sm:gap-3">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform group-hover:rotate-12" />
            Fala Comigo
          </span>
        </button>
      </section>

      {/* Serviços Section */}
      <section className="services-section relative w-full min-h-[87vh] overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col h-full w-full min-h-[87vh]">
          <div className="w-full relative min-h-[60vh] lg:min-h-[87vh]">
            <div className="services-gradient absolute inset-0 transition-all duration-1000"></div>
            <div className="relative w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-24 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-6 sm:mb-8 lg:mb-16">
                SERVIÇOS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
                {services.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedService(service)}
                    className="service-card group relative border border-white/10 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/20 h-[218px] lg:h-auto"
                  >
                    <div className="relative flex flex-col items-center justify-center text-center h-full p-3 sm:p-4 gap-2 sm:gap-3 md:gap-4">
                      <div className="p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                        {React.createElement(service.icon, { 
                          className: "service-icon text-white w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" 
                        })}
                      </div>
                      <h3 className="service-title text-xs sm:text-sm md:text-base font-semibold text-white whitespace-normal">{service.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section com Vídeo */}
      <div className="faq-section relative z-20 w-full backdrop-blur-sm">
        <div className="relative w-full h-full">
          <div className="w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 scroll-reveal relative z-10">
              FAQS
            </h2>

            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Vídeo ao lado dos FAQs */}
              <div className="w-full lg:w-1/2 h-[calc(100vw*16/9)] sm:h-[calc(100vw*5/4)] lg:h-screen">
                <div className="relative w-full h-full overflow-hidden">
                  <video
                    key={`secondary-${videoKey}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={`${secondaryVideo}?v=${videoKey}`} type={secondaryVideo.toLowerCase().endsWith('.mp4') ? 'video/mp4' : secondaryVideo.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                </div>
              </div>

              {/* Conteúdo FAQs */}
              <div className="w-full lg:w-1/2 px-4 lg:px-0">
                <div className="flex overflow-x-auto whitespace-nowrap gap-2 mb-8 pb-4 hide-scrollbar">
                  <button
                    onClick={() => setSelectedFaqCategory(null)}
                    className={`flex-none px-6 py-3 transition-colors text-base ${
                      selectedFaqCategory === null
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Todas
                  </button>
                  {faqCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedFaqCategory(category as FaqCategory)}
                      className={`flex-none px-6 py-3 transition-colors text-base ${
                        selectedFaqCategory === category
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {isLoadingFaqs ? (
                    <div className="text-center text-white/70">Carregando FAQs...</div>
                  ) : (
                    Object.entries(faqs)
                    .filter(([category]) => selectedFaqCategory === null || category === selectedFaqCategory)
                    .sort(([a], [b]) => {
                      if (selectedFaqCategory === null && a === "Sobre a Empresa") return -1;
                      if (selectedFaqCategory === null && b === "Sobre a Empresa") return 1;
                      return 0;
                    })
                    .map(([category, categoryFaqs]) => (
                      <div key={category}>
                        <div className="space-y-4">
                          {categoryFaqs.map((faq, index) => (
                            <div
                              key={faq.id}
                              className="bg-white/5 border border-white/10 overflow-hidden"
                            >
                              <button
                                onClick={() => {
                                  setOpenQuestions(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(faq.id)) {
                                      newSet.delete(faq.id);
                                    } else {
                                      newSet.add(faq.id);
                                    }
                                    return newSet;
                                  });
                                }}
                                className="w-full text-left p-[0.8rem]"
                              >
                                <div className="flex justify-between items-center gap-4">
                                  <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                                  <span className="text-white/70 flex-shrink-0 text-2xl">
                                    {openQuestions.has(faq.id) ? '−' : '+'}
                                  </span>
                                </div>
                                {openQuestions.has(faq.id) && (
                                  <p className="mt-4 text-base text-white/70 pr-8">{faq.answer}</p>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />

      {/* Formulário de Contacto Flutuante */}
      {isChatOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[400px] bg-[#2389DA]/95 backdrop-blur-xl border border-white/10 overflow-hidden z-50 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="text-white font-medium">Contacte-nos</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="nome" className="text-white/80 text-sm">Nome</label>
              <input
                id="nome"
                type="text"
                name="nome"
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                placeholder="Insira o seu nome"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-white/80 text-sm">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                placeholder="Insira o seu email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="mensagem" className="text-white/80 text-sm">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all resize-none"
                placeholder="Escreva a sua mensagem"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white/10 backdrop-blur-sm text-white border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
            >
              {isSubmitting ? <LoadingSpinner /> : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      )}

      {/* Pop-up de Sucesso */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animated-gradient w-80 h-96 overflow-hidden z-50 shadow-2xl">
          {/* Círculos de fundo */}
          <div className="absolute inset-0 overflow-hidden bg-black/40">
            <div 
              className="absolute w-[200px] h-[200px] bg-white/20 -top-20 -right-20 animate-[float_8s_ease-in-out_infinite]" 
              style={{
                animation: 'float1 8s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-[200px] h-[200px] bg-white/20 -bottom-20 -left-20 animate-[float_8s_ease-in-out_infinite_1s]"
              style={{
                animation: 'float2 8s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-[150px] h-[150px] bg-white/30 -top-10 -left-10 animate-[float_8s_ease-in-out_infinite_2s]"
              style={{
                animation: 'float3 8s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-[150px] h-[150px] bg-white/30 -bottom-10 -right-10 animate-[float_8s_ease-in-out_infinite_3s]"
              style={{
                animation: 'float4 8s ease-in-out infinite'
              }}
            />
          </div>

          <div className="relative flex flex-col items-center justify-center h-full p-6">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-white/20 flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-white text-2xl font-medium mb-4">Confirmado!</h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 px-8 py-3 bg-white/20 text-white hover:bg-white/30 transition-colors text-lg"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Botão de Contacto */}
      {!isInView && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-40"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Pop-up do Serviço */}
      {selectedService && (
        <ServicePopup
          title={selectedService.title}
          description={selectedService.description}
          icon={selectedService.icon}
          onClose={() => setSelectedService(null)}
        />
      )}
    </main>
  );
}
