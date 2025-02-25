'use client';

import { useState, useEffect } from 'react';
import { FAQ, getFaqs, createFaq, updateFaq, deleteFaq, updateFaqOrder } from '@/lib/firebase/firebaseUtils';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from '@hello-pangea/dnd';
import { Plus, Pencil, Trash2, GripVertical, Copy } from 'lucide-react';
import Image from 'next/image';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Sobre a Empresa');

  const categories = [
    "Sobre a Empresa",
    "Serviços e Soluções",
    "Implementação e Integração",
    "Segurança e Privacidade",
    "Preços e Planos"
  ];

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      console.log('Carregando FAQs...');
      const loadedFaqs = await getFaqs();
      console.log('FAQs carregadas:', loadedFaqs);
      setFaqs(loadedFaqs);
    } catch (error) {
      console.error('Erro ao carregar FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const faqData = {
      category: formData.get('category') as string,
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
      order: editingFaq ? editingFaq.order : faqs.length
    };

    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, faqData);
      } else {
        await createFaq(faqData);
      }
      
      await loadFaqs();
      setShowForm(false);
      setEditingFaq(null);
    } catch (error) {
      console.error('Erro ao salvar FAQ:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta FAQ?')) return;
    
    try {
      await deleteFaq(id);
      await loadFaqs();
    } catch (error) {
      console.error('Erro ao excluir FAQ:', error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(faqs);
    
    // Separar FAQs por categoria
    const currentCategoryFaqs = items.filter(faq => faq.category === selectedCategory);
    const otherFaqs = items.filter(faq => faq.category !== selectedCategory);

    // Reordenar apenas as FAQs da categoria atual
    const [reorderedItem] = currentCategoryFaqs.splice(result.source.index, 1);
    currentCategoryFaqs.splice(result.destination.index, 0, reorderedItem);

    // Atualizar a ordem das FAQs da categoria atual
    const updatedCategoryFaqs = currentCategoryFaqs.map((faq, index) => ({
      ...faq,
      order: index * 100 // Usar a mesma escala que no backend
    }));

    // Combinar as FAQs atualizadas com as outras categorias
    const updatedItems = [...updatedCategoryFaqs, ...otherFaqs];
    setFaqs(updatedItems);

    try {
      await updateFaqOrder(updatedCategoryFaqs);
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
      await loadFaqs(); // Recarrega a ordem original em caso de erro
    }
  };

  const handleDuplicate = async (faq: FAQ) => {
    try {
      const duplicatedFaq = {
        category: faq.category,
        question: `${faq.question} (Cópia)`,
        answer: faq.answer,
        order: faqs.length // Adiciona no final da lista
      };

      await createFaq(duplicatedFaq);
      await loadFaqs();
    } catch (error) {
      console.error('Erro ao duplicar FAQ:', error);
    }
  };

  const filteredFaqs = faqs.filter(faq => faq.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-blue-500">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/logo/logobranco.png"
              alt="Be2AI Logo"
              width={120}
              height={40}
              className="w-auto h-auto"
            />
            <h1 className="text-2xl font-bold text-white">Gerenciar FAQs</h1>
          </div>
          <button
            onClick={() => {
              setEditingFaq(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded"
          >
            <Plus className="w-5 h-5" />
            Nova FAQ
          </button>
        </div>

        {/* Categorias */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 whitespace-nowrap rounded transition-colors ${
                selectedCategory === category
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="faqs">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {filteredFaqs.map((faq, index) => (
                  <Draggable key={faq.id} draggableId={faq.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="text-white/40 hover:text-white/60 cursor-grab pt-1"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="text-white font-medium mb-2">
                              {faq.question}
                            </div>
                            <div className="text-white/80 text-sm">
                              {faq.answer}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDuplicate(faq)}
                              className="text-white/60 hover:text-white transition-colors"
                              title="Duplicar FAQ"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingFaq(faq);
                                setShowForm(true);
                              }}
                              className="text-white/60 hover:text-white transition-colors"
                              title="Editar FAQ"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq.id)}
                              className="text-white/60 hover:text-white transition-colors"
                              title="Excluir FAQ"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Modal de Edição/Criação */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-white mb-6">
                {editingFaq ? 'Editar FAQ' : 'Nova FAQ'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Categoria
                  </label>
                  <select
                    name="category"
                    defaultValue={editingFaq?.category || selectedCategory}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Pergunta
                  </label>
                  <input
                    type="text"
                    name="question"
                    defaultValue={editingFaq?.question || ''}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Resposta
                  </label>
                  <textarea
                    name="answer"
                    defaultValue={editingFaq?.answer || ''}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingFaq(null);
                    }}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 