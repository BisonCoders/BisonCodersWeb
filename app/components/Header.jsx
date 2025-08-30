'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Header() {
  const { data: session, status } = useSession();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                BisonCoders
              </h1>
            </Link>
          </div>
          
          {/* Navigation - Solo si está logueado */}
          {session && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                <Link href="/" className="text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Feed
                </Link>
                <Link href="/projects/create" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Crear Proyecto
                </Link>
                <Link href={`/profile/${session.user.id}`} className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  Mi Perfil
                </Link>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {/* Toggle Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                {/* Create Project Button */}
                <Link
                  href="/projects/create"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Nuevo Proyecto</span>
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                    <img
                      src={session.user.image || '/default-avatar.svg'}
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
                      {session.user.name?.split(' ')[0]}
                    </span>
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        href={`/profile/${session.user.id}`}
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/projects/create"
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Crear Proyecto
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Configuración
                      </Link>
                      <hr className="my-1 border-slate-200 dark:border-slate-700" />
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signIn('google')}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={() => signIn('github')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}