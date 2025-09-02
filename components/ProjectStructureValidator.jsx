'use client';

const useProjectStructureValidator = () => {
  
  // Validaciones por tipo de proyecto
  const validators = {
    html: {
      name: 'Página Web Simple',
      requiredFiles: [
        { pattern: /\.html$/i, description: 'Al menos un archivo HTML' },
      ],
      recommendedFiles: [
        { pattern: /^(index|main)\.html$/i, description: 'index.html como archivo principal' },
        { pattern: /\.css$/i, description: 'Archivos CSS para estilos' },
        { pattern: /\.js$/i, description: 'Archivos JavaScript' },
      ],
      structure: {
        maxDepth: 3,
        allowedExtensions: ['.html', '.css', '.js', '.jpg', '.png', '.gif', '.svg', '.ico'],
        maxFileSize: 5 * 1024 * 1024, // 5MB
      }
    },

    react: {
      name: 'Aplicación React',
      requiredFiles: [
        { pattern: /\.(jsx?|tsx?)$/i, description: 'Al menos un archivo React' },
      ],
      recommendedFiles: [
        { pattern: /^(App|index)\.(jsx?|tsx?)$/i, description: 'App.jsx o index.jsx como componente principal' },
        { pattern: /\.css$/i, description: 'Archivos de estilo' },
      ],
      structure: {
        maxDepth: 5,
        allowedExtensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.md'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
      },
      dependencies: {
        required: ['react'],
        recommended: ['react-dom']
      }
    },

    'vanilla-js': {
      name: 'Proyecto JavaScript',
      requiredFiles: [
        { pattern: /\.js$/i, description: 'Al menos un archivo JavaScript' },
      ],
      recommendedFiles: [
        { pattern: /^(index|main)\.(html|js)$/i, description: 'index.html o main.js como punto de entrada' },
        { pattern: /\.html$/i, description: 'Archivo HTML para la interfaz' },
        { pattern: /\.css$/i, description: 'Archivos de estilo' },
      ],
      structure: {
        maxDepth: 4,
        allowedExtensions: ['.js', '.html', '.css', '.json', '.md'],
        maxFileSize: 5 * 1024 * 1024, // 5MB
      }
    },

    css: {
      name: 'Showcase CSS',
      requiredFiles: [
        { pattern: /\.css$/i, description: 'Al menos un archivo CSS' },
      ],
      recommendedFiles: [
        { pattern: /^(index|demo)\.html$/i, description: 'index.html para demostrar los estilos' },
        { pattern: /^(styles|main)\.css$/i, description: 'styles.css como archivo principal' },
      ],
      structure: {
        maxDepth: 2,
        allowedExtensions: ['.css', '.scss', '.html', '.jpg', '.png', '.svg'],
        maxFileSize: 3 * 1024 * 1024, // 3MB
      }
    },

    markdown: {
      name: 'Documentación',
      requiredFiles: [
        { pattern: /\.md$/i, description: 'Al menos un archivo Markdown' },
      ],
      recommendedFiles: [
        { pattern: /^(README|index)\.md$/i, description: 'README.md como documento principal' },
      ],
      structure: {
        maxDepth: 3,
        allowedExtensions: ['.md', '.txt', '.jpg', '.png', '.gif', '.svg'],
        maxFileSize: 2 * 1024 * 1024, // 2MB
      }
    }
  };

  // Función para validar archivos
  const validateFiles = (files, projectType) => {
    const validator = validators[projectType];
    if (!validator) {
      return {
        isValid: false,
        errors: ['Tipo de proyecto no válido'],
        warnings: [],
        suggestions: []
      };
    }

    const errors = [];
    const warnings = [];
    const suggestions = [];

    // Validar archivos requeridos
    for (const required of validator.requiredFiles) {
      const hasRequired = files.some(file => required.pattern.test(file.path));
      if (!hasRequired) {
        errors.push(`Falta: ${required.description}`);
      }
    }

    // Validar archivos recomendados
    for (const recommended of validator.recommendedFiles) {
      const hasRecommended = files.some(file => recommended.pattern.test(file.path));
      if (!hasRecommended) {
        suggestions.push(`Recomendado: ${recommended.description}`);
      }
    }

    // Validar estructura
    const structure = validator.structure;
    
    // Validar extensiones
    for (const file of files) {
      const extension = '.' + file.path.split('.').pop().toLowerCase();
      if (!structure.allowedExtensions.includes(extension)) {
        warnings.push(`Extensión no común: ${file.path} (${extension})`);
      }
    }

    // Validar tamaño de archivos
    for (const file of files) {
      if (file.content && file.content.length > structure.maxFileSize) {
        warnings.push(`Archivo grande: ${file.path} (${(file.content.length / 1024 / 1024).toFixed(1)}MB)`);
      }
    }

    // Validar profundidad de carpetas
    const maxDepth = Math.max(...files.map(file => file.path.split('/').length - 1));
    if (maxDepth > structure.maxDepth) {
      warnings.push(`Estructura muy profunda: ${maxDepth} niveles (recomendado: ${structure.maxDepth})`);
    }

    // Validaciones específicas por tipo
    if (projectType === 'html') {
      // Buscar archivo principal HTML
      const mainHtml = files.find(f => /^index\.html$/i.test(f.path));
      if (!mainHtml) {
        suggestions.push('Considera nombrar tu archivo HTML principal como "index.html"');
      }
    }

    if (projectType === 'react') {
      // Verificar que hay componentes React válidos
      const reactFiles = files.filter(f => /\.(jsx?|tsx?)$/i.test(f.path));
      const hasValidReactComponents = reactFiles.some(file => 
        file.content && (
          file.content.includes('export default') ||
          file.content.includes('function') ||
          file.content.includes('const') ||
          file.content.includes('class')
        )
      );
      
      if (reactFiles.length > 0 && !hasValidReactComponents) {
        warnings.push('Los archivos React podrían no contener componentes válidos');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      stats: {
        totalFiles: files.length,
        totalSize: files.reduce((size, file) => size + (file.content?.length || 0), 0),
        fileTypes: getFileTypesStats(files),
        structure: getStructureStats(files)
      }
    };
  };

  // Función para obtener estadísticas de tipos de archivo
  const getFileTypesStats = (files) => {
    const stats = {};
    files.forEach(file => {
      const extension = '.' + file.path.split('.').pop().toLowerCase();
      stats[extension] = (stats[extension] || 0) + 1;
    });
    return stats;
  };

  // Función para obtener estadísticas de estructura
  const getStructureStats = (files) => {
    const depths = files.map(file => file.path.split('/').length - 1);
    return {
      maxDepth: Math.max(...depths),
      avgDepth: depths.reduce((a, b) => a + b, 0) / depths.length,
      folders: [...new Set(files.map(f => f.path.split('/').slice(0, -1).join('/')).filter(Boolean))]
    };
  };

  // Función para auto-corregir problemas comunes
  const autoFix = (files, projectType) => {
    let fixedFiles = [...files];
    const fixes = [];

    // Auto-fix para HTML: crear index.html si no existe
    if (projectType === 'html') {
      const hasIndex = fixedFiles.some(f => /^index\.html$/i.test(f.path));
      if (!hasIndex && fixedFiles.some(f => /\.html$/i.test(f.path))) {
        const firstHtml = fixedFiles.find(f => /\.html$/i.test(f.path));
        if (firstHtml && firstHtml.path !== 'index.html') {
          fixedFiles = fixedFiles.map(f => 
            f === firstHtml ? { ...f, path: 'index.html' } : f
          );
          fixes.push(`Renombrado ${firstHtml.path} a index.html`);
        }
      }
    }

    // Auto-fix para React: asegurar extensión correcta
    if (projectType === 'react') {
      fixedFiles = fixedFiles.map(file => {
        if (file.content && file.content.includes('JSX') && !file.path.includes('.jsx')) {
          const newPath = file.path.replace(/\.js$/i, '.jsx');
          fixes.push(`Cambiado ${file.path} a ${newPath} (contiene JSX)`);
          return { ...file, path: newPath };
        }
        return file;
      });
    }

    return { files: fixedFiles, fixes };
  };

  // Función para generar templates por tipo
  const generateTemplate = (projectType, method = 'template') => {
    const templates = {
      html: [
        {
          path: 'index.html',
          content: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto BisonCoders</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>¡Hola BisonCoders!</h1>
            <p>Este es tu nuevo proyecto web</p>
        </header>
        
        <main>
            <section class="hero">
                <h2>¿Listo para crear algo increíble?</h2>
                <button id="actionBtn" class="btn">¡Empezar!</button>
            </section>
        </main>
        
        <footer>
            <p>Creado con ❤️ en BisonCoders</p>
        </footer>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
          language: 'html'
        },
        {
          path: 'styles.css',
          content: `/* Estilos para tu proyecto BisonCoders */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

header {
    text-align: center;
    padding: 40px 0;
    border-bottom: 2px solid #f0f0f0;
}

header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero {
    text-align: center;
    padding: 60px 20px;
}

.hero h2 {
    font-size: 1.8em;
    margin-bottom: 30px;
    color: #555;
}

.btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 50px;
    font-size: 1.1em;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

footer {
    text-align: center;
    padding: 20px;
    color: #666;
    border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    header h1 {
        font-size: 2em;
    }
    
    .hero h2 {
        font-size: 1.4em;
    }
}`,
          language: 'css'
        },
        {
          path: 'script.js',
          content: `// JavaScript para tu proyecto BisonCoders
document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('actionBtn');
    const hero = document.querySelector('.hero');
    
    // Contador de clicks
    let clickCount = 0;
    
    // Mensajes aleatorios
    const messages = [
        '🚀 ¡Genial! Sigue explorando',
        '✨ ¡Increíble trabajo!',
        '🎉 ¡Eres imparable!',
        '💡 ¡Qué creativo!',
        '🔥 ¡En racha!',
        '⭐ ¡Excelente!',
        '🎯 ¡Perfecto!',
        '🌟 ¡Brillante!'
    ];
    
    actionBtn.addEventListener('click', function() {
        clickCount++;
        
        // Cambiar el texto del botón
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        actionBtn.textContent = randomMessage;
        
        // Agregar efecto visual
        actionBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            actionBtn.style.transform = 'scale(1)';
        }, 200);
        
        // Después de 5 clicks, mostrar mensaje especial
        if (clickCount === 5) {
            const specialMessage = document.createElement('div');
            specialMessage.innerHTML = \`
                <div style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px;
                    border-radius: 15px;
                    margin-top: 20px;
                    text-align: center;
                    animation: fadeIn 0.5s ease-in;
                ">
                    <h3>🎉 ¡Felicidades!</h3>
                    <p>Has desbloqueado el nivel BisonCoder</p>
                    <p><small>¡Sigue creando cosas increíbles! 💻</small></p>
                </div>
            \`;
            
            hero.appendChild(specialMessage);
            
            // Reset después de mostrar el mensaje
            setTimeout(() => {
                actionBtn.textContent = '¡Empezar de nuevo!';
                clickCount = 0;
            }, 3000);
        }
        
        // Volver al texto original después de 1 segundo
        if (clickCount < 5) {
            setTimeout(() => {
                actionBtn.textContent = '¡Empezar!';
            }, 1000);
        }
    });
    
    // Efecto de entrada suave
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        hero.style.transition = 'all 0.6s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 300);
});

// Función para cambiar colores del gradiente
function changeTheme() {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = randomColor;
}

// Cambiar tema cada 10 segundos (opcional)
// setInterval(changeTheme, 10000);`,
          language: 'javascript'
        }
      ],
      
      react: [
        {
          path: 'App.jsx',
          content: `import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('¡Hola BisonCoders!');
  const [theme, setTheme] = useState('light');

  const messages = [
    '🚀 ¡Increíble!',
    '✨ ¡Genial!',
    '🎉 ¡Fantástico!',
    '💡 ¡Brillante!',
    '🔥 ¡Impresionante!'
  ];

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount > 0 && newCount % 3 === 0) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMessage);
      
      setTimeout(() => {
        setMessage('¡Hola BisonCoders!');
      }, 2000);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={\`app \${theme}\`}>
      <header className="header">
        <h1 className="title">Mi App React</h1>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="main">
        <div className="hero">
          <h2 className="message">{message}</h2>
          
          <div className="counter">
            <p className="count-text">Has hecho click:</p>
            <div className="count-display">{count}</div>
            <button 
              className="count-button"
              onClick={handleClick}
            >
              ¡Hacer Click!
            </button>
          </div>

          {count >= 10 && (
            <div className="achievement">
              <h3>🏆 ¡Logro Desbloqueado!</h3>
              <p>¡Eres un verdadero BisonCoder!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Creado con ❤️ y React en BisonCoders</p>
      </footer>
    </div>
  );
}

export default App;`,
          language: 'javascript'
        },
        {
          path: 'App.css',
          content: `/* Estilos para tu App React */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: all 0.3s ease;
}

.app.light {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

.app.dark {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  color: #f7fafc;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 60px 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
}

.message {
  font-size: 2rem;
  margin-bottom: 40px;
  animation: fadeIn 0.6s ease-in;
}

.counter {
  margin-bottom: 30px;
}

.count-text {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.count-display {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 1s infinite;
}

.count-button {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
}

.count-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(238, 90, 36, 0.6);
}

.count-button:active {
  transform: translateY(0);
}

.achievement {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(45deg, #10ac84, #1dd1a1);
  border-radius: 15px;
  animation: slideIn 0.5s ease-out;
}

.achievement h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
}

.achievement p {
  margin: 0;
  font-size: 1.1rem;
}

.footer {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .hero {
    padding: 40px 20px;
    margin: 0 10px;
  }
  
  .message {
    font-size: 1.5rem;
  }
  
  .count-display {
    font-size: 3rem;
  }
}`,
          language: 'css'
        }
      ]
    };

    return templates[projectType] || templates.html;
  };

  return {
    validateFiles,
    autoFix,
    generateTemplate,
    validators
  };
};

export default useProjectStructureValidator;