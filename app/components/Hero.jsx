export default function Hero() {
  return (
    <section id="home" className="gradient-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Bienvenidos a{" "}
            <span className="text-primary-600">BisonCoders</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            El club de programación donde desarrolladores de todos los niveles se unen para 
            aprender, compartir conocimientos y crear proyectos increíbles juntos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="gradient-primary text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 hover:scale-105">
              Únete al Club
            </button>
            <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200">
              Ver Proyectos
            </button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in">
              <div className="text-3xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aprende
              </h3>
              <p className="text-muted-foreground">
                Workshops, tutoriales y sesiones de coding en grupo
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Colabora
              </h3>
              <p className="text-muted-foreground">
                Trabaja en proyectos reales con otros desarrolladores
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Crece
              </h3>
              <p className="text-muted-foreground">
                Desarrolla tus habilidades y expande tu red profesional
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}