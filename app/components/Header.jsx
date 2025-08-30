'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import AuthButton from './AuthButton';

export default function Header() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { data: session } = useSession();
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-2 00 dark:border-slate-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              BisonCoders
            </h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <a href="#home" className="text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Inicio
              </a>
              <a href="#about" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Nosotros
              </a>
              <a href="#events" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Eventos
              </a>
              <a href="/intros" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Intros
              </a>
              {session && (
                <>
                  <Link href="/chat" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    Chat
                  </Link>
                  <Link href="/posts" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    Posts
                  </Link>
                </>
              )}
              <a href="#members" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Miembros
              </a>
              <a href="#contact" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                Contacto
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
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

            {!session ? (
              <AuthButton />
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-sm">
                    {session?.user?.name?.[0] || 'U'}
                  </span>
                  <span className="text-sm font-medium max-w-[120px] truncate">{session?.user?.name || session?.user?.email}</span>
                  <svg className={`w-4 h-4 transition-transform ${openProfile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50">
                    <div className="py-2 text-sm">
                      <Link href="/profile" className="block px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Perfil
                      </Link>
                      <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="md:hidden">
              <button className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}