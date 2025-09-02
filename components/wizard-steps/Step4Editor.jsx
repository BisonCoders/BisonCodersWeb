'use client';

import { useState } from 'react';
import CodeEditor from '../CodeEditor';
import ProjectPreview from '../ProjectPreview';
import useProjectStructureValidator from '../ProjectStructureValidator';

const Step4Editor = ({ projectData, updateProjectData }) => {
  const [viewMode, setViewMode] = useState('split');
  const validator = useProjectStructureValidator();

  const handleFilesChange = (files) => {
    updateProjectData({ files });
  };

  const ensureMinimumFiles = () => {
    if (projectData.files.length === 0) {
      // Generar archivos básicos si no hay ninguno
      const templateFiles = validator.generateTemplate(projectData.type || 'html');
      updateProjectData({ 
        files: templateFiles,
        mainFile: templateFiles[0]?.path || 'index.html'
      });
    }
  };

  // Asegurar que hay archivos mínimos
  if (projectData.files.length === 0) {
    ensureMinimumFiles();
  }

  const getProjectStats = () => {
    const totalLines = projectData.files.reduce((total, file) => {
      return total + (file.content ? file.content.split('\n').length : 0);
    }, 0);
    
    const totalSize = projectData.files.reduce((total, file) => {
      return total + (file.content ? file.content.length : 0);
    }, 0);

    const fileTypes = {};
    projectData.files.forEach(file => {
      const extension = '.' + file.path.split('.').pop().toLowerCase();
      fileTypes[extension] = (fileTypes[extension] || 0) + 1;
    });

    return { totalLines, totalSize, fileTypes };
  };

  const stats = getProjectStats();

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      {/* Compact Project Header */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3">
        <div className="flex items-center justify-between">
          {/* Project Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                {projectData.title || 'Mi Proyecto'}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{projectData.files.length} archivos</span>
                <span>{stats.totalLines} líneas</span>
                <span>{(stats.totalSize / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {[
              { mode: 'editor', label: 'Editor' },
              { mode: 'split', label: 'Split' },
              { mode: 'preview', label: 'Preview' }
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === mode
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-white dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="flex h-full">
          {/* Code Editor */}
          <div className={`${
            viewMode === 'preview' ? 'hidden' : viewMode === 'editor' ? 'w-full' : 'w-3/5'
          } ${viewMode !== 'editor' ? 'border-r border-slate-200 dark:border-slate-700' : ''}`}>
            <div className="h-full">
              <CodeEditor
                files={projectData.files}
                onFilesChange={handleFilesChange}
                height="100%"
                className="h-full border-none rounded-none"
              />
            </div>
          </div>

          {/* Preview */}
          <div className={`${
            viewMode === 'editor' ? 'hidden' : viewMode === 'preview' ? 'w-full' : 'w-2/5'
          }`}>
            <div className="h-full bg-slate-50 dark:bg-slate-900">
              <ProjectPreview
                files={projectData.files}
                mainFile={projectData.mainFile}
                projectType={projectData.type}
                className="h-full border-none rounded-none"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Step4Editor;