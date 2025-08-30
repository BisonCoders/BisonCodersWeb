'use client';

import Link from 'next/link';

const ComoContribuir = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link 
          href="/intros" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          ← Volver a presentaciones
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cómo Contribuir con tu Presentación
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Sigue estos pasos para agregar tu presentación personal al proyecto BisonCoders
            </p>
          </div>

          <div className="space-y-8">
            {/* Paso 1 */}
            <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center mb-4">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  1
                </span>
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                  Crea tu carpeta personal
                </h2>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Navega al directorio del proyecto y crea una carpeta con tu nombre:
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  mkdir app/intros/tu-nombre-aqui
                </code>
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-2">
                💡 Usa tu nombre real o username, sin espacios (ej: "juan-perez", "maria-garcia")
              </p>
            </div>

            {/* Paso 2 */}
            <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center mb-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  2
                </span>
                <h2 className="text-2xl font-semibold text-green-900 dark:text-green-100">
                  Copia la plantilla
                </h2>
              </div>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Copia el archivo de ejemplo a tu nueva carpeta:
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  cp app/intros/ejemplo-presentacion/page.js app/intros/tu-nombre/page.js
                </code>
              </div>
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                📋 Esto te dará una base completa para empezar tu presentación
              </p>
            </div>

            {/* Paso 3 */}
            <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center mb-4">
                <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  3
                </span>
                <h2 className="text-2xl font-semibold text-purple-900 dark:text-purple-100">
                  Personaliza tu presentación
                </h2>
              </div>
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                Abre tu archivo page.js y personaliza toda la información:
              </p>
              <div className="space-y-3 text-sm text-purple-600 dark:text-purple-400">
                <div className="flex items-center">
                  <span className="mr-2">✏️</span>
                  Cambia "Tu Nombre Aquí" por tu nombre real
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💼</span>
                  Actualiza tu profesión o especialidad
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📝</span>
                  Escribe tu biografía personal
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💻</span>
                  Lista tus tecnologías favoritas
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🚀</span>
                  Agrega tus proyectos más importantes
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🔗</span>
                  Incluye tus enlaces de contacto reales
                </div>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
              <div className="flex items-center mb-4">
                <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  4
                </span>
                <h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-100">
                  Agrégala al feed
                </h2>
              </div>
              <p className="text-orange-700 dark:text-orange-300 mb-4">
                Edita el archivo <code>app/intros/hooks/usePresentacionesAuto.js</code> y agrega tu entrada:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`// Encuentra la sección "PRESENTACIONES DE LA COMUNIDAD" y agrega:
{
  nombre: 'tu-nombre-carpeta',
  titulo: '🚀 Tu Nombre Completo',
  autor: 'Tu Nombre',
  descripcion: 'Una descripción atractiva sobre ti y tus habilidades',
  fechaCreacion: '2025-01-XX',
  tipo: 'personal',
  avatar: '🎯', // Tu emoji favorito
  tags: ['tu-tecnologia', 'tu-especialidad', 'tu-hobby']
}`}
                </pre>
              </div>
              <p className="text-orange-600 dark:text-orange-400 text-sm mt-2">
                🎨 Tu presentación aparecerá automáticamente en el feed tipo Twitter!
              </p>
            </div>

            {/* Paso 5 */}
            <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center mb-4">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  5
                </span>
                <h2 className="text-2xl font-semibold text-red-900 dark:text-red-100">
                  Prueba tu presentación
                </h2>
              </div>
              <p className="text-red-700 dark:text-red-300 mb-4">
                Ejecuta el servidor de desarrollo para ver tu presentación:
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  npm run dev
                </code>
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                🌐 Visita http://localhost:3000/intros/tu-nombre para verla
              </p>
            </div>
          </div>

          {/* Consejos adicionales */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Consejos para una gran presentación
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contenido:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Sé auténtico y muestra tu personalidad</li>
                  <li>Incluye proyectos que te enorgullezcan</li>
                  <li>Menciona tus hobbies e intereses</li>
                  <li>Agrega datos curiosos sobre ti</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Diseño:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Usa colores que te representen</li>
                  <li>Agrega emojis para hacerla más visual</li>
                  <li>Mantén un diseño limpio y legible</li>
                  <li>Asegúrate de que sea responsive</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ¿Listo para empezar? 🚀
            </h3>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/intros/ejemplo-presentacion"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ver ejemplo completo
              </Link>
              <a
                href="https://github.com/tu-organizacion/BisonCodersWeb"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ir al repositorio
              </a>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
              ¿Tienes dudas? ¡Contacta al equipo de BisonCoders para recibir ayuda!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComoContribuir;