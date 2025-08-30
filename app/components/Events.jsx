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
    <section id="events" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Próximos Eventos
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Únete a nuestras actividades y conecta con otros desarrolladores apasionados por la tecnología.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {event.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏰</span>
                    {event.time}
                  </div>
                </div>
                <button className="w-full mt-6 gradient-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105">
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