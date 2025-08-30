export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sobre BisonCoders
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Somos una comunidad apasionada de desarrolladores que cree en el poder del 
            aprendizaje colaborativo y el desarrollo de software de calidad.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Nuestra Misión
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Crear un espacio inclusivo donde programadores de todos los niveles puedan 
              aprender, compartir conocimientos y construir proyectos que marquen la diferencia.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Workshops semanales sobre tecnologías actuales
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Proyectos colaborativos de código abierto
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Mentorías personalizadas
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Hackathons y competencias
                </span>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Miembros Activos</div>
            </div>
            <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">25+</div>
              <div className="text-gray-600 dark:text-gray-300">Proyectos Completados</div>
            </div>
            <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Sesiones de Coding</div>
            </div>
            <div className="bg-orange-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-300">Tecnologías Estudiadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}