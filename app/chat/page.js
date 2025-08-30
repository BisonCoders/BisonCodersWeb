'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStream } from '../../lib/useChatStream';
import Header from '../components/Header';

export default function Chat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, isConnected } = useChatStream();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, session, router]);

  // Removido el scroll automático - solo hacer scroll cuando el usuario envía un mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        // Solo hacer scroll cuando el usuario envía un mensaje
        setTimeout(() => scrollToBottom(), 100);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      const response = await fetch(`/api/chat?id=${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Mensaje eliminado exitosamente');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error al eliminar el mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al eliminar el mensaje');
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const today = new Date();
    const messageDate = new Date(dateString);
    const isToday = today.toDateString() === messageDate.toDateString();
    
    if (isToday) {
      return 'Hoy';
    } else {
      return messageDate.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header del chat */}
        <div className="bg-card rounded-t-2xl p-6 border-b border-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Chat de la Comunidad</h1>
                <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                  </div>
                  <span>•</span>
                  <span>{messages.length} mensajes</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="bg-card rounded-b-2xl">
          {message && (
            <div className={`m-4 p-4 rounded-xl border-l-4 ${
              message.includes('exitosamente') 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-400' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="h-[calc(100vh-300px)] min-h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => {
                const isOwnMessage = msg.author.email === session.user.email;
                const showDate = index === 0 || 
                  new Date(msg.createdAt).toDateString() !== 
                  new Date(messages[index - 1].createdAt).toDateString();

                return (
                  <div key={msg._id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="bg-muted text-muted-foreground px-4 py-1 rounded-full text-xs font-medium">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
                      <div className={`max-w-md lg:max-w-lg relative group ${
                        isOwnMessage ? 'order-2' : 'order-1'
                      }`}>
                        <div className={`rounded-lg px-4 py-3 shadow-sm border ${
                          isOwnMessage 
                            ? 'gradient-primary text-white border-primary-600' 
                            : 'bg-muted text-muted-foreground border-default'
                        }`}>
                          {/* Header del mensaje */}
                          <div className="flex items-center space-x-2 mb-2">
                            {!isOwnMessage && msg.author.image && (
                              <img 
                                src={msg.author.image} 
                                alt={msg.author.name} 
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className={`text-xs font-semibold ${
                              isOwnMessage ? 'text-white/90' : 'text-foreground'
                            }`}>
                              {msg.author.name}
                            </span>
                            {msg.author.role === 'admin' && (
                              <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                Admin
                              </span>
                            )}
                            <span className={`text-xs ${
                              isOwnMessage ? 'text-white/70' : 'text-muted-foreground'
                            }`}>
                              {formatTime(msg.createdAt)}
                            </span>
                            {isOwnMessage && msg.author.image && (
                              <img 
                                src={msg.author.image} 
                                alt={msg.author.name} 
                                className="w-6 h-6 rounded-full ml-auto"
                              />
                            )}
                          </div>
                          
                          {/* Contenido del mensaje */}
                          <p className={`text-sm leading-relaxed ${
                            isOwnMessage ? 'text-white' : 'text-foreground'
                          }`}>
                            {msg.content}
                          </p>
                          
                          {/* Botón eliminar */}
                          {(session.user.email === msg.author.email || session.user.role === 'admin') && (
                            <button
                              onClick={() => handleDelete(msg._id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 text-xs text-red-500 hover:text-red-700 bg-card border border-default rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de mensaje */}
            <div className="border-t border-default p-4 bg-card">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="w-full px-4 py-3 bg-background border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-foreground placeholder-muted-foreground"
                    disabled={loading || !isConnected}
                  />
                  {!isConnected && (
                    <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 text-sm font-medium">Reconectando...</span>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim() || !isConnected}
                  className="px-6 py-3 gradient-primary text-white rounded-lg hover:gradient-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
              
              {/* Indicador de estado */}
              <div className="mt-3 text-center">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  isConnected 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {isConnected ? '● Chat en tiempo real activo' : '● Reconectando...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
