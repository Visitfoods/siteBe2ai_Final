'use client';

import { useState, useEffect } from 'react';
import { Message, getMessages, markMessageAsRead, deleteMessage } from '@/lib/firebase/firebaseUtils';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import { Eye, Trash2, Mail, MailOpen } from 'lucide-react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const loadedMessages = await getMessages();
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      await loadMessages();
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    
    try {
      await deleteMessage(id);
      await loadMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Carregando...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Lista de Mensagens */}
      <div className="w-1/3 border-r border-white/10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white p-6 border-b border-white/10">
          Mensagens
        </h1>

        <div className="divide-y divide-white/10">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedMessage?.id === message.id
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white font-medium">{message.nome}</div>
                  <div className="text-white/60 text-sm">{message.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  {message.status === 'não lida' ? (
                    <Mail className="w-4 h-4 text-white" />
                  ) : (
                    <MailOpen className="w-4 h-4 text-white/60" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm text-white/80 line-clamp-2">
                {message.mensagem}
              </div>
              <div className="mt-2 text-xs text-white/60">
                {format(new Date(message.dataEnvio), "d 'de' MMMM 'às' HH:mm", {
                  locale: pt,
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualização da Mensagem */}
      <div className="flex-1 p-6">
        {selectedMessage ? (
          <div>
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {selectedMessage.nome}
                </h2>
                <div className="text-white/60">{selectedMessage.email}</div>
                <div className="text-sm text-white/60 mt-1">
                  {format(
                    new Date(selectedMessage.dataEnvio),
                    "d 'de' MMMM 'de' yyyy 'às' HH:mm",
                    { locale: pt }
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {selectedMessage.status === 'não lida' && (
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Marcar como lida
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
              <div className="text-white whitespace-pre-wrap">
                {selectedMessage.mensagem}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/40">
            Selecione uma mensagem para visualizar
          </div>
        )}
      </div>
    </div>
  );
} 