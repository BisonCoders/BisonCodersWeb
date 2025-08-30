'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';

export default function ProjectsFeed() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      loadProjects();
    }
  }, [status]);

  const loadProjects = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects?page=${pageNum}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        if (pageNum === 1) {
          setProjects(data.projects);
        } else {
          setProjects(prev => [...prev, ...data.projects]);
        }
        setHasMore(data.pagination.hasNext);
        setPage(pageNum);
      } else {
        setError(data.error || 'Error cargando proyectos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadProjects(page + 1);
    }
  };

  const handleProjectUpdate = (projectId, updates) => {
    setProjects(prev => prev.map(p => 
      p._id === projectId ? { ...p, ...updates } : p
    ));
  };

  // Si no está autenticado, mostrar landing
  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="ml-4 space-y-2">
                  <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m18 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">BisonCoders</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            La plataforma colaborativa donde puedes crear, compartir y explorar proyectos de código con la comunidad.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m18 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Editor VS Code</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Crea y edita código con un editor completo directamente en el navegador</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Preview en Vivo</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Ve tus cambios en tiempo real mientras programas</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Comunidad</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Comparte proyectos, da feedback y aprende de otros desarrolladores</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Inicia sesión para crear tu primer proyecto y unirte a la comunidad BisonCoders
            </p>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Los botones de login están en la esquina superior derecha ↗️
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header del Feed */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Feed de Proyectos
          </h1>
          <Link
            href="/projects/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Proyecto
          </Link>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400">
          Explora los últimos proyectos de la comunidad BisonCoders
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-6">
        {projects.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No hay proyectos aún
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Sé el primero en compartir un proyecto con la comunidad
            </p>
            <Link
              href="/projects/create"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Primer Proyecto
            </Link>
          </div>
        ) : (
          <>
            {projects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                onUpdate={handleProjectUpdate}
                currentUserId={session?.user?.id}
              />
            ))}
          </>
        )}
      </div>

      {/* Load More */}
      {hasMore && projects.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                Cargando...
              </div>
            ) : (
              'Cargar más proyectos'
            )}
          </button>
        </div>
      )}
    </div>
  );
}