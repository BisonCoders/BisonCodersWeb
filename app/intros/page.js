'use client';

import Link from 'next/link';
import { usePresentacionesAuto, useEstadisticasPresentaciones } from './hooks/usePresentacionesAuto';



const IntrosPage = () => {
  const presentaciones = usePresentacionesAuto();
  const stats = useEstadisticasPresentaciones();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header con estadísticas */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Presentaciones BisonCoders
            </h1>
            <Link
              href="/intros/como-contribuir"
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva presentación
            </Link>
          </div>
          
          {/* Stats bar profesional */}
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors">
              <strong className="text-slate-900 dark:text-slate-100">{stats.total}</strong> presentaciones
            </span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors">
              <strong className="text-slate-900 dark:text-slate-100">{stats.personales}</strong> miembros
            </span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors">
              <strong className="text-slate-900 dark:text-slate-100">{stats.guias}</strong> recursos
            </span>
          </div>
        </div>
      </div>

      {/* Feed principal */}
      <div className="max-w-2xl mx-auto">
        {/* Card de bienvenida */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Comunidad de Presentaciones
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Explora las presentaciones de nuestros miembros y comparte la tuya
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/intros/como-contribuir"
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Crear presentación
              </Link>
              <Link
                href="/intros/ejemplo-presentacion"
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Ver ejemplo
              </Link>
            </div>
          </div>
        </div>

        {/* Cards de presentaciones */}
        {presentaciones.map((presentacion, index) => (
          <PresentacionCard key={presentacion.nombre} presentacion={presentacion} index={index} />
        ))}

        {/* Footer del feed */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            ¿Listo para destacar?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            Comparte tu historia y conecta con la comunidad
          </p>
          <Link
            href="/intros/como-contribuir"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Comenzar ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

// Componente Card individual tipo Twitter
const PresentacionCard = ({ presentacion, index }) => {
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'guia': return 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'plantilla': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'personal': return 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getTipoTexto = (tipo) => {
    switch (tipo) {
      case 'guia': return 'Guía';
      case 'plantilla': return 'Plantilla';
      case 'personal': return 'Personal';
      default: return 'General';
    }
  };

  return (
    <Link href={`/intros/${presentacion.nombre}`}>
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group">
        {/* Header del card */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm">
            {presentacion.avatar || presentacion.autor.charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Nombre y tipo */}
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {presentacion.titulo}
              </h3>
              <span className={`px-3 py-1 text-xs rounded-lg font-medium ${getTipoColor(presentacion.tipo)}`}>
                {getTipoTexto(presentacion.tipo)}
              </span>
            </div>
            
            {/* Autor y fecha */}
            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>{presentacion.autor}</span>
              <span>•</span>
              <span>{new Date(presentacion.fechaCreacion).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {presentacion.descripcion}
          </p>
        </div>

        {/* Tags */}
        {presentacion.tags && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {presentacion.tags.map(tag => (
                <span key={tag} className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Acciones profesionales */}
        <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm">Ver presentación</span>
          </div>
          
          <div className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm">Inspirarse</span>
          </div>
          
          {presentacion.tipo === 'personal' && (
            <div className="flex items-center gap-2 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span className="text-sm">Conectar</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default IntrosPage;