export default function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bienvenidos a{" "}
            <span className="text-blue-600 dark:text-blue-400">BisonCoders</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            El club de programación donde desarrolladores de todos los niveles se unen para 
            aprender, compartir conocimientos y crear proyectos increíbles juntos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Únete al Club
            </button>
            <button className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Ver Proyectos
            </button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aprende
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Workshops, tutoriales y sesiones de coding en grupo
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Colabora
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Trabaja en proyectos reales con otros desarrolladores
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Crece
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Desarrolla tus habilidades y expande tu red profesional
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}