'use client';

import { useState, useRef } from 'react';
import useProjectStructureValidator from './ProjectStructureValidator';

const SmartFileUploader = ({ 
  projectType, 
  onFilesUpload, 
  onValidationResult,
  className = "",
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 50
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState(null);
  const [processedFiles, setProcessedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const validator = useProjectStructureValidator();

  // Tipos de archivo permitidos por proyecto
  const projectAllowedTypes = {
    html: ['.html', '.htm', '.css', '.js', '.jpg', '.png', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'],
    react: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass', '.json', '.md', '.svg', '.png', '.jpg'],
    'vanilla-js': ['.html', '.htm', '.js', '.css', '.json', '.md', '.svg', '.png', '.jpg'],
    css: ['.css', '.scss', '.sass', '.html', '.htm', '.svg', '.png', '.jpg'],
    markdown: ['.md', '.txt', '.jpg', '.png', '.gif', '.svg'],
    import: ['.html', '.htm', '.css', '.scss', '.sass', '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.py', '.java', '.php', '.cpp', '.c']
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
    const errors = [];
    const warnings = [];
    
    // Validar tamaño
    if (file.size > maxFileSize) {
      errors.push(`${file.name}: Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB > ${(maxFileSize / 1024 / 1024).toFixed(1)}MB)`);
    }

    // Validar extensión para el tipo de proyecto
    const allowedExtensions = projectAllowedTypes[projectType] || projectAllowedTypes.import;
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      if (projectType && projectType !== 'import') {
        warnings.push(`${file.name}: Extensión no común para proyectos ${projectType} (${fileExtension})`);
      } else {
        errors.push(`${file.name}: Tipo de archivo no soportado (${fileExtension})`);
      }
    }

    // Validar nombre de archivo
    const invalidChars = /[<>:"|?*\x00-\x1f]/;
    if (invalidChars.test(file.name)) {
      errors.push(`${file.name}: Contiene caracteres no válidos`);
    }

    // Validar archivos binarios mal clasificados
    const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.htm', '.css', '.scss', '.sass', '.json', '.md', '.txt', '.xml', '.svg'];
    const isTextFile = textExtensions.includes(fileExtension);
    
    if (!isTextFile && file.type && file.type.startsWith('text/')) {
      warnings.push(`${file.name}: Archivo binario con tipo MIME de texto`);
    }

    return { 
      valid: errors.length === 0, 
      errors, 
      warnings,
      fileExtension,
      isTextFile
    };
  };

  const readFileContent = (file, isTextFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      
      if (isTextFile) {
        reader.readAsText(file, 'UTF-8');
      } else {
        // Para archivos binarios, leemos como data URL
        reader.readAsDataURL(file);
      }
    });
  };

  const detectProjectStructure = (files) => {
    const suggestions = [];
    const fileNames = files.map(f => f.path.toLowerCase());

    // Detectar si parece un proyecto React
    const hasReactFiles = files.some(f => 
      f.content && (
        f.content.includes('import React') ||
        f.content.includes('from \'react\'') ||
        f.content.includes('jsx') ||
        f.path.endsWith('.jsx')
      )
    );

    if (hasReactFiles && projectType !== 'react') {
      suggestions.push({
        type: 'project-type',
        message: 'Los archivos parecen ser de un proyecto React',
        suggestion: 'Considera cambiar el tipo de proyecto a "React"',
        action: 'change-type',
        value: 'react'
      });
    }

    // Detectar archivos principales faltantes
    const hasIndex = fileNames.some(name => name.startsWith('index.'));
    const hasMain = fileNames.some(name => name.startsWith('main.'));
    
    if (!hasIndex && !hasMain && files.length > 3) {
      suggestions.push({
        type: 'structure',
        message: 'No se encontró archivo principal (index.* o main.*)',
        suggestion: 'Considera renombrar tu archivo principal',
        action: 'rename-main'
      });
    }

    // Detectar duplicados potenciales
    const duplicates = {};
    files.forEach(file => {
      const baseName = file.path.replace(/\.[^/.]+$/, "").toLowerCase();
      if (!duplicates[baseName]) duplicates[baseName] = [];
      duplicates[baseName].push(file.path);
    });

    Object.entries(duplicates).forEach(([baseName, paths]) => {
      if (paths.length > 1) {
        suggestions.push({
          type: 'duplicates',
          message: `Posibles archivos duplicados: ${paths.join(', ')}`,
          suggestion: 'Revisa si necesitas todos estos archivos',
          action: 'review-duplicates',
          value: paths
        });
      }
    });

    return suggestions;
  };

  const processFiles = async (files) => {
    if (files.length > maxFiles) {
      alert(`Demasiados archivos. Máximo permitido: ${maxFiles}`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const processedFiles = [];
    const allErrors = [];
    const allWarnings = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      
      allErrors.push(...validation.errors);
      allWarnings.push(...validation.warnings);
      
      if (!validation.valid) {
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        continue;
      }

      try {
        let content = null;
        
        // Solo leer contenido de archivos de texto
        if (validation.isTextFile) {
          content = await readFileContent(file, true);
          
          // Validar que el contenido sea realmente texto
          const hasNullBytes = content.includes('\x00');
          if (hasNullBytes) {
            allWarnings.push(`${file.name}: Contiene caracteres binarios, puede no ser un archivo de texto`);
          }
        } else {
          // Para archivos binarios (imágenes, etc.), solo guardar metadata
          content = await readFileContent(file, false);
        }

        const language = getLanguageFromExtension(file.name);
        
        processedFiles.push({
          path: file.name,
          content: content,
          language,
          size: file.size,
          type: validation.isTextFile ? 'text' : 'binary',
          lastModified: file.lastModified
        });

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (error) {
        allErrors.push(`${file.name}: Error leyendo archivo - ${error.message}`);
      }
    }

    // Validar estructura del proyecto
    let structureValidation = null;
    let structureSuggestions = [];
    
    if (processedFiles.length > 0 && projectType) {
      structureValidation = validator.validateFiles(processedFiles, projectType);
      structureSuggestions = detectProjectStructure(processedFiles);
      
      // Auto-fix si es posible
      if (structureValidation.errors.length === 0) {
        const autoFixResult = validator.autoFix(processedFiles, projectType);
        if (autoFixResult.fixes.length > 0) {
          processedFiles.splice(0, processedFiles.length, ...autoFixResult.files);
          allWarnings.push(...autoFixResult.fixes.map(fix => `Auto-corrección: ${fix}`));
        }
      }
    }

    const finalResult = {
      files: processedFiles,
      validation: structureValidation,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: structureSuggestions,
      stats: {
        totalFiles: processedFiles.length,
        textFiles: processedFiles.filter(f => f.type === 'text').length,
        binaryFiles: processedFiles.filter(f => f.type === 'binary').length,
        totalSize: processedFiles.reduce((size, file) => size + file.size, 0)
      }
    };

    setProcessedFiles(processedFiles);
    setValidationResults(finalResult);
    setIsUploading(false);
    
    // Notificar componente padre
    if (onValidationResult) {
      onValidationResult(finalResult);
    }
    
    if (processedFiles.length > 0) {
      onFilesUpload(processedFiles);
    }

    // Mostrar errores si los hay
    if (allErrors.length > 0) {
      const errorMessage = `Errores encontrados:\n${allErrors.slice(0, 5).join('\n')}${allErrors.length > 5 ? `\n... y ${allErrors.length - 5} más` : ''}`;
      alert(errorMessage);
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

  const getProjectTypeName = (type) => {
    const typeNames = {
      html: 'HTML',
      react: 'React',
      'vanilla-js': 'JavaScript',
      css: 'CSS',
      markdown: 'Markdown',
      import: 'Cualquier tipo'
    };
    return typeNames[type] || type;
  };

  const allowedExtensions = projectAllowedTypes[projectType] || projectAllowedTypes.import;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Project Type Info */}
      {projectType && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center text-blue-800 dark:text-blue-200">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              Optimizado para proyectos {getProjectTypeName(projectType)}
            </span>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedExtensions.join(',')}
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
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' 
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 mb-2 font-medium">Analizando archivos...</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-colors duration-200 ${
              isDragActive 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                {isDragActive ? '¡Suelta tus archivos aquí!' : 'Sube archivos de tu proyecto'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                Arrastra y suelta o haz click para seleccionar archivos
              </p>
              
              {/* Supported formats */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Formatos soportados:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {allowedExtensions.slice(0, 8).map((ext) => (
                    <span key={ext} className="px-2 py-1 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 text-xs rounded border border-slate-200 dark:border-slate-600 font-mono">
                      {ext}
                    </span>
                  ))}
                  {allowedExtensions.length > 8 && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded border border-slate-200 dark:border-slate-600">
                      +{allowedExtensions.length - 8} más
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer">
              Seleccionar Archivos
            </button>
          </div>
        )}
      </div>
      
      {/* Validation Results */}
      {validationResults && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Resumen de archivos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Total:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 ml-1">
                  {validationResults.stats.totalFiles}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Texto:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 ml-1">
                  {validationResults.stats.textFiles}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Binarios:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 ml-1">
                  {validationResults.stats.binaryFiles}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Tamaño:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 ml-1">
                  {(validationResults.stats.totalSize / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {validationResults.validation && (
            <div className={`border rounded-lg p-4 ${
              validationResults.validation.isValid 
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
            }`}>
              <div className="flex items-center mb-2">
                {validationResults.validation.isValid ? (
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <h4 className={`font-medium ${
                  validationResults.validation.isValid 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {validationResults.validation.isValid ? 'Proyecto válido' : 'Proyecto con observaciones'}
                </h4>
              </div>

              {validationResults.validation.errors.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Errores:</p>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    {validationResults.validation.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResults.validation.suggestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Sugerencias:</p>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    {validationResults.validation.suggestions.map((suggestion, i) => (
                      <li key={i}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Warnings */}
          {validationResults.warnings.length > 0 && (
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Advertencias</h4>
              <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                {validationResults.warnings.slice(0, 3).map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
                {validationResults.warnings.length > 3 && (
                  <li className="text-orange-500">• ... y {validationResults.warnings.length - 3} más</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        <p>
          Tamaño máximo: {(maxFileSize / 1024 / 1024).toFixed(1)}MB por archivo • 
          Máximo {maxFiles} archivos • 
          Validación inteligente incluida
        </p>
      </div>
    </div>
  );
};

export default SmartFileUploader;