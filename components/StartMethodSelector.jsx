'use client';

import { useState } from 'react';

const StartMethodSelector = ({ projectType, selectedMethod, onMethodSelect }) => {
  const [hoveredMethod, setHoveredMethod] = useState(null);

  // Métodos base disponibles para todos los tipos
  const baseMethods = [
    {
      id: 'template',
      name: 'Desde Template',
      description: 'Empieza con una plantilla preconfigurada',
      pros: ['Inicio rápido', 'Buenas prácticas', 'Estructura lista'],
      time: '30 segundos',
      difficulty: 'Principiante'
    },
    {
      id: 'scratch',
      name: 'Desde Cero',
      description: 'Crea tu proyecto desde una base limpia',
      pros: ['Control total', 'Sin código extra', 'Personalizable'],
      time: '2-5 minutos',
      difficulty: 'Intermedio'
    },
    {
      id: 'upload',
      name: 'Subir Archivos',
      description: 'Sube archivos existentes de tu computadora',
      pros: ['Proyecto existente', 'Múltiples archivos', 'Preserva estructura'],
      time: '1-3 minutos',
      difficulty: 'Principiante'
    }
  ];

  // Métodos específicos por tipo de proyecto
  const specificMethods = {
    react: [
      {
        id: 'react-template',
        name: 'Template React',
        description: 'Plantilla optimizada con componentes modernos',
        pros: ['Hooks incluidos', 'Componentes ejemplo', 'CSS moderno'],
        time: '1 minuto',
        difficulty: 'Principiante'
      }
    ],
    import: [
      {
        id: 'github',
        name: 'Desde GitHub',
        description: 'Importa un repositorio público de GitHub',
        pros: ['Repositorio completo', 'Historial', 'Colaborativo'],
        time: '2-5 minutos',
        difficulty: 'Avanzado'
      }
    ]
  };

  // Combinar métodos base con específicos
  const availableMethods = [
    ...baseMethods,
    ...(specificMethods[projectType] || [])
  ];

  // Filtrar métodos según el tipo de proyecto
  const getFilteredMethods = () => {
    if (projectType === 'import') {
      // Para importar, solo mostrar métodos de upload y GitHub
      return availableMethods.filter(method => 
        ['upload', 'github'].includes(method.id)
      );
    }
    
    // Para otros tipos, mostrar todos excepto GitHub
    return availableMethods.filter(method => method.id !== 'github');
  };

  const filteredMethods = getFilteredMethods();

  const handleMethodSelect = (method) => {
    onMethodSelect(method.id);
  };

  const getMethodIcon = (methodId) => {
    const iconMap = {
      template: 'devicon-materialui-plain',
      scratch: 'devicon-code-plain', 
      upload: 'devicon-dropbox-plain',
      github: 'devicon-github-original',
      'react-template': 'devicon-react-original'
    };
    
    const iconClass = iconMap[methodId] || iconMap.template;
    
    return (
      <i className={`${iconClass} text-2xl`}></i>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Principiante':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'Intermedio':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Avanzado':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
    }
  };

  const getProjectTypeName = (type) => {
    const typeNames = {
      html: 'Página Web Simple',
      react: 'Aplicación React',
      'vanilla-js': 'Proyecto JavaScript',
      css: 'Showcase CSS',
      markdown: 'Documentación',
      import: 'Importar Proyecto'
    };
    return typeNames[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded text-sm font-medium mb-4">
          <span className="mr-2">📋</span>
          {getProjectTypeName(projectType)}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          ¿Cómo quieres empezar?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Elige el método que mejor se adapte a tu situación y experiencia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method)}
            className={`
              relative cursor-pointer transition-all duration-200
              ${selectedMethod === method.id 
                ? 'ring-2 ring-indigo-500 shadow-md' 
                : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
              }
            `}
          >
            {/* Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                  {getMethodIcon(method.id)}
                </div>
                
                {selectedMethod === method.id && (
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title and Description */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {method.name}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {method.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {method.time}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(method.difficulty)}`}>
                  {method.difficulty}
                </span>
              </div>

              {/* Pros */}
              <div className="flex-grow">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
                  Ventajas:
                </p>
                <ul className="space-y-1">
                  {method.pros.map((pro, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Method Info */}
      {selectedMethod && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-slate-600 dark:text-slate-400 mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Método seleccionado: {filteredMethods.find(m => m.id === selectedMethod)?.name}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Continúa al siguiente paso para configurar tu proyecto
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartMethodSelector;