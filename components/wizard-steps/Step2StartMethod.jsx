'use client';

import { useState } from 'react';
import StartMethodSelector from '../StartMethodSelector';
import SmartFileUploader from '../SmartFileUploader';
import useProjectStructureValidator from '../ProjectStructureValidator';

const Step2StartMethod = ({ projectData, updateProjectData }) => {
  const [validationResults, setValidationResults] = useState(null);
  const validator = useProjectStructureValidator();

  const handleMethodSelect = (method) => {
    updateProjectData({ startMethod: method });
    
    // Si selecciona template, generar archivos automáticamente
    if (method === 'template' && projectData.type) {
      const templateFiles = validator.generateTemplate(projectData.type);
      updateProjectData({ 
        files: templateFiles,
        mainFile: templateFiles[0]?.path || 'index.html'
      });
    }
  };

  const handleFilesUpload = (files) => {
    updateProjectData({ 
      files,
      mainFile: files.find(f => f.path.toLowerCase().includes('index'))?.path || files[0]?.path
    });
  };

  const handleValidationResult = (results) => {
    setValidationResults(results);
  };

  return (
    <div className="space-y-8">
      <StartMethodSelector 
        projectType={projectData.type}
        selectedMethod={projectData.startMethod}
        onMethodSelect={handleMethodSelect}
      />

      {/* Show file uploader for upload method */}
      {projectData.startMethod === 'upload' && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Subir Archivos
          </h3>
          <SmartFileUploader
            projectType={projectData.type}
            onFilesUpload={handleFilesUpload}
            onValidationResult={handleValidationResult}
          />
        </div>
      )}

      {/* Show GitHub URL input for github method */}
      {projectData.startMethod === 'github' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Importar desde GitHub
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                URL del repositorio
              </label>
              <input
                type="url"
                placeholder="https://github.com/usuario/repositorio"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                onChange={(e) => updateProjectData({ githubUrl: e.target.value })}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Solo repositorios públicos son soportados
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Próximamente:</strong> La importación desde GitHub estará disponible pronto. 
                Por ahora, puedes descargar el repositorio como ZIP y usar "Subir Archivos".
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show template preview for template method */}
      {projectData.startMethod === 'template' && projectData.files.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Template cargado: {projectData.files.length} archivo{projectData.files.length > 1 ? 's' : ''}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                Archivos: {projectData.files.map(f => f.path).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show scratch info for scratch method */}
      {projectData.startMethod === 'scratch' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Proyecto desde cero
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Empezarás con un editor limpio. Tendrás control total sobre la estructura de tu proyecto.
            </p>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                En el siguiente paso podrás configurar los detalles de tu proyecto y 
                comenzar a escribir código en el editor integrado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2StartMethod;