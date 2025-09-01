'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ChatSidebar({ chats, selectedChat, onSelectChat, onCreateChat, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChatDisplayName = (chat) => {
    if (chat.type === 'general') return chat.name;
    if (chat.type === 'private') {
      const otherParticipant = chat.participants.find(p => p._id !== currentUser.id);
      return otherParticipant ? otherParticipant.name : chat.name;
    }
    return chat.name;
  };

  const getChatAvatar = (chat) => {
    if (chat.type === 'general') return '👥';
    if (chat.type === 'private') {
      const otherParticipant = chat.participants.find(p => p._id !== currentUser.id);
      return otherParticipant?.image ? (
        <Image
          src={otherParticipant.image}
          alt={otherParticipant.name}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : '👤';
    }
    return '👥';
  };

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return 'No hay mensajes';
    }
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.content.length > 30 
      ? lastMessage.content.substring(0, 30) + '...' 
      : lastMessage.content;
  };

  const getLastMessageTime = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return '';
    const lastMessage = chat.messages[chat.messages.length - 1];
    const date = new Date(lastMessage.timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h2>
          <button
            onClick={onCreateChat}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No se encontraron chats' : 'No hay chats disponibles'}
          </div>
        ) : (
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedChat?._id === chat._id
                    ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getChatAvatar(chat)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getChatDisplayName(chat)}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getLastMessageTime(chat)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {getLastMessage(chat)}
                    </p>
                    {chat.type === 'private' && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full">
                        Privado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {currentUser.image ? (
              <Image
                src={currentUser.image}
                alt={currentUser.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentUser.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
