export default function Events() {
  const events = [
    {
      title: "Workshop: React Avanzado",
      date: "15 de Marzo, 2024",
      time: "19:00 - 21:00",
      description: "Aprende patrones avanzados de React, hooks personalizados y optimización de rendimiento.",
      type: "Workshop"
    },
    {
      title: "Hackathon BisonCoders 2024",
      date: "22-24 de Marzo, 2024",
      time: "Todo el fin de semana",
      description: "48 horas de coding intensivo. Forma tu equipo y crea una aplicación innovadora.",
      type: "Hackathon"
    },
    {
      title: "Charla: Arquitectura de Microservicios",
      date: "5 de Abril, 2024",
      time: "18:30 - 20:00",
      description: "Diseño y implementación de arquitecturas escalables con microservicios.",
      type: "Charla"
    }
  ];

  return (
    <section id="events" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Próximos Eventos
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Únete a nuestras actividades y conecta con otros desarrolladores apasionados por la tecnología.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-1 rounded">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏰</span>
                    {event.time}
                  </div>
                </div>
                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                  Registrarse
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}