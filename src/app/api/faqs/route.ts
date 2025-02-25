import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const staticFaqs = [
  {
    id: '1',
    category: 'Sobre a Empresa',
    question: 'O que é a be2ai?',
    answer: 'A be2ai é uma empresa inovadora especializada em soluções de inteligência artificial, focada em desenvolver tecnologias personalizadas para transformação digital de negócios.',
    order: 0
  },
  {
    id: '2',
    category: 'Serviços e Soluções',
    question: 'Quais são os principais serviços oferecidos?',
    answer: 'Oferecemos uma ampla gama de serviços, incluindo desenvolvimento de assistentes virtuais, chatbots, clones virtuais, guias turísticos virtuais, e soluções personalizadas de IA.',
    order: 1
  },
  {
    id: '3',
    category: 'Implementação e Integração',
    question: 'Como é o processo de implementação?',
    answer: 'O processo de implementação é personalizado para cada cliente, começando com uma análise detalhada das necessidades, seguido pelo desenvolvimento da solução e suporte contínuo.',
    order: 2
  },
  {
    id: '4',
    category: 'Segurança e Privacidade',
    question: 'Como a be2ai protege os dados dos clientes?',
    answer: 'Utilizamos as mais avançadas práticas de segurança e criptografia, seguindo todas as regulamentações de proteção de dados aplicáveis.',
    order: 3
  },
  {
    id: '5',
    category: 'Preços e Planos',
    question: 'Como funciona o modelo de preços?',
    answer: 'Nossos preços são baseados nas necessidades específicas de cada projeto. Entre em contato conosco para uma avaliação personalizada.',
    order: 4
  }
];

// Listar FAQs (rota pública)
export async function GET() {
  try {
    const faqsRef = collection(db, 'faqs');
    const q = query(faqsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const faqs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ faqs });
  } catch (error: any) {
    console.error('Erro ao buscar FAQs:', error);
    return NextResponse.json(
      { error: 'Erro ao listar FAQs' },
      { status: 500 }
    );
  }
}

// Inicializar FAQs no Firestore (rota protegida)
export async function POST() {
  try {
    const faqsRef = collection(db, 'faqs');
    
    // Verificar se já existem FAQs
    const snapshot = await getDocs(faqsRef);
    if (!snapshot.empty) {
      return NextResponse.json({ 
        success: false, 
        message: 'FAQs já foram inicializadas' 
      });
    }

    // Adicionar cada FAQ ao Firestore
    const promises = staticFaqs.map(faq => {
      const { id, ...faqData } = faq;
      return addDoc(faqsRef, faqData);
    });

    await Promise.all(promises);

    return NextResponse.json({ 
      success: true, 
      message: 'FAQs inicializadas com sucesso' 
    });
  } catch (error: any) {
    console.error('Erro ao inicializar FAQs:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao inicializar FAQs' 
    }, { status: 500 });
  }
} 