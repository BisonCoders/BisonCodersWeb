'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Step1ProjectType from './wizard-steps/Step1ProjectType';
import Step2StartMethod from './wizard-steps/Step2StartMethod';
import Step3Configuration from './wizard-steps/Step3Configuration';
import Step4Editor from './wizard-steps/Step4Editor';
import Header from '../app/components/Header';

const ProjectCreationWizard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    type: '',
    startMethod: '',
    title: '',
    description: '',
    files: [],
    mainFile: '',
    tags: [],
    isPublic: true,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { number: 1, title: 'Tipo de Proyecto', description: 'Elige qué tipo de proyecto quieres crear' },
    { number: 2, title: 'Método de Inicio', description: 'Cómo quieres empezar tu proyecto' },
    { number: 3, title: 'Configuración', description: 'Información básica del proyecto' },
    { number: 4, title: 'Editor', description: 'Crea y edita tu código' }
  ];

  const updateProjectData = (updates) => {
    setProjectData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return projectData.type !== '';
      case 2:
        return projectData.startMethod !== '';
      case 3:
        return projectData.title.trim() !== '' && projectData.description.trim() !== '';
      case 4:
        return projectData.files.length > 0;
      default:
        return false;
    }
  };

  const handleCreateProject = async () => {
    if (!canProceedToNext() || isCreating) return;

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectData.title.trim(),
          description: projectData.description.trim(),
          files: projectData.files,
          mainFile: projectData.mainFile || projectData.files[0]?.path,
          projectType: projectData.type,
          tags: projectData.tags,
          isPublic: projectData.isPublic,
        }),
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
      setIsCreating(false);
    }
  };

  if (!session) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Inicia sesión para crear proyectos
          </h2>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Crear Nuevo Proyecto
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center space-x-2">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                  ${currentStep === step.number 
                    ? 'bg-indigo-600 text-white' 
                    : currentStep > step.number 
                      ? 'bg-green-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }
                `}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                {step.number < steps.length && (
                  <div className={`w-6 h-0.5 mx-1 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Info */}
        <div className="mt-2">
          <h2 className="text-base font-medium text-slate-800 dark:text-slate-200">
            Paso {currentStep}: {steps[currentStep - 1].title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Content - Flexible height */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className={`${currentStep === 4 ? 'w-full h-full' : 'max-w-4xl mx-auto p-4'}`}>
            {error && currentStep !== 4 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Step Content */}
            {currentStep === 1 && (
              <Step1ProjectType 
                projectData={projectData}
                updateProjectData={updateProjectData}
              />
            )}
            {currentStep === 2 && (
              <Step2StartMethod 
                projectData={projectData}
                updateProjectData={updateProjectData}
              />
            )}
            {currentStep === 3 && (
              <Step3Configuration 
                projectData={projectData}
                updateProjectData={updateProjectData}
              />
            )}
            {currentStep === 4 && (
              <>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 mb-2 mx-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <Step4Editor 
                  projectData={projectData}
                  updateProjectData={updateProjectData}
                />
              </>
            )}
          </div>
        </div>

        {/* Navigation - Fixed height */}
        <div className="flex-shrink-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-3">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentStep} de {steps.length}
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                disabled={!canProceedToNext()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 text-sm"
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleCreateProject}
                disabled={!canProceedToNext() || isCreating}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 text-sm"
              >
                {isCreating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Crear Proyecto
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectCreationWizard;