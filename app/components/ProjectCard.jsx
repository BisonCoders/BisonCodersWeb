'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProjectCard({ project, onUpdate, currentUserId }) {
  const [isLiking, setIsLiking] = useState(false);

  const isOwner = currentUserId === project.ownerId;

  const handleLike = async (e) => {
    e.preventDefault(); // Prevenir navegación del Link padre
    
    if (isLiking || isOwner) return; // No permitir like propio

    setIsLiking(true);
    try {
      const response = await fetch(`/api/projects/${project._id}/like`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onUpdate(project._id, {
          likesCount: data.likesCount,
          isLiked: data.isLiked,
        });
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const getProjectTypeIcon = (type) => {
    const icons = {
      'html': '🌐',
      'react': '⚛️',
      'vue': '🖖',
      'vanilla-js': '📄',
      'css': '🎨',
      'markdown': '📝',
    };
    return icons[type] || '📄';
  };

  const getProjectTypeColor = (type) => {
    const colors = {
      'html': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'react': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'vue': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'vanilla-js': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      'css': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'markdown': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1h';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Hace 1 día';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    
    return date.toLocaleDateString('es-ES');
  };

  return (
    <Link href={`/projects/${project._id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md dark:hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-slate-900/20 transition-all duration-200 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <img
              src={project.ownerImage || '/default-avatar.svg'}
              alt={project.ownerName}
              className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-600"
            />
            
            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {project.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-lg font-medium ${getProjectTypeColor(project.projectType)}`}>
                  {getProjectTypeIcon(project.projectType)} {project.projectType.toUpperCase()}
                </span>
                {isOwner && (
                  <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-lg font-medium">
                    Tuyo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                <span>{project.ownerName}</span>
                <span>•</span>
                <span>{formatDate(project.createdAt)}</span>
                {project.originalProject && (
                  <>
                    <span>•</span>
                    <span className="text-purple-600 dark:text-purple-400">Fork</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* File Preview */}
        {project.files && project.files.length > 0 && (
          <div className="mb-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  ARCHIVOS ({project.files.length})
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {project.mainFile}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.files.slice(0, 4).map((file, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                    <span>{getProjectTypeIcon(file.language)}</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {file.path.split('/').pop()}
                    </span>
                  </div>
                ))}
                {project.files.length > 4 && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                    +{project.files.length - 4} más
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-6">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={isLiking || isOwner}
              className={`flex items-center gap-2 text-sm transition-colors ${
                project.isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
              } ${(isLiking || isOwner) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg 
                className={`w-4 h-4 ${project.isLiked ? 'fill-current' : ''}`} 
                fill={project.isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{project.likesCount || 0}</span>
            </button>

            {/* Views */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Ver código</span>
            </div>

            {/* Fork Count */}
            {project.forkCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>{project.forkCount} forks</span>
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded font-medium">
                ✏️ Editable
              </span>
            )}
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}