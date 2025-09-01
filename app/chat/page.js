'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatInterface from '@/components/ChatInterface';
import ChatSidebar from '@/components/ChatSidebar';
import CreateChatModal from '@/components/CreateChatModal';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchChats();
    fetchUsers();
  }, [session, status, router]);

  // Manejar parámetro de chatId en la URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const chatId = urlParams.get('chatId');
      
      if (chatId && chats.length > 0) {
        const chat = chats.find(c => c._id === chatId);
        if (chat) {
          setSelectedChat(chat);
        }
      }
    }
  }, [chats]);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        
        // Si no hay chats, inicializar el chat general
        if (data.length === 0) {
          const initResponse = await fetch('/api/chat/init', { method: 'POST' });
          if (initResponse.ok) {
            const initData = await initResponse.json();
            setChats([initData.chat]);
            setSelectedChat(initData.chat);
          }
      } else {
          setChats(data);
          
          // Si no hay chat seleccionado y hay chats disponibles, seleccionar el primero
          if (!selectedChat && data.length > 0) {
            setSelectedChat(data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/chat/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleCreateChat = async (chatData) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats(prev => [newChat, ...prev]);
        setSelectedChat(newChat);
        setShowCreateModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear el chat');
      }
    } catch (error) {
      console.error('Error al crear chat:', error);
      alert('Error al crear el chat');
    }
  };

  const handleChatUpdate = (updatedChatOrFunction) => {
    // Si es una función, la ejecutamos con el estado actual
    if (typeof updatedChatOrFunction === 'function') {
      setChats(prev => prev.map(chat => 
        chat._id === selectedChat._id ? updatedChatOrFunction(chat) : chat
      ));
      
      if (selectedChat) {
        setSelectedChat(prev => updatedChatOrFunction(prev));
      }
    } else {
      // Si es un objeto, actualizamos directamente
      setChats(prev => prev.map(chat => 
        chat._id === updatedChatOrFunction._id ? updatedChatOrFunction : chat
      ));
      
      if (selectedChat && selectedChat._id === updatedChatOrFunction._id) {
        setSelectedChat(updatedChatOrFunction);
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header con botón de regreso */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chat de BisonCoders</h1>
          <div className="w-20"></div> {/* Espaciador para centrar el título */}
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onCreateChat={() => setShowCreateModal(true)}
          currentUser={session.user}
        />

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatInterface
              chat={selectedChat}
              currentUser={session.user}
              onChatUpdate={handleChatUpdate}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Bienvenido al Chat
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Selecciona un chat para comenzar a conversar
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Crear Nuevo Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Chat Modal */}
      {showCreateModal && (
        <CreateChatModal
          users={users}
          onClose={() => setShowCreateModal(false)}
          onCreateChat={handleCreateChat}
        />
      )}
    </div>
  );
}
