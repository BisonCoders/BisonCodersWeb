export default function About() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sobre BisonCoders
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Somos una comunidad apasionada de desarrolladores que cree en el poder del 
            aprendizaje colaborativo y el desarrollo de software de calidad.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Nuestra Misión
            </h3>
            <p className="text-muted-foreground mb-6">
              Crear un espacio inclusivo donde programadores de todos los niveles puedan 
              aprender, compartir conocimientos y construir proyectos que marquen la diferencia.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary-600 mr-3">✓</span>
                <span className="text-muted-foreground">
                  Workshops semanales sobre tecnologías actuales
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-3">✓</span>
                <span className="text-muted-foreground">
                  Proyectos colaborativos de código abierto
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-3">✓</span>
                <span className="text-muted-foreground">
                  Mentorías personalizadas
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-3">✓</span>
                <span className="text-muted-foreground">
                  Hackathons y competencias
                </span>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg text-center shadow-md">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-muted-foreground">Miembros Activos</div>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-muted-foreground">Proyectos Completados</div>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-muted-foreground">Sesiones de Coding</div>
            </div>
            <div className="bg-card p-6 rounded-lg text-center shadow-md">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-muted-foreground">Tecnologías Estudiadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}