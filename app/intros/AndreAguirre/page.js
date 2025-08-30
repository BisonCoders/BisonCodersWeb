// PLANTILLA PARA TU PRESENTACIÓN PERSONAL
// Copia este archivo a tu carpeta app/intros/tu-nombre/page.js
// y personalízalo con tu información

'use client';

import Link from 'next/link';

const TuPresentacion = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Botón de regreso */}
      <div className="p-6">
        <Link 
          href="/intros" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Volver a presentaciones
        </Link>
      </div>

      {/* Sección principal */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        {/* Header con foto/avatar */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
            {/* Cambia esto por tu inicial o una imagen */}
            TN
          </div>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Tu Nombre Aquí
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Tu profesión o área de especialidad
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Una breve descripción sobre ti. Puedes hablar de tu pasión por la programación,
            tus objetivos profesionales, o algo que te caracterice como persona.
          </p>
        </div>

        {/* Secciones de contenido */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Sobre mí */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-3">👨‍💻</span>
              Sobre mí
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                • 🎓 Estudiante de [tu carrera] en [tu universidad]
              </p>
              <p>
                • 💼 [Tu experiencia laboral o prácticas]
              </p>
              <p>
                • 🌟 Me especializo en [tus tecnologías favoritas]
              </p>
              <p>
                • 🎯 Mi objetivo es [tus metas profesionales]
              </p>
            </div>
          </div>

          {/* Tecnologías */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-3">🛠️</span>
              Tecnologías
            </h2>
            <div className="flex flex-wrap gap-3">
              {/* Personaliza estas tecnologías */}
              {['JavaScript', 'React', 'Node.js', 'Python', 'Git', 'HTML/CSS'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Proyectos destacados */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <span className="text-2xl mr-3">🚀</span>
            Proyectos Destacados
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Proyecto 1 - Personaliza esto */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Nombre del Proyecto 1
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                Descripción breve del proyecto y las tecnologías utilizadas.
              </p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
                >
                  Ver código →
                </a>
                <a
                  href="#"
                  className="text-green-600 hover:text-green-800 dark:text-green-400 text-sm font-medium"
                >
                  Demo →
                </a>
              </div>
            </div>

            {/* Proyecto 2 - Personaliza esto */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Nombre del Proyecto 2
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                Descripción breve del proyecto y las tecnologías utilizadas.
              </p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
                >
                  Ver código →
                </a>
                <a
                  href="#"
                  className="text-green-600 hover:text-green-800 dark:text-green-400 text-sm font-medium"
                >
                  Demo →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Datos curiosos */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <span className="text-2xl mr-3">✨</span>
            Datos Curiosos
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">☕</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Tazas de café al día: <span className="font-bold">∞</span>
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎮</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Videojuego favorito: <span className="font-bold">[Tu juego]</span>
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎵</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Música para programar: <span className="font-bold">[Tu género]</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contacto y redes */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            ¡Conectemos! 🤝
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {/* Personaliza estos enlaces */}
            <a
              href="mailto:tu-email@ejemplo.com"
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              📧 Email
            </a>
            <a
              href="https://github.com/tu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              💻 GitHub
            </a>
            <a
              href="https://linkedin.com/in/tu-perfil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg transition-colors"
            >
              💼 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuPresentacion;