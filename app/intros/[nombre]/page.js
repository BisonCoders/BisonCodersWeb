'use client';

import Link from 'next/link';
import { usePresentacionesAuto } from '../hooks/usePresentacionesAuto';
import { useParams } from 'next/navigation';

const PresentacionPage = () => {
  const params = useParams();
  const nombre = params.nombre;
  const presentaciones = usePresentacionesAuto();
  
  const presentacion = presentaciones.find(p => p.nombre === nombre);

  if (!presentacion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Presentación no encontrada
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            La presentación &quot;{nombre}&quot; no existe o aún no ha sido creada.
          </p>
          <Link
            href="/intros"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Volver a presentaciones
          </Link>
        </div>
      </div>
    );
  }

  switch (nombre) {
    case 'ejemplo-presentacion':
      return <EjemploPresentacion presentacion={presentacion} />;
    case 'como-contribuir':
      return <ComoContribuir presentacion={presentacion} />;
    default:
      return <PresentacionGenerica presentacion={presentacion} />;
  }
};

const EjemploPresentacion = ({ presentacion }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex">
      <MenuLateral presentaciones={usePresentacionesAuto()} />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/intros" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Volver a presentaciones
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {presentacion.titulo}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                por {presentacion.autor}
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2>¡Esta es tu plantilla base!</h2>
              <p>
                Esta página sirve como ejemplo de cómo estructurar tu presentación personal.
                Puedes personalizar completamente el contenido, colores, layout y funcionalidad.
              </p>

              <h3>Estructura recomendada:</h3>
              <ul>
                <li>Título llamativo con emoji</li>
                <li>Tu nombre y una breve descripción</li>
                <li>Secciones sobre ti (experiencia, proyectos, intereses)</li>
                <li>Enlaces a tus redes sociales o portafolio</li>
                <li>Información de contacto</li>
              </ul>

              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 mt-6">
                <h4 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                  💡 Para crear tu presentación:
                </h4>
                <ol className="text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>1. Crea una carpeta con tu nombre en <code>app/intros/tu-nombre/</code></li>
                  <li>2. Copia este archivo como <code>page.js</code> en tu carpeta</li>
                  <li>3. Personaliza el contenido a tu gusto</li>
                  <li>4. Agrega tu presentación al hook usePresentaciones.js</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ComoContribuir = ({ presentacion }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex">
      <MenuLateral presentaciones={usePresentacionesAuto()} />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/intros" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Volver a presentaciones
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📚</div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {presentacion.titulo}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Guía completa para agregar tu presentación
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2>🚀 Pasos para contribuir</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h3 className="text-blue-900 dark:text-blue-100 mb-3">Paso 1: Crea tu carpeta</h3>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
mkdir app/intros/tu-nombre-aqui
                  </pre>
                </div>

                <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg border border-green-200 dark:border-green-700">
                  <h3 className="text-green-900 dark:text-green-100 mb-3">Paso 2: Crea tu page.js</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                    Copia el ejemplo y personalízalo:
                  </p>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
cp app/intros/ejemplo-presentacion/page.js app/intros/tu-nombre/page.js
                  </pre>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h3 className="text-purple-900 dark:text-purple-100 mb-3">Paso 3: Agrégala al menú</h3>
                  <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
                    Edita <code>app/intros/hooks/usePresentaciones.js</code> y agrega:
                  </p>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`{
  nombre: 'tu-nombre',
  titulo: 'Tu Nombre - Presentación',
  autor: 'Tu Nombre',
  descripcion: 'Una breve descripción de ti'
}`}
                  </pre>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                  <h3 className="text-orange-900 dark:text-orange-100 mb-3">Paso 4: ¡Personaliza!</h3>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    Haz que tu presentación sea única. Puedes usar cualquier componente de React,
                    agregar animaciones, cambiar colores, o incluso integrar bibliotecas externas.
                  </p>
                </div>
              </div>

              <h2>💡 Ideas para tu presentación</h2>
              <ul>
                <li>Información personal y profesional</li>
                <li>Proyectos que has desarrollado</li>
                <li>Tecnologías que dominas</li>
                <li>Hobbies e intereses</li>
                <li>Enlaces a GitHub, LinkedIn, portafolio</li>
                <li>Datos curiosos sobre ti</li>
              </ul>

              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mt-8">
                <h3>¿Necesitas ayuda?</h3>
                <p>
                  Si tienes dudas, revisa el código de ejemplo o contacta al equipo de BisonCoders.
                  ¡Estamos aquí para ayudarte a crear una presentación increíble!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PresentacionGenerica = ({ presentacion }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex">
      <MenuLateral presentaciones={usePresentacionesAuto()} />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/intros" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Volver a presentaciones
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {presentacion.titulo}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                por {presentacion.autor}
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Esta presentación está en desarrollo. ¡Pronto tendrá contenido personalizado!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MenuLateral = ({ presentaciones }) => (
  <div className="w-80 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Presentaciones
      </h2>
      
      <div className="space-y-3">
        {presentaciones.map((presentacion) => (
          <Link
            key={presentacion.nombre}
            href={`/intros/${presentacion.nombre}`}
            className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors border border-gray-200 dark:border-gray-600"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {presentacion.titulo}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              por {presentacion.autor}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {presentacion.descripcion}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          ¿Quieres contribuir?
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Agrega tu propia presentación al proyecto
        </p>
        <Link
          href="/intros/como-contribuir"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Ver instrucciones
        </Link>
      </div>
    </div>
  </div>
);

export default PresentacionPage;