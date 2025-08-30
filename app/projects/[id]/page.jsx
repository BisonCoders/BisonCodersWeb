'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CodeEditor from '../../../components/CodeEditor';
import ProjectPreview from '../../../components/ProjectPreview';

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // split, editor, preview
  const [showForkModal, setShowForkModal] = useState(false);

  useEffect(() => {
    if (id && status !== 'loading') {
      loadProject();
    }
  }, [id, status]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
      } else {
        setError(data.error || 'Error cargando proyecto');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (files) => {
    if (!project?.isOwner || saving) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setProject(prev => ({ ...prev, files, updatedAt: new Date().toISOString() }));
      }
    } catch (error) {
      console.error('Error guardando:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFilesChange = (newFiles) => {
    setProject(prev => ({ ...prev, files: newFiles }));
  };

  const handleLike = async () => {
    if (!session || project?.isOwner) return;

    try {
      const response = await fetch(`/api/projects/${id}/like`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProject(prev => ({
          ...prev,
          likesCount: data.likesCount,
          isLiked: data.isLiked,
        }));
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleFork = async (forkData) => {
    if (!session || project?.isOwner) return;

    try {
      const response = await fetch(`/api/projects/${id}/fork`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forkData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowForkModal(false);
        router.push(`/projects/${data.project._id}`);
      }
    } catch (error) {
      console.error('Error al hacer fork:', error);
    }
  };

  const handleDelete = async () => {
    if (!project?.isOwner || !confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Error</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← Volver al feed
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Inicia sesión para ver proyectos
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Necesitas estar autenticado para acceder a los proyectos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {project?.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                por {project?.ownerName} • {project?.projectType}
                {saving && <span className="ml-2 text-indigo-600">Guardando...</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Selector */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              {[
                { mode: 'split', icon: '⊞', label: 'Split' },
                { mode: 'editor', icon: '📝', label: 'Editor' },
                { mode: 'preview', icon: '👁️', label: 'Preview' }
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    viewMode === mode
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="mr-1">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Like Button */}
              {!project?.isOwner && (
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    project?.isLiked
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <svg className={`w-4 h-4 ${project?.isLiked ? 'fill-current' : ''}`} fill={project?.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {project?.likesCount || 0}
                </button>
              )}

              {/* Fork Button */}
              {!project?.isOwner && (
                <button
                  onClick={() => setShowForkModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Fork
                </button>
              )}

              {/* Delete Button (Owner only) */}
              {project?.isOwner && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`${
          viewMode === 'preview' ? 'hidden' : viewMode === 'editor' ? 'w-full' : 'w-1/2'
        } border-r border-slate-200 dark:border-slate-700`}>
          <CodeEditor
            files={project?.files || []}
            onFilesChange={handleFilesChange}
            onSave={saveProject}
            readOnly={!project?.isOwner}
            height="100%"
          />
        </div>

        {/* Preview */}
        <div className={`${
          viewMode === 'editor' ? 'hidden' : viewMode === 'preview' ? 'w-full' : 'w-1/2'
        }`}>
          <ProjectPreview
            files={project?.files || []}
            mainFile={project?.mainFile}
            projectType={project?.projectType}
            className="h-full"
          />
        </div>
      </div>

      {/* Fork Modal */}
      {showForkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Fork Proyecto
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleFork({
                title: formData.get('title'),
                description: formData.get('description'),
              });
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={`Fork de ${project?.title}`}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  defaultValue={`Fork del proyecto de ${project?.ownerName}`}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForkModal(false)}
                  className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Crear Fork
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}