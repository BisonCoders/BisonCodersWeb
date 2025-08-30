'use client';

import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Verificar preferencia guardada o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
    
    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (dark) => {
    const html = document.documentElement;
    
    if (dark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
    
    // Forzar re-renderizado
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  };

  const toggleDarkMode = () => {
    if (!mounted) return;
    
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    
    // Guardar preferencia
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // Evitar flash de contenido sin estilo durante SSR
  if (!mounted) {
    return { isDark: false, toggleDarkMode: () => {} };
  }

  return { isDark, toggleDarkMode };
}