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
    
    onFilesChange(updatedFiles);
    setOpenTabs(updatedTabs);
    
    if (activeFile === path) {
      setActiveFile(updatedTabs[0] || updatedFiles[0]?.path || '');
    }
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
    
    if (activeFile === path) {
      setActiveFile(updatedTabs[updatedTabs.length - 1] || files[0]?.path || '');
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
    const iconMap = {
      'js': '📄',
      'jsx': '⚛️',
      'ts': '🔷',
      'tsx': '⚛️',
      'html': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'json': '📋',
      'md': '📝',
      'py': '🐍',
      'java': '☕',
    };
    return iconMap[extension] || '📄';
  };

  const getTemplateContent = (language) => {
    const templates = {
      'javascript': '// Nuevo archivo JavaScript\nconsole.log("¡Hola BisonCoders!");\n',
      'html': '<!DOCTYPE html>\n<html lang="es">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mi Proyecto</title>\n</head>\n<body>\n    <h1>¡Hola BisonCoders!</h1>\n</body>\n</html>',
      'css': '/* Nuevos estilos */\nbody {\n    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n    margin: 0;\n    padding: 20px;\n}',
    };
    return templates[language] || '';
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Atajos de teclado
    editor.addCommand(editor.KeyMod.CtrlCmd | editor.KeyCode.KeyS, () => {
      if (onSave) onSave(files);
    });
  };

  return (
    <div className={`flex h-full bg-gray-900 text-white ${className}`}>
      {/* File Explorer */}
      {showFileExplorer && (
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium">EXPLORADOR</span>
            {!readOnly && (
              <button
                onClick={() => {
                  const fileName = prompt('Nombre del archivo (ej: script.js):');
                  if (fileName) {
                    const language = getLanguageFromPath(fileName);
                    createNewFile(fileName, language);
                  }
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
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
                className={`flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer group ${
                  activeFile === file.path ? 'bg-blue-600' : ''
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
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        {openTabs.length > 0 && (
          <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
            {openTabs.map((path) => (
              <div
                key={path}
                className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer group min-w-0 ${
                  activeFile === path 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveFile(path)}
              >
                <span className="mr-2 text-xs">{getFileIcon(path)}</span>
                <span className="text-sm truncate">{path.split('/').pop()}</span>
                {openTabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(path);
                    }}
                    className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1">
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
                fontSize: session?.user?.editorSettings?.fontSize || 14,
                wordWrap: session?.user?.editorSettings?.wordWrap || 'on',
                minimap: {
                  enabled: session?.user?.editorSettings?.minimap?.enabled !== false,
                },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📁</div>
                <p>No hay archivos abiertos</p>
                {!readOnly && (
                  <button
                    onClick={() => createNewFile('index.html', 'html')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                  >
                    Crear primer archivo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-blue-600 text-white px-4 py-1 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>
              {getCurrentFile() ? `${getCurrentFile().path} - ${getLanguageFromPath(getCurrentFile().path)}` : 'Sin archivo'}
            </span>
            <button
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className="hover:bg-blue-700 px-2 py-1 rounded"
            >
              📁 {showFileExplorer ? 'Ocultar' : 'Mostrar'} Explorer
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="bg-blue-700 text-white border-none rounded px-2 py-1 text-xs"
            >
              <option value="vs-dark">Oscuro</option>
              <option value="vs-light">Claro</option>
              <option value="hc-black">Alto Contraste</option>
            </select>
            {!readOnly && onSave && (
              <span className="text-xs text-blue-200">Auto-guardado activo</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;