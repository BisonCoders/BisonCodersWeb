export default function Hero() {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/herobg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80  "></div>
      
      {/* Patrón de código sutil */}
      <div className="absolute inset-0 opacity-[20%]">
        <div className="absolute top-20 left-20 font-mono text-sm text-green-400">
          {'{ "welcome": "BisonCoders" }'}
        </div>
        <div className="absolute top-40 right-20 font-mono text-sm text-blue-400">
          {'console.log("Hello World");'}
        </div>
        <div className="absolute bottom-40 left-40 font-mono text-sm text-purple-400">
          {'const future = await code();'}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Terminal-style header */}
          <div className="inline-block bg-slate-900/90 backdrop-blur-sm rounded-lg p-1 border border-slate-700">
            <div className=" items-center px-4 py-2 bg-slate-800/50 rounded">
              <span className="font-mono text-slate-400 text-xl font-bold ">&lt;/&gt;
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              BisonCoders
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-slate-200 mb-4 leading-relaxed">
              Desarrolladores que construyen el futuro
            </p>
            <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed">
              Un espacio donde el código cobra vida, las ideas se transforman en soluciones, 
              y cada desarrollador encuentra su tribu tecnológica.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
              <span className="relative z-10">Únete al Club</span>
            </button>
            <button className="group relative border-2 border-slate-400 text-slate-300 hover:text-white hover:border-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm bg-slate-900/30 hover:bg-slate-800/50">
              <span className="relative z-10">Ver Proyectos</span>
            </button>
          </div>
        </div>
        
        {/* Features cards con diseño más tech */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700 p-8 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Aprende</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Workshops técnicos, code reviews y mentorías personalizadas. 
              Desde algoritmos hasta arquitecturas complejas.
            </p>
          </div>
          
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700 p-8 rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Colabora</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Proyectos open source, hackathons y desarrollo ágil en equipos. 
              Tu próximo startup puede nacer aquí.
            </p>
          </div>
          
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700 p-8 rounded-xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Crece</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Networking profesional, oportunidades laborales y crecimiento 
              exponencial en el ecosistema tech.
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm">Descubre más</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}