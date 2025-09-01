'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CodeEditor from '../../../components/CodeEditor';
import ProjectPreview from '../../../components/ProjectPreview';
import FileUploader from '../../../components/FileUploader';

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState({
    title: '',
    description: '',
    files: [],
    mainFile: 'index.html',
    projectType: 'html',
    tags: [],
    isPublic: true,
  });
  const [viewMode, setViewMode] = useState('split');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Templates iniciales
  const templates = {
    html: [
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .highlight {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Hola <span class="highlight">BisonCoders</span>!</h1>
        <p>Este es tu nuevo proyecto. ¡Empieza a crear algo increíble!</p>
        <button onclick="cambiarMensaje()">¡Haz click aquí!</button>
        <p id="mensaje"></p>
    </div>
    
    <script>
        function cambiarMensaje() {
            document.getElementById('mensaje').innerHTML = '🚀 ¡Listo para programar!';
        }
    </script>
</body>
</html>`,
        language: 'html',
      }
    ],
    react: [
      {
        path: 'App.jsx',
        content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1>¡Hola BisonCoders!</h1>
        <p>Has clickeado {count} veces</p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ¡Click aquí!
        </button>
      </div>
    </div>
  );
}

export default App;`,
        language: 'javascript',
      }
    ],
    'vanilla-js': [
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto JavaScript</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app">
        <h1>Mi App JavaScript</h1>
        <div id="content">
            <p>¡Hola BisonCoders!</p>
            <button id="btn">¡Interactúa conmigo!</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        language: 'html',
      },
      {
        path: 'styles.css',
        content: `body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.app {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 500px;
}

h1 {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
}

button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    transition: transform 0.2s;
}

button:hover {
    transform: translateY(-2px);
}

.highlight {
    background: #f0f8ff;
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
}`,
        language: 'css',
      },
      {
        path: 'script.js',
        content: `// JavaScript para tu proyecto
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn');
    const content = document.getElementById('content');
    
    let clickCount = 0;
    
    btn.addEventListener('click', function() {
        clickCount++;
        
        // Crear nuevo elemento
        const newElement = document.createElement('div');
        newElement.className = 'highlight';
        newElement.innerHTML = \`
            <h3>🚀 ¡Genial!</h3>
            <p>Has hecho click \${clickCount} veces</p>
            <p>¡Sigue explorando JavaScript!</p>
        \`;
        
        // Remover elemento anterior si existe
        const oldHighlight = content.querySelector('.highlight');
        if (oldHighlight) {
            oldHighlight.remove();
        }
        
        content.appendChild(newElement);
    });
});`,
        language: 'javascript',
      }
    ],
    css: [
      {
        path: 'styles.css',
        content: `/* Tu hoja de estilos personalizada */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-color: #333;
    --bg-color: #f8f9fa;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.hero {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 60px 20px;
    text-align: center;
    border-radius: 20px;
    margin-bottom: 40px;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.card {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.btn {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
    }
    
    .container {
        padding: 10px;
    }
}`,
        language: 'css',
      }
    ],
    markdown: [
      {
        path: 'README.md',
        content: `# Mi Proyecto BisonCoders

¡Bienvenido a mi increíble proyecto!

## 🚀 Descripción

Este es un proyecto creado con la plataforma BisonCoders. Aquí puedes escribir toda la documentación de tu proyecto.

## ✨ Características

- **Fácil de usar**: Diseño intuitivo y amigable
- **Responsive**: Se adapta a cualquier dispositivo
- **Moderno**: Utiliza las últimas tecnologías
- **Open Source**: Código abierto para la comunidad

## 📋 Instalación

\`\`\`bash
# Clona el repositorio
git clone https://github.com/tu-usuario/tu-proyecto.git

# Instala las dependencias
npm install

# Ejecuta el proyecto
npm start
\`\`\`

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- React (opcional)
- Node.js (opcional)

## 📸 Screenshots

![Screenshot del proyecto](https://via.placeholder.com/600x300?text=Tu+Proyecto+Aquí)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz fork del proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📧 Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - tu@email.com

Link del Proyecto: [https://github.com/tu-usuario/tu-proyecto](https://github.com/tu-usuario/tu-proyecto)

---

⭐️ ¡No olvides dar una estrella si te gusta el proyecto!`,
        language: 'markdown',
      }
    ]
  };

  const handleTemplateChange = (type) => {
    const template = templates[type] || templates.html;
    setProject(prev => ({
      ...prev,
      projectType: type,
      files: template,
      mainFile: template[0].path,
    }));
  };

  const handleFilesUpload = (uploadedFiles) => {
    // Combinar archivos subidos con los existentes
    const existingPaths = project.files.map(f => f.path);
    const newFiles = uploadedFiles.filter(f => !existingPaths.includes(f.path));
    
    const allFiles = [...project.files, ...newFiles];
    
    setProject(prev => ({
      ...prev,
      files: allFiles,
      mainFile: prev.mainFile || allFiles[0]?.path || 'index.html',
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!project.title || !project.description || project.files.length === 0) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/projects/${data.project._id}`);
      } else {
        setError(data.error || 'Error creando proyecto');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Inicia sesión para crear proyectos
          </h2>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Volver al inicio
          </Link>
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
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Crear Nuevo Proyecto
            </h1>
          </div>

          {/* View Mode Selector */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            {[
              { mode: 'split', icon: '⊞', label: 'Split' },
              { mode: 'form', icon: '📝', label: 'Formulario' },
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Form Panel */}
        <div className={`${
          viewMode === 'preview' ? 'hidden' : viewMode === 'form' ? 'w-full' : 'w-1/2'
        } bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 overflow-y-auto`}>
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Project Info */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Información del Proyecto
              </h2>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Mi increíble proyecto"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe tu proyecto..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    rows="3"
                    maxLength={500}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de Proyecto
                  </label>
                  <select
                    value={project.projectType}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    <option value="html">HTML Estático</option>
                    <option value="react">React</option>
                    <option value="vanilla-js">JavaScript Vanilla</option>
                    <option value="css">CSS Puro</option>
                    <option value="markdown">Markdown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tags (separados por comas)
                  </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      setProject(prev => ({ ...prev, tags }));
                    }}
                    placeholder="javascript, css, proyecto-personal"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={project.isPublic}
                    onChange={(e) => setProject(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-slate-700 dark:text-slate-300">
                    Hacer público (visible en el feed)
                  </label>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Subir Archivos
              </h2>
              <FileUploader 
                onFilesUpload={handleFilesUpload}
                className="mb-6"
              />
            </div>

            {/* Editor Section */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Código
              </h2>
              <div className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <CodeEditor
                  files={project.files}
                  onFilesChange={(files) => setProject(prev => ({ ...prev, files }))}
                  height="600px"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link
                href="/"
                className="flex-1 px-4 py-2 text-center text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors"
              >
                {creating ? 'Creando...' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className={`${
          viewMode === 'form' ? 'hidden' : viewMode === 'preview' ? 'w-full' : 'w-1/2'
        }`}>
          <ProjectPreview
            files={project.files}
            mainFile={project.mainFile}
            projectType={project.projectType}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}