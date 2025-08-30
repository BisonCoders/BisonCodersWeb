'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function Chat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session) {
      fetchMessages();
      // Polling para mensajes nuevos cada 3 segundos
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [status, session, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
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
        const message = await response.json();
        setMessages([...messages, message]);
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
        setMessages(messages.filter(msg => msg._id !== messageId));
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white shadow rounded-lg h-[600px] flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-900">Chat de la Comunidad</h1>
          </div>

          {message && (
            <div className={`p-3 mx-4 mt-2 rounded-md ${
              message.includes('exitosamente') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.author.email === session.user.email ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${msg.author.email === session.user.email ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg px-4 py-2 relative group`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {msg.author.image && (
                      <img 
                        src={msg.author.image} 
                        alt={msg.author.name} 
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {msg.author.name}
                      {msg.author.role === 'admin' && (
                        <span className="ml-1 bg-red-500 text-white px-1 rounded text-xs">
                          Admin
                        </span>
                      )}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                  
                  {(session.user.email === msg.author.email || session.user.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
