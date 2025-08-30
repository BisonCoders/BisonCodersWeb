'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              BisonCoders
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Inicio
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Acerca de
            </Link>
            <Link href="#events" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Eventos
            </Link>
            {session && (
              <>
                <Link href="/posts" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Posts
                </Link>
                <Link href="/chat" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Chat
                </Link>
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  {session.user.image && (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user.name}</span>
                    {session.user.role === 'admin' && (
                      <span className="text-xs text-red-600 font-medium">Admin</span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <AuthButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}