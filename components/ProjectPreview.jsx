'use client';

import { useState, useEffect, useRef } from 'react';

const ProjectPreview = ({ files = [], mainFile = 'index.html', projectType = 'html', className = "" }) => {
  const [previewContent, setPreviewContent] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const iframeRef = useRef(null);

  // Generar preview cuando cambien los archivos
  useEffect(() => {
    generatePreview();
  }, [files, mainFile, projectType]);

  const generatePreview = async () => {
    setIsLoading(true);
    setPreviewError('');

    try {
      switch (projectType) {
        case 'html':
          generateHTMLPreview();
          break;
        case 'react':
          await generateReactPreview();
          break;
        case 'vanilla-js':
          generateVanillaJSPreview();
          break;
        case 'css':
          generateCSSPreview();
          break;
        case 'markdown':
          generateMarkdownPreview();
          break;
        default:
          generateHTMLPreview();
      }
    } catch (error) {
      setPreviewError(`Error generando preview: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHTMLPreview = () => {
    const htmlFile = files.find(f => f.path === mainFile) || files.find(f => f.path.endsWith('.html'));
    
    if (!htmlFile) {
      setPreviewError('No se encontró archivo HTML');
      return;
    }

    let html = htmlFile.content;
    
    // Inyectar CSS inline
    const cssFiles = files.filter(f => f.language === 'css' || f.path.endsWith('.css'));
    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map(f => f.content).join('\n');
      const styleTag = `<style>${cssContent}</style>`;
      
      // Intentar múltiples formas de inyectar CSS
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${styleTag}</head>`);
      } else if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${styleTag}`);
      } else if (html.includes('<html>')) {
        html = html.replace('<html>', `<html><head>${styleTag}</head>`);
      } else {
        // Si no hay estructura HTML, añadir estructura completa
        html = `<!DOCTYPE html><html><head>${styleTag}</head><body>${html}</body></html>`;
      }
    }
    
    // Inyectar JavaScript inline
    const jsFiles = files.filter(f => f.language === 'javascript' || f.path.endsWith('.js'));
    if (jsFiles.length > 0) {
      const jsContent = jsFiles.map(f => f.content).join('\n');
      const scriptTag = `<script>${jsContent}</script>`;
      
      // Intentar múltiples formas de inyectar JS
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${scriptTag}</body>`);
      } else if (html.includes('<body>')) {
        html = html.replace('</html>', `${scriptTag}</html>`);
      } else {
        // Si no hay estructura, añadir al final
        html += scriptTag;
      }
    }

    setPreviewContent(html);
  };

  const generateVanillaJSPreview = () => {
    // Crear HTML base si no existe
    let htmlContent = files.find(f => f.path.endsWith('.html'))?.content || '';
    
    if (!htmlContent) {
      htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>`;
    }

    generateHTMLPreview();
  };

  const generateReactPreview = async () => {
    // Para React, necesitaríamos un bundler como Babel standalone
    // Por simplicidad, mostraremos el código fuente por ahora
    const jsxFile = files.find(f => f.path.endsWith('.jsx')) || files.find(f => f.language === 'javascript');
    
    if (!jsxFile) {
      setPreviewError('No se encontró archivo JSX/React');
      return;
    }

    // Crear una preview básica mostrando que es un proyecto React
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Project Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 20px; }
        .react-info { background: #f0f8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007acc; }
    </style>
</head>
<body>
    <div id="root"></div>
    <div class="react-info">
        <h3>🚀 Proyecto React Detectado</h3>
        <p>Este es un proyecto React. Para una preview completa, considera usar herramientas como CodeSandbox o configurar un bundler completo.</p>
        <details>
            <summary>Ver código fuente</summary>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>${escapeHtml(jsxFile.content)}</code></pre>
        </details>
    </div>
</body>
</html>`;

    setPreviewContent(html);
  };

  const generateCSSPreview = () => {
    const cssFile = files.find(f => f.language === 'css' || f.path.endsWith('.css'));
    
    if (!cssFile) {
      setPreviewError('No se encontró archivo CSS');
      return;
    }

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <style>${cssFile.content}</style>
</head>
<body>
    <div style="padding: 20px;">
        <h1>CSS Preview</h1>
        <p>Esta es una vista previa de tus estilos CSS.</p>
        <div class="demo-content">
            <h2>Elemento de prueba</h2>
            <p>Párrafo de ejemplo para probar los estilos.</p>
            <button>Botón de ejemplo</button>
            <div style="width: 100px; height: 100px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); margin: 20px 0;"></div>
        </div>
    </div>
</body>
</html>`;

    setPreviewContent(html);
  };

  const generateMarkdownPreview = () => {
    const mdFile = files.find(f => f.language === 'markdown' || f.path.endsWith('.md'));
    
    if (!mdFile) {
      setPreviewError('No se encontró archivo Markdown');
      return;
    }

    // Conversión básica de Markdown a HTML
    let htmlContent = mdFile.content
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Preview</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
        }
        code { 
            background: #f5f5f5; 
            padding: 2px 4px; 
            border-radius: 3px; 
            font-family: 'Courier New', monospace; 
        }
        pre { 
            background: #f5f5f5; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto; 
        }
        blockquote { 
            border-left: 4px solid #ddd; 
            margin-left: 0; 
            padding-left: 15px; 
            color: #666; 
        }
    </style>
</head>
<body>
    <p>${htmlContent}</p>
</body>
</html>`;

    setPreviewContent(html);
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const getViewModeStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default: // desktop
        return { width: '100%', height: '100%' };
    }
  };

  const refreshPreview = () => {
    generatePreview();
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          <button
            onClick={refreshPreview}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            disabled={isLoading}
          >
            {isLoading ? '⟳' : '🔄'} Actualizar
          </button>
        </div>
        
        {/* View Mode Selector */}
        <div className="flex items-center space-x-1">
          {[
            { mode: 'desktop', icon: '🖥️', label: 'Desktop' },
            { mode: 'tablet', icon: '📱', label: 'Tablet' },
            { mode: 'mobile', icon: '📱', label: 'Mobile' }
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`text-xs px-2 py-1 rounded ${
                viewMode === mode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={label}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50 flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="animate-spin text-2xl mb-2">⟳</div>
              <p>Generando preview...</p>
            </div>
          </div>
        ) : previewError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500 bg-red-50 p-8 rounded-lg border border-red-200">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Error en Preview</h3>
              <p className="text-sm">{previewError}</p>
              <button
                onClick={refreshPreview}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : previewContent ? (
          <div 
            className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            style={getViewModeStyles()}
          >
            <iframe
              ref={iframeRef}
              srcDoc={previewContent}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms"
              title="Project Preview"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">📄</div>
              <p>No hay contenido para mostrar</p>
              <p className="text-sm text-gray-400 mt-2">
                Agrega algunos archivos para ver el preview
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      {previewContent && !previewError && (
        <div className="bg-green-50 border-t border-green-200 px-4 py-2">
          <div className="flex items-center text-sm text-green-700">
            <span className="mr-2">✅</span>
            Preview actualizado - {files.length} archivo{files.length !== 1 ? 's' : ''} procesado{files.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPreview;