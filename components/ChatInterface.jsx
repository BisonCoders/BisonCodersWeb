'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import pusherClient from '@/lib/pusherClient';

export default function ChatInterface({ chat, currentUser, onChatUpdate }) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!chat) return;

    // Suscribirse al canal de Pusher
    const channel = pusherClient.subscribe(`chat-${chat._id}`);
    channelRef.current = channel;

    // Escuchar nuevos mensajes
    channel.bind('new-message', (data) => {
      if (data.chatId === chat._id) {
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, data.message]
        };
        onChatUpdate(updatedChat);
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
    scrollToBottom();
  }, [chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/chat/${chat._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        setIsTyping(false);
        // Notificar que dejó de escribir
        if (channelRef.current) {
          channelRef.current.trigger('client-stop-typing', {
            userId: currentUser.id,
            userName: currentUser.name
          });
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
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
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  }`}>
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
                    <p className={`text-sm leading-relaxed ${
                      isOwnMessage ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {message.content}
                    </p>
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
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
