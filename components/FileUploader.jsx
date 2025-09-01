'use client';

import { useState, useRef } from 'react';

const FileUploader = ({ onFilesUpload, className = "" }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const allowedTypes = {
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'javascript',
    'application/javascript': 'javascript',
    'text/jsx': 'javascript',
    'application/json': 'json',
    'text/markdown': 'markdown',
    'text/plain': 'plaintext',
    'text/xml': 'xml',
    'image/svg+xml': 'xml'
  };

  const getLanguageFromExtension = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const extensionMap = {
      'js': 'javascript',
      'jsx': 'javascript', 
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'xml': 'xml',
      'svg': 'xml'
    };
    return extensionMap[extension] || 'plaintext';
  };

  const validateFile = (file) => {
    // Validar tamaño (máximo 1MB por archivo)
    if (file.size > 1024 * 1024) {
      return { valid: false, error: `${file.name}: Archivo demasiado grande (máximo 1MB)` };
    }

    // Validar tipo de archivo
    const isValidType = allowedTypes[file.type] || 
                       file.name.match(/\.(js|jsx|ts|tsx|html|htm|css|scss|sass|json|md|txt|py|java|cpp|c|php|xml|svg)$/i);
    
    if (!isValidType) {
      return { valid: false, error: `${file.name}: Tipo de archivo no soportado` };
    }

    return { valid: true };
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const processFiles = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const processedFiles = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      
      if (!validation.valid) {
        errors.push(validation.error);
        continue;
      }

      try {
        const content = await readFileContent(file);
        const language = getLanguageFromExtension(file.name);
        
        processedFiles.push({
          path: file.name,
          content,
          language,
          size: file.size
        });

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (error) {
        errors.push(`${file.name}: Error leyendo archivo`);
      }
    }

    setIsUploading(false);
    
    if (errors.length > 0) {
      alert(`Algunos archivos no pudieron ser procesados:\n${errors.join('\n')}`);
    }

    if (processedFiles.length > 0) {
      onFilesUpload(processedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".html,.htm,.css,.scss,.sass,.js,.jsx,.ts,.tsx,.json,.md,.txt,.py,.java,.cpp,.c,.php,.xml,.svg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' 
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-2">Procesando archivos...</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-colors ${
              isDragActive 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                {isDragActive ? '¡Suelta tus archivos aquí!' : 'Sube tus archivos de código'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Arrastra y suelta archivos o haz click para seleccionar
              </p>
              
              {/* Supported formats */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Formatos soportados:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { ext: 'HTML', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
                    { ext: 'CSS', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
                    { ext: 'JS', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
                    { ext: 'React', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400' },
                    { ext: 'MD', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
                  ].map(({ ext, color }) => (
                    <span key={ext} className={`px-2 py-1 rounded text-xs font-mono ${color}`}>
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Seleccionar Archivos
            </button>
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
        <p>Tamaño máximo por archivo: 1MB • Múltiples archivos permitidos</p>
      </div>
    </div>
  );
};

export default FileUploader;