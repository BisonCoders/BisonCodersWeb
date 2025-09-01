'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSession } from 'next-auth/react';

const CodeEditor = ({ 
  files = [], 
  onFilesChange, 
  readOnly = false, 
  onSave,
  className = "",
  height = "600px" 
}) => {
  const { data: session } = useSession();
  const [activeFile, setActiveFile] = useState(files[0]?.path || '');
  const [openTabs, setOpenTabs] = useState([]);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const editorRef = useRef(null);

  // Inicializar tabs cuando cambien los archivos
  useEffect(() => {
    if (files.length > 0 && openTabs.length === 0) {
      const initialTabs = files.slice(0, 3).map(file => file.path);
      setOpenTabs(initialTabs);
      setActiveFile(initialTabs[0] || files[0].path);
    }
  }, [files]);

  // Auto-save cada 5 segundos si hay cambios
  useEffect(() => {
    if (!readOnly && onSave) {
      const interval = setInterval(() => {
        onSave(files);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [files, readOnly, onSave]);

  const getCurrentFile = () => {
    return files.find(file => file.path === activeFile);
  };

  const updateFileContent = (path, content) => {
    if (readOnly) return;
    
    const updatedFiles = files.map(file => 
      file.path === path ? { ...file, content } : file
    );
    onFilesChange(updatedFiles);
  };

  const createNewFile = (fileName, language = 'javascript') => {
    if (readOnly) return;
    
    const newFile = {
      path: fileName,
      content: getTemplateContent(language),
      language,
    };
    
    const updatedFiles = [...files, newFile];
    onFilesChange(updatedFiles);
    
    // Abrir en nueva tab
    setOpenTabs([...openTabs, fileName]);
    setActiveFile(fileName);
  };

  const deleteFile = (path) => {
    if (readOnly || files.length <= 1) return;
    
    const updatedFiles = files.filter(file => file.path !== path);
    const updatedTabs = openTabs.filter(tab => tab !== path);
    
    // Si eliminamos el archivo activo, cambiar a otro
    let newActiveFile = activeFile;
    if (activeFile === path) {
      newActiveFile = updatedTabs.length > 0 ? updatedTabs[0] : updatedFiles[0]?.path || '';
    }
    
    // Actualizar estado
    onFilesChange(updatedFiles);
    setOpenTabs(updatedTabs);
    setActiveFile(newActiveFile);
  };

  const openFileInTab = (path) => {
    if (!openTabs.includes(path)) {
      setOpenTabs([...openTabs, path]);
    }
    setActiveFile(path);
  };

  const closeTab = (path) => {
    const updatedTabs = openTabs.filter(tab => tab !== path);
    setOpenTabs(updatedTabs);
    
    // Si cerramos la pestaña activa, cambiar a otra
    if (activeFile === path) {
      if (updatedTabs.length > 0) {
        setActiveFile(updatedTabs[updatedTabs.length - 1]);
      } else {
        // Si no hay pestañas abiertas, limpiar activeFile
        setActiveFile('');
      }
    }
  };

  const getLanguageFromPath = (path) => {
    const extension = path.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
    };
    return languageMap[extension] || 'plaintext';
  };

  const getFileIcon = (path) => {
    const extension = path.split('.').pop().toLowerCase();
    const iconComponents = {
      'js': (
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      ),
      'jsx': (
        <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2L3 7v6l7 5 7-5V7l-7-5z"/>
        </svg>
      ),
      'ts': (
        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm6 10H8v-4h2v4zm4 0h-2V8h2v6z"/>
        </svg>
      ),
      'tsx': (
        <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2L3 7v6l7 5 7-5V7l-7-5z"/>
        </svg>
      ),
      'html': (
        <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      ),
      'css': (
        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm8-1a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1V9z" clipRule="evenodd"/>
        </svg>
      ),
      'scss': (
        <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm8-1a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1V9z" clipRule="evenodd"/>
        </svg>
      ),
      'json': (
        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586l1.293-1.293a1 1 0 111.414 1.414L10.414 12l1.293 1.293a1 1 0 01-1.414 1.414L9 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 12 6.293 10.707a1 1 0 010-1.414zM13 6a1 1 0 100-2H7a1 1 0 000 2h6z" clipRule="evenodd"/>
        </svg>
      ),
      'md': (
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2v8h12V6H4z" clipRule="evenodd"/>
        </svg>
      ),
      'py': (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2L3 7v6l7 5 7-5V7l-7-5z"/>
        </svg>
      ),
      'java': (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
    };
    return iconComponents[extension] || (
      <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2v8h12V6H4z" clipRule="evenodd"/>
      </svg>
    );
  };

  const getTemplateContent = (language) => {
    const templates = {
      'javascript': '// Nuevo archivo JavaScript\nconsole.log("¡Hola BisonCoders!");\n',
      'html': '<!DOCTYPE html>\n<html lang="es">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mi Proyecto</title>\n</head>\n<body>\n    <h1>¡Hola BisonCoders!</h1>\n</body>\n</html>',
      'css': '/* Nuevos estilos */\nbody {\n    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n    margin: 0;\n    padding: 20px;\n}',
    };
    return templates[language] || '';
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Atajos de teclado
    if (monaco && monaco.KeyMod && monaco.KeyCode) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        if (onSave) onSave(files);
      });
    }
  };

  return (
    <div className={`flex h-full bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl ${className}`}>
      {/* File Explorer */}
      {showFileExplorer && (
        <div className="w-72 bg-slate-800/50 backdrop-blur-sm border-r border-slate-600/50 flex flex-col flex-shrink-0 rounded-l-xl">
          {/* Header */}
          <div className="p-3 border-b border-slate-600/50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300 font-mono">EXPLORADOR</span>
            {!readOnly && (
              <button
                onClick={() => {
                  const fileName = prompt('Nombre del archivo (ej: script.js):');
                  if (fileName) {
                    const language = getLanguageFromPath(fileName);
                    createNewFile(fileName, language);
                  }
                }}
                className="text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-3 py-2 rounded font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
              >
                + Nuevo
              </button>
            )}
          </div>
          
          {/* File List */}
          <div className="flex-1 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.path}
                className={`flex items-center px-4 py-3 hover:bg-slate-700/50 cursor-pointer group text-sm transition-all duration-300 relative ${
                  activeFile === file.path ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-300 hover:text-emerald-400'
                }`}
                onClick={() => openFileInTab(file.path)}
              >
                <span className="mr-2">{getFileIcon(file.path)}</span>
                <span className="flex-1 text-sm truncate">{file.path}</span>
                {!readOnly && files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`¿Eliminar ${file.path}?`)) {
                        deleteFile(file.path);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-800/50 backdrop-blur-sm rounded-r-xl">
        {/* Tab Bar */}
        {openTabs.length > 0 && (
          <div className="bg-slate-700/50 backdrop-blur-sm border-b border-slate-600/50 flex overflow-x-auto rounded-tr-xl">
            {openTabs.map((path) => (
              <div
                key={path}
                className={`flex items-center px-6 py-3 border-r border-slate-600/50 cursor-pointer group min-w-0 text-sm font-medium transition-all duration-300 relative ${
                  activeFile === path 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400' 
                    : 'bg-slate-700/30 text-slate-300 hover:text-emerald-400 hover:bg-slate-600/50'
                }`}
                onClick={() => setActiveFile(path)}
              >
                <span className="mr-3 text-sm">{getFileIcon(path)}</span>
                <span className="text-sm truncate font-medium">{path.split('/').pop()}</span>
                {openTabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(path);
                    }}
                    className="ml-3 px-2 py-1 opacity-0 group-hover:opacity-100 hover:bg-slate-600/50 rounded text-base font-bold text-slate-400 hover:text-emerald-400 transition-all duration-300"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 min-h-0 bg-slate-800/30 backdrop-blur-sm">
          {getCurrentFile() ? (
            <Editor
              height={height}
              language={getLanguageFromPath(getCurrentFile().path)}
              value={getCurrentFile().content}
              theme={editorTheme}
              onChange={(value) => updateFileContent(activeFile, value || '')}
              onMount={handleEditorDidMount}
              options={{
                readOnly,
                fontSize: session?.user?.editorSettings?.fontSize || 16,
                fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                fontLigatures: true,
                wordWrap: session?.user?.editorSettings?.wordWrap || 'on',
                lineHeight: 24,
                letterSpacing: 0.5,
                minimap: {
                  enabled: session?.user?.editorSettings?.minimap?.enabled !== false,
                  scale: 1,
                },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                formatOnPaste: true,
                formatOnType: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                mouseWheelZoom: true,
                padding: { top: 20, bottom: 20 },
                rulers: [80, 120],
                bracketPairColorization: { enabled: true },
                guides: {
                  indentation: true,
                  highlightActiveIndentation: true,
                  bracketPairs: true,
                },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                },
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-300 font-mono">No hay archivos abiertos</p>
                {!readOnly && (
                  <button
                    onClick={() => createNewFile('index.html', 'html')}
                    className="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 rounded text-white transition-all duration-300 font-mono font-medium shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
                  >
                    Crear primer archivo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-4 py-2 text-sm flex items-center justify-between rounded-b-xl">
          <div className="flex items-center space-x-4">
            <span>
              {getCurrentFile() ? `${getCurrentFile().path} - ${getLanguageFromPath(getCurrentFile().path)}` : 'Sin archivo'}
            </span>
            <button
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className="hover:bg-emerald-700 px-3 py-2 rounded text-sm font-medium transition-colors font-mono"
            >
              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {showFileExplorer ? 'Ocultar' : 'Mostrar'} Explorer
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="bg-emerald-700 text-white border-none rounded px-3 py-2 text-sm font-mono"
            >
              <option value="vs-dark">Oscuro</option>
              <option value="vs-light">Claro</option>
              <option value="hc-black">Alto Contraste</option>
            </select>
            {!readOnly && onSave && (
              <span className="text-sm text-emerald-200 font-mono">Auto-guardado activo</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;