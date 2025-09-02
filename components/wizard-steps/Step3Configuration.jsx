'use client';

import { useState } from 'react';

const Step3Configuration = ({ projectData, updateProjectData }) => {
  const [tagInput, setTagInput] = useState('');

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !projectData.tags.includes(newTag)) {
        updateProjectData({ 
          tags: [...projectData.tags, newTag] 
        });
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    updateProjectData({
      tags: projectData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getProjectTypeName = (type) => {
    const typeNames = {
      html: 'Página Web Simple',
      react: 'Aplicación React',
      'vanilla-js': 'Proyecto JavaScript',
      css: 'Showcase CSS',
      markdown: 'Documentación',
      import: 'Proyecto Importado'
    };
    return typeNames[type] || type;
  };

  const getMethodName = (method) => {
    const methodNames = {
      template: 'Desde Template',
      scratch: 'Desde Cero', 
      upload: 'Archivos Subidos',
      github: 'Desde GitHub'
    };
    return methodNames[method] || method;
  };

  // Sugerencias de tags por tipo de proyecto
  const suggestedTags = {
    html: ['html', 'css', 'javascript', 'responsive', 'landing-page'],
    react: ['react', 'javascript', 'spa', 'components', 'hooks'],
    'vanilla-js': ['javascript', 'dom', 'es6', 'interactive'],
    css: ['css', 'styles', 'animation', 'responsive', 'ui'],
    markdown: ['documentation', 'readme', 'tutorial', 'guide'],
    import: ['legacy', 'migration', 'existing']
  };

  const currentSuggestions = suggestedTags[projectData.type] || [];

  return (
    <div className="space-y-8">
      {/* Project Summary */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Resumen del Proyecto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tipo de proyecto</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {getProjectTypeName(projectData.type)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Método de inicio</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {getMethodName(projectData.startMethod)}
            </p>
          </div>
          {projectData.files.length > 0 && (
            <>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Archivos</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {projectData.files.length} archivo{projectData.files.length > 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Archivo principal</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {projectData.mainFile || 'index.html'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project Configuration Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
          Información del Proyecto
        </h3>
        
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Título del proyecto *
            </label>
            <input
              type="text"
              value={projectData.title}
              onChange={(e) => updateProjectData({ title: e.target.value })}
              placeholder="Mi increíble proyecto"
              className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors"
              maxLength={100}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Un título descriptivo y atractivo para tu proyecto
              </p>
              <p className="text-xs text-slate-400">
                {projectData.title.length}/100
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Descripción *
            </label>
            <textarea
              value={projectData.description}
              onChange={(e) => updateProjectData({ description: e.target.value })}
              placeholder="Describe tu proyecto, qué hace y qué tecnologías usa..."
              className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors"
              rows="4"
              maxLength={500}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Una descripción clara ayudará a otros a entender tu proyecto
              </p>
              <p className="text-xs text-slate-400">
                {projectData.description.length}/500
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tags
            </label>
            
            {/* Current Tags */}
            {projectData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {projectData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Tag Input */}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Escribe un tag y presiona Enter"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Presiona Enter o coma para agregar un tag. Los tags ayudan a categorizar tu proyecto.
            </p>

            {/* Suggested Tags */}
            {currentSuggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Sugerencias:</p>
                <div className="flex flex-wrap gap-2">
                  {currentSuggestions
                    .filter(tag => !projectData.tags.includes(tag))
                    .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => updateProjectData({ tags: [...projectData.tags, tag] })}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs rounded transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Visibilidad del proyecto
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={projectData.isPublic === true}
                  onChange={() => updateProjectData({ isPublic: true })}
                  className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    🌍 Público
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Visible en el feed público y buscadores. Otros pueden ver y bifurcar tu proyecto.
                  </div>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={projectData.isPublic === false}
                  onChange={() => updateProjectData({ isPublic: false })}
                  className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    🔒 Privado
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Solo tú puedes ver este proyecto. Ideal para trabajo en progreso o proyectos personales.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Advanced Settings */}
          {projectData.files.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Archivo principal
              </label>
              <select
                value={projectData.mainFile || ''}
                onChange={(e) => updateProjectData({ mainFile: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                {projectData.files.map((file) => (
                  <option key={file.path} value={file.path}>
                    {file.path}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                El archivo que se mostrará primero en el preview del proyecto
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Configuration;