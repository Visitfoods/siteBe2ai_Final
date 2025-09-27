import { db } from './firebase';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc,
  updateDoc,
  where,
  getDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

export interface Message {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  dataEnvio: string;
  status: 'lida' | 'não lida';
}

export interface Schedule {
  id: string;
  days: string;
  hours: string;
}

export interface SocialLinks {
  id: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  city: string;
  zipCode: string;
}

export interface HomeVideos {
  id: string;
  heroVideo: string;  // URL do vídeo principal/hero
  secondaryVideo: string;  // URL do vídeo secundário
}

export interface Service {
  id: string;
  title: string;
  description: string;
  order: number;
  icon?: string;
  updatedAt?: any;
}

// FAQs
export const getFaqs = async (): Promise<FAQ[]> => {
  try {
    const faqsRef = collection(db, 'faqs');
    // Usar apenas uma ordenação simples por enquanto
    const q = query(faqsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    // Ordenar manualmente por categoria e depois por ordem
    const faqs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as FAQ));
    
    return faqs.sort((a, b) => {
      // Primeiro ordenar por categoria
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      // Se mesma categoria, ordenar por ordem
      return a.order - b.order;
    });
  } catch (error) {
    console.error('Erro ao buscar FAQs:', error);
    return [];
  }
};

export const createFaq = async (faq: Omit<FAQ, 'id'>) => {
  const faqsRef = collection(db, 'faqs');
  return addDoc(faqsRef, faq);
};

export const updateFaq = async (id: string, data: Partial<FAQ>) => {
  const faqRef = doc(db, 'faqs', id);
  return updateDoc(faqRef, data);
};

export const deleteFaq = async (id: string) => {
  const faqRef = doc(db, 'faqs', id);
  return deleteDoc(faqRef);
};

export const updateFaqOrder = async (faqs: FAQ[]) => {
  if (faqs.length === 0) return;
  
  try {
    const category = faqs[0].category;
    const batch = writeBatch(db);

    // Primeiro, obter todas as FAQs da categoria
    const faqsRef = collection(db, 'faqs');
    const q = query(faqsRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    
    // Criar um mapa das novas ordens
    const orderMap = new Map(faqs.map((faq, index) => [faq.id, index * 100]));
    
    // Atualizar cada FAQ com sua nova ordem
    snapshot.docs.forEach(doc => {
      const newOrder = orderMap.get(doc.id);
      if (newOrder !== undefined) {
        batch.update(doc.ref, { order: newOrder });
      }
    });

    await batch.commit();
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar ordem das FAQs:', error);
    return false;
  }
};

// Messages
export const getMessages = async (): Promise<Message[]> => {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('dataEnvio', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
};

export const markMessageAsRead = async (id: string) => {
  const messageRef = doc(db, 'messages', id);
  return updateDoc(messageRef, { status: 'lida' });
};

export const deleteMessage = async (id: string) => {
  const messageRef = doc(db, 'messages', id);
  return deleteDoc(messageRef);
};

// Schedule
export const getSchedule = async (): Promise<Schedule | null> => {
  try {
    const scheduleRef = doc(db, 'settings', 'schedule');
    const snapshot = await getDoc(scheduleRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Schedule;
    }
    
    // Se não existir, criar com valor padrão
    const defaultSchedule = {
      days: 'Segunda à Sexta',
      hours: '9h - 18h'
    };
    
    await setDoc(scheduleRef, defaultSchedule);
    return { id: 'schedule', ...defaultSchedule };
  } catch (error) {
    console.error('Erro ao buscar horário:', error);
    return null;
  }
};

export const updateSchedule = async (data: Omit<Schedule, 'id'>) => {
  const scheduleRef = doc(db, 'settings', 'schedule');
  return setDoc(scheduleRef, data);
};

// Social Links
export const getSocialLinks = async (): Promise<SocialLinks | null> => {
  try {
    const socialLinksRef = doc(db, 'settings', 'social-links');
    const snapshot = await getDoc(socialLinksRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as SocialLinks;
    }
    
    // Se não existir, criar com valores padrão
    const defaultSocialLinks = {
      instagram: 'https://www.instagram.com/be2ai/',
      facebook: 'https://www.facebook.com/be2ai',
      linkedin: 'https://www.linkedin.com/company/be2ai',
      tiktok: 'https://www.tiktok.com/@be2ai'
    };
    
    await setDoc(socialLinksRef, defaultSocialLinks);
    return { id: 'social-links', ...defaultSocialLinks };
  } catch (error) {
    console.error('Erro ao buscar links das redes sociais:', error);
    return null;
  }
};

export const updateSocialLinks = async (data: Omit<SocialLinks, 'id'>) => {
  const socialLinksRef = doc(db, 'settings', 'social-links');
  return setDoc(socialLinksRef, data);
};

// Address
export const getAddress = async (): Promise<Address | null> => {
  try {
    const addressRef = doc(db, 'settings', 'address');
    const snapshot = await getDoc(addressRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Address;
    }
    
    // Se não existir, criar com valor padrão
    const defaultAddress = {
      street: 'Rua Doutor Luiz Migliano',
      number: '1986',
      city: 'São Paulo',
      zipCode: '05711-001'
    };
    
    await setDoc(addressRef, defaultAddress);
    return { id: 'address', ...defaultAddress };
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return null;
  }
};

export const updateAddress = async (data: Omit<Address, 'id'>) => {
  const addressRef = doc(db, 'settings', 'address');
  return setDoc(addressRef, data);
};

// Home Videos
export const getHomeVideos = async (): Promise<HomeVideos | null> => {
  try {
    const videosRef = doc(db, 'settings', 'home-videos');
    const snapshot = await getDoc(videosRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as HomeVideos;
    }
    
    // Se não existir, criar com valores padrão
    const defaultVideos = {
      heroVideo: '/Video/Be2AIvideo.mp4',
      secondaryVideo: '/Video/Be2AIvideo.mp4'
    };
    
    await setDoc(videosRef, defaultVideos);
    return { id: 'home-videos', ...defaultVideos };
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return null;
  }
};

export const updateHomeVideos = async (data: Omit<HomeVideos, 'id'>) => {
  const videosRef = doc(db, 'settings', 'home-videos');
  return setDoc(videosRef, data);
};

// Services
export const getServices = async (): Promise<Service[]> => {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, orderBy('order', 'asc'));
    const servicesSnapshot = await getDocs(q);
    return servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
    return [];
  }
};

