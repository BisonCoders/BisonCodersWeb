'use client';

import { useState } from 'react';

const ProjectTypeSelector = ({ selectedType, onTypeSelect }) => {
  const [hoveredType, setHoveredType] = useState(null);

  const projectTypes = [
    {
      id: 'html',
      name: 'Página Web Simple',
      description: 'HTML, CSS y JavaScript estático para sitios web básicos',
      features: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
      examples: ['Landing page', 'Portfolio', 'Blog estático']
    },
    {
      id: 'react',
      name: 'Aplicación React',
      description: 'Aplicación moderna con React y componentes interactivos',
      features: ['React 19', 'JSX', 'Hooks', 'Componentes'],
      examples: ['SPA', 'Dashboard', 'App interactiva']
    },
    {
      id: 'vanilla-js',
      name: 'Proyecto JavaScript',
      description: 'JavaScript puro con múltiples archivos y módulos',
      features: ['ES6+', 'Módulos', 'DOM', 'APIs'],
      examples: ['Juego web', 'Calculadora', 'Widget']
    },
    {
      id: 'css',
      name: 'Showcase CSS',
      description: 'Demostración de estilos CSS avanzados y animaciones',
      features: ['CSS3', 'Flexbox', 'Grid', 'Animaciones'],
      examples: ['Componentes UI', 'Animaciones', 'Layouts']
    },
    {
      id: 'markdown',
      name: 'Documentación',
      description: 'Documentación técnica con Markdown y preview',
      features: ['Markdown', 'Preview', 'GitHub Style'],
      examples: ['README', 'Docs', 'Tutorial']
    },
    {
      id: 'import',
      name: 'Importar Proyecto',
      description: 'Subir archivos existentes o importar desde repositorio',
      features: ['Upload', 'GitHub', 'Zip', 'Multi-archivo'],
      examples: ['Proyecto existente', 'Backup', 'Colaboración']
    }
  ];

  const handleTypeSelect = (type) => {
    onTypeSelect(type.id);
  };

  const getTypeIcon = (typeId) => {
    const iconMap = {
      html: 'devicon-html5-plain',
      react: 'devicon-react-original', 
      'vanilla-js': 'devicon-javascript-plain',
      css: 'devicon-css3-plain',
      markdown: 'devicon-markdown-original',
      import: 'devicon-git-plain'
    };
    
    const iconClass = iconMap[typeId] || iconMap.html;
    
    return (
      <i className={`${iconClass} text-4xl`}></i>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          ¿Qué tipo de proyecto quieres crear?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Elige el tipo que mejor se adapte a tu proyecto. Cada uno tiene herramientas y plantillas especializadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleTypeSelect(type)}
            className={`
              relative cursor-pointer group transition-all duration-200
              ${selectedType === type.id 
                ? 'ring-2 ring-indigo-500 shadow-md' 
                : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
              }
            `}
          >
            {/* Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-4">
                  {getTypeIcon(type.id)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {type.name}
                  </h4>
                  {selectedType === type.id && (
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Seleccionado
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">
                {type.description}
              </p>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {type.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 text-xs rounded border border-slate-200 dark:border-slate-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Examples - Show on click only if selected */}
              {selectedType === type.id && (
                <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                    Ejemplos de uso:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {type.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded border border-indigo-200 dark:border-indigo-800"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {selectedType === type.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Type Info */}
      {selectedType && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-slate-600 dark:text-slate-400 mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Tipo seleccionado: {projectTypes.find(t => t.id === selectedType)?.name}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Continúa al siguiente paso para elegir cómo empezar
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTypeSelector;