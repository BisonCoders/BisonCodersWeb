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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
         const newMsg = await response.json();
         // El mensaje se agregará automáticamente a través del SSE
         setNewMessage('');
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
         // El mensaje se eliminará automáticamente a través del SSE
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          {/* Header del chat */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <span className="text-3xl">💬</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Chat de la Comunidad</h1>
                  <div className="flex items-center space-x-3 text-white/90">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-sm font-medium">
                        {isConnected ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    <span className="text-white/50">•</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {messages.length} mensajes
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-white/90 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="h-[600px] flex flex-col">
            {message && (
              <div className={`p-4 mx-6 mt-4 rounded-xl border-l-4 ${
                message.includes('exitosamente') 
                  ? 'bg-green-50 text-green-800 border-green-400' 
                  : 'bg-red-50 text-red-800 border-red-400'
              }`}>
                {message}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
              {messages.map((msg, index) => {
                const isOwnMessage = msg.author.email === session.user.email;
                const showDate = index === 0 || 
                  new Date(msg.createdAt).toDateString() !== 
                  new Date(messages[index - 1].createdAt).toDateString();

                return (
                  <div key={msg._id}>
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <span className="bg-white/10 backdrop-blur-sm text-white/80 px-6 py-2 rounded-full text-sm font-medium border border-white/20">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
                      <div className={`max-w-xs lg:max-w-md relative group ${
                        isOwnMessage ? 'order-2' : 'order-1'
                      }`}>
                        <div className={`rounded-2xl px-6 py-4 shadow-xl backdrop-blur-sm border ${
                          isOwnMessage 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/30' 
                            : 'bg-white/10 text-white border-white/20'
                        }`}>
                          {/* Header del mensaje */}
                          <div className="flex items-center space-x-3 mb-3">
                            {!isOwnMessage && msg.author.image && (
                              <img 
                                src={msg.author.image} 
                                alt={msg.author.name} 
                                className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg"
                              />
                            )}
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-semibold ${
                                isOwnMessage ? 'text-white' : 'text-white'
                              }`}>
                                {msg.author.name}
                              </span>
                              {msg.author.role === 'admin' && (
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  isOwnMessage 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-red-500/20 text-red-200'
                                }`}>
                                  👑 Admin
                                </span>
                              )}
                            </div>
                            {isOwnMessage && msg.author.image && (
                              <img 
                                src={msg.author.image} 
                                alt={msg.author.name} 
                                className="w-10 h-10 rounded-full border-2 border-purple-400/30 shadow-lg"
                              />
                            )}
                          </div>
                          
                          {/* Contenido del mensaje */}
                          <p className={`text-sm leading-relaxed ${
                            isOwnMessage ? 'text-white' : 'text-white/90'
                          }`}>
                            {msg.content}
                          </p>
                          
                          {/* Hora del mensaje */}
                          <div className={`flex justify-between items-center mt-3 ${
                            isOwnMessage ? 'text-white/70' : 'text-white/50'
                          }`}>
                            <span className="text-xs">{formatTime(msg.createdAt)}</span>
                            {(session.user.email === msg.author.email || session.user.role === 'admin') && (
                              <button
                                onClick={() => handleDelete(msg._id)}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs hover:text-red-300 ml-2 bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de mensaje */}
            <div className="border-t border-white/20 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg text-white placeholder-white/50 backdrop-blur-sm"
                    disabled={loading || !isConnected}
                  />
                  {!isConnected && (
                    <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-red-200 text-sm font-medium">Reconectando...</span>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim() || !isConnected}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-medium backdrop-blur-sm"
                >
                  {loading ? 'Enviando...' : '💬 Enviar'}
                </button>
              </form>
              
              {/* Indicador de estado */}
              <div className="mt-4 text-center">
                <span className={`text-xs px-4 py-2 rounded-full backdrop-blur-sm border ${
                  isConnected 
                    ? 'bg-green-500/20 text-green-200 border-green-400/30' 
                    : 'bg-red-500/20 text-red-200 border-red-400/30'
                }`}>
                  {isConnected ? '🟢 Chat en tiempo real activo' : '🔴 Reconectando...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