export const updateService = async (serviceId: string, data: Partial<Service>): Promise<boolean> => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return false;
  }
};

export const createService = async (data: Omit<Service, 'id'>): Promise<string | null> => {
  try {
    const servicesRef = collection(db, 'services');
    const newService = await addDoc(servicesRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return newService.id;
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return null;
  }
};

export const deleteService = async (serviceId: string): Promise<boolean> => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await deleteDoc(serviceRef);
    return true;
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    return false;
  }
};

// Função para criar os serviços iniciais
export const createInitialServices = async () => {
  try {
    const servicesRef = collection(db, 'services');
    const batch = writeBatch(db);

    const initialServices = [
      { 
        title: "À SUA MEDIDA",
        description: "Desenvolvemos soluções personalizadas que se adaptam perfeitamente às necessidades específicas do seu negócio, garantindo máxima eficiência e resultados."
      },
      { 
        title: "CLONES VIRTUAIS",
        description: "Crie uma réplica digital de si mesmo ou da sua equipa, permitindo interações personalizadas e atendimento 24/7 com a sua própria identidade."
      },
      { 
        title: "MASCOTES VIRTUAIS",
        description: "Dê vida à identidade da sua marca com mascotes virtuais interativas que criam conexões emocionais com seus clientes."
      },
      { 
        title: "VISITAS VIRTUAIS",
        description: "Ofereça experiências imersivas com tours virtuais interativos que permitem explorar espaços de forma realista e envolvente."
      },
      { 
        title: "ASSISTENTES VIRTUAIS",
        description: "Automatize tarefas e melhore o atendimento com assistentes virtuais inteligentes que aprendem e se adaptam ao seu negócio."
      },
      { 
        title: "ASSISTENTES PÓS-VENDA",
        description: "Mantenha seus clientes satisfeitos com assistentes pós-venda que garantem suporte contínuo e acompanhamento personalizado."
      },
      { 
        title: "CHATBOTS",
        description: "Implemente chatbots inteligentes que oferecem suporte instantâneo e personalizado, melhorando a experiência do cliente."
      },
      { 
        title: "GUIAS TURÍSTICOS VIRTUAIS",
        description: "Transforme a experiência turística com guias virtuais inteligentes que oferecem tours personalizados e informações culturais ricas em tempo real."
      },
      { 
        title: "SOFTWARE",
        description: "Desenvolvemos soluções de software sob medida, desde aplicações web até sistemas complexos de gestão empresarial."
      },
      { 
        title: "FOTOGRAFIA",
        description: "Capture a essência do seu negócio com serviços de fotografia profissional que destacam o melhor dos seus produtos e serviços."
      },
      { 
        title: "VÍDEO",
        description: "Conte sua história através de produções audiovisuais de alta qualidade que engajam e inspiram seu público-alvo."
      },
      { 
        title: "DESIGN",
        description: "Crie uma identidade visual impactante com designs modernos e criativos que comunicam a essência da sua marca."
      }
    ];

    initialServices.forEach((service, index) => {
      const docRef = doc(servicesRef);
      batch.set(docRef, {
        ...service,
        order: index,
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Erro ao criar serviços iniciais:', error);
    return false;
  }
}; 

// Generic helper to add a document to any collection
export async function addDocument<T extends Record<string, any>>(collectionName: string, data: T) {
  const ref = collection(db, collectionName);
  const result = await addDoc(ref, data);
  return result.id;
} 