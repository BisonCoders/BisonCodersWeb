'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import pusherClient from '@/lib/pusherClient';

export default function ChatInterface({ chat, currentUser, onChatUpdate }) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesStartRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!chat) return;

    // Suscribirse al canal de Pusher
    const channel = pusherClient.subscribe(`chat-${chat._id}`);
    channelRef.current = channel;

    // Escuchar nuevos mensajes
    channel.bind('new-message', (data) => {
      if (data.chatId === chat._id) {
        // Verificar si ya tenemos este mensaje por ID o si es un mensaje optimista que estamos esperando
        const messageExists = chat.messages.some(msg => 
          msg._id === data.message._id ||
          (msg.isOptimistic && msg.content === data.message.content && 
           msg.sender._id === data.message.sender._id)
        );
        
        if (!messageExists) {
          // Si no existe, agregarlo al final
          onChatUpdate(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, data.message]
          }));
        } else if (messageExists) {
          // Si existe un mensaje optimista, reemplazarlo con el real
          onChatUpdate(prevChat => ({
            ...prevChat,
            messages: prevChat.messages.map(msg => 
              msg.isOptimistic && msg.content === data.message.content && 
              msg.sender._id === data.message.sender._id ? data.message : msg
            )
          }));
        }
      }
    });

    // Escuchar indicador de escritura
    channel.bind('typing', (data) => {
      if (data.userId !== currentUser.id) {
        setTypingUsers(prev => {
          const filtered = prev.filter(user => user.id !== data.userId);
          return [...filtered, { id: data.userId, name: data.userName }];
        });
      }
    });

    channel.bind('stop-typing', (data) => {
      if (data.userId !== currentUser.id) {
        setTypingUsers(prev => prev.filter(user => user.id !== data.userId));
      }
    });

    return () => {
      if (channelRef.current) {
        pusherClient.unsubscribe(`chat-${chat._id}`);
      }
    };
  }, [chat._id, currentUser.id]);

  useEffect(() => {
    // Scroll automático inteligente
    if (!loading) {
      // Si es un mensaje nuevo (optimistic update), usar scroll inteligente
      const hasNewMessage = chat.messages.some(msg => msg.isOptimistic);
      const isLastMessageFromCurrentUser = chat.messages.length > 0 && 
        chat.messages[chat.messages.length - 1].sender._id === currentUser.id;
      
      if (hasNewMessage || isLastMessageFromCurrentUser) {
        scrollToBottomForNewMessage();
      } else {
        // Para carga inicial, ir al final
        scrollToBottom();
      }
    }
  }, [chat.messages, loading, currentUser.id]);

  // Inicializar paginación cuando cambia el chat
  useEffect(() => {
    if (chat?.pagination) {
      setHasMore(chat.pagination.hasMore);
      setPage(chat.pagination.page);
    }
  }, [chat?._id, chat?.pagination]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Scroll automático solo para mensajes nuevos (no para carga de mensajes antiguos)
  const scrollToBottomForNewMessage = useCallback(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      const isAtBottom = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 100;
      
      // Solo hacer scroll si el usuario está cerca del final
      if (isAtBottom) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    }
  }, []);

  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/chat/${chat._id}?page=${page + 1}&limit=30`);
      if (response.ok) {
        const data = await response.json();
        
        // Agregar los mensajes antiguos al principio, limitando a 200 mensajes máximo
        const allMessages = [...data.messages, ...chat.messages];
        const limitedMessages = allMessages.slice(-200); // Mantener solo los últimos 200 mensajes
        
        const updatedChat = {
          ...chat,
          messages: limitedMessages
        };
        
        onChatUpdate(updatedChat);
        setPage(page + 1);
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error al cargar más mensajes:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, chat, page, onChatUpdate]);

  // Observador para detectar cuando el usuario llega al inicio
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreMessages();
        }
      },
      { threshold: 0.1 }
    );

    if (messagesStartRef.current) {
      observer.observe(messagesStartRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMoreMessages]);

  // Listener para el botón de scroll al final
  useEffect(() => {
    const messagesContainer = messagesStartRef.current?.parentElement;
    if (!messagesContainer) return;

    const handleScroll = () => {
      const isAtBottom = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 100;
      setShowScrollButton(!isAtBottom);
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    return () => messagesContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsTyping(false);

    // Crear mensaje optimista
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      sender: {
        _id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image
      },
      content: messageContent,
      timestamp: new Date().toISOString(),
      isOptimistic: true
    };

    // Actualizar inmediatamente la UI
    const updatedChat = {
      ...chat,
      messages: [...chat.messages, optimisticMessage]
    };
    onChatUpdate(updatedChat);

    // Notificar que dejó de escribir
    if (channelRef.current) {
      channelRef.current.trigger('client-stop-typing', {
        userId: currentUser.id,
        userName: currentUser.name
      });
    }

    try {
      const response = await fetch(`/api/chat/${chat._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: messageContent }),
      });

      if (response.ok) {
        // El mensaje real se manejará a través del listener de Pusher
        // No necesitamos hacer nada aquí porque Pusher enviará el mensaje
        // y el listener lo manejará correctamente
      } else {
        const error = await response.json();
        console.error('Error al enviar mensaje:', error);
        
        // Remover el mensaje optimista en caso de error
        onChatUpdate(prevChat => {
          const errorChat = {
            ...prevChat,
            messages: prevChat.messages.filter(msg => !msg.isOptimistic)
          };
          return errorChat;
        });
        
        // Restaurar el mensaje en el input
        setNewMessage(messageContent);
        alert(error.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Remover el mensaje optimista en caso de error
      onChatUpdate(prevChat => {
        const errorChat = {
          ...prevChat,
          messages: prevChat.messages.filter(msg => !msg.isOptimistic)
        };
        return errorChat;
      });
      
      // Restaurar el mensaje en el input
      setNewMessage(messageContent);
      alert('Error al enviar el mensaje');
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      // Notificar que está escribiendo
      if (channelRef.current) {
        channelRef.current.trigger('client-typing', {
          userId: currentUser.id,
          userName: currentUser.name
        });
      }
    }

    // Limpiar el indicador de escritura después de 3 segundos
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
      if (channelRef.current) {
        channelRef.current.trigger('client-stop-typing', {
          userId: currentUser.id,
          userName: currentUser.name
        });
      }
    }, 3000);
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

  const getChatTitle = () => {
    if (chat.type === 'general') return chat.name;
    if (chat.type === 'private') {
      const otherParticipant = chat.participants.find(p => p._id !== currentUser.id);
      return otherParticipant ? otherParticipant.name : chat.name;
    }
    return chat.name;
  };

  const getChatAvatar = () => {
    if (chat.type === 'general') return '👥';
    if (chat.type === 'private') {
      const otherParticipant = chat.participants.find(p => p._id !== currentUser.id);
      return otherParticipant?.image ? (
        <Image
          src={otherParticipant.image}
          alt={otherParticipant.name}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : '👤';
    }
    return '👥';
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 h-full">
      {/* Chat Header - Fijo */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getChatAvatar()}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getChatTitle()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chat.type === 'private' ? 'Chat privado' : `${chat.participants.length} participantes`}
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Solo esta área hace scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scroll-smooth">
        {/* Indicador de carga para mensajes antiguos */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Observador para cargar más mensajes */}
        <div ref={messagesStartRef} className="h-1" />
        
        {/* Indicador de más mensajes disponibles */}
        {hasMore && !loading && (
          <div className="flex justify-center py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Desliza hacia arriba para cargar más mensajes
            </span>
          </div>
        )}
        {chat.messages.map((message, index) => {
          const isOwnMessage = message.sender._id === currentUser.id;
          const showDate = index === 0 || 
            new Date(message.timestamp).toDateString() !== 
            new Date(chat.messages[index - 1].timestamp).toDateString();

          return (
            <div key={message._id || index}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-1 rounded-full text-xs font-medium">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md lg:max-w-lg relative group ${
                  isOwnMessage ? 'order-2' : 'order-1'
                }`}>
                                     <div className={`rounded-lg px-4 py-3 shadow-sm border ${
                     isOwnMessage 
                       ? 'bg-blue-600 text-white border-blue-600' 
                       : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600'
                   } ${message.isOptimistic ? 'opacity-70' : ''}`}>
                    {/* Message Header */}
                    <div className="flex items-center space-x-2 mb-2">
                      {!isOwnMessage && message.sender.image && (
                        <Image 
                          src={message.sender.image} 
                          alt={message.sender.name} 
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      )}
                      <span className={`text-xs font-semibold ${
                        isOwnMessage ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {message.sender.name}
                      </span>
                      <span className={`text-xs ${
                        isOwnMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                                         {/* Message Content */}
                     <div className="flex items-center justify-between">
                       <p className={`text-sm leading-relaxed ${
                         isOwnMessage ? 'text-white' : 'text-gray-900 dark:text-white'
                       }`}>
                         {message.content}
                       </p>
                       {message.isOptimistic && (
                         <div className="ml-2">
                           <div className="w-3 h-3 border-2 border-white/30 border-t-white/90 rounded-full animate-spin"></div>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {typingUsers.map(user => user.name).join(', ')} está escribiendo...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Botón para ir al final */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-10"
            title="Ir al final"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Message Input - Fijo en la parte inferior */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Escribe tu mensaje..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
