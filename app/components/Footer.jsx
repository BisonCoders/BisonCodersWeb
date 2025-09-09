export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Terminal Footer Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 mb-8 border border-slate-800/50">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-mono text-slate-400 text-sm">~/footer</span>
          </div>
          <div className="text-emerald-400 text-sm">
            Conectando desarrolladores
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <span className="font-mono font-bold text-white text-sm">&lt;/&gt;</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent font-mono">
                  BisonCoders
                </h3>
                <span className="text-xs text-emerald-400 font-mono">v2.0.dev</span>
              </div>
            </div>
            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800/30 mb-6">
              <p className="text-slate-300 mb-4 leading-relaxed font-mono text-sm">
                <span className="text-cyan-400">Bisoncoders </span>
                <br />
                <span className="ml-2 text-slate-300">
                  <br />
                   Una comunidad donde el código cobra vida,
                  <br />
                   y las ideas se transforman en soluciones
                </span>
                <br />
              </p>
            </div>
            
            {/* GitHub Organization Link */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/30 mb-4">
              <h4 className="text-emerald-400 text-sm mb-2">
                Repositorio
              </h4>
              <div className="flex items-center space-x-3">
                <a 
                  href="https://github.com/BisonCoders/BisonCodersWeb" 
                  className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors group text-sm"
                >
                  <svg className="h-5 w-5 group-hover:text-emerald-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>github.com/BisonCoders</span>
                </a>
              </div>
            </div>
            
            {/* Social Links */}
            {/* <div className="flex space-x-4">
              <a href="#" className="group bg-slate-800/50 hover:bg-slate-700/50 p-3 rounded-lg transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50">
                <svg className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="group bg-slate-800/50 hover:bg-slate-700/50 p-3 rounded-lg transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50">
                <svg className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </a>
            </div> */}
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#events" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#members" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  Comunidad
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Contacto
            </h4>
            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800/30">
              <div className="space-y-3 text-slate-400 text-sm">
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2 mt-1">🏛️</span>
                  <div>
                    <span className="text-slate-300">Instituto Tecnológico</span>
                    <br />
                    <span className="text-slate-400">de Chihuahua II</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-emerald-400 mr-2">📧</span>
                  <span className="text-slate-400">bisoncoders@chihuhaua2.tecnm.mx</span>
                </div>
                <div className="flex items-center">
                  <span className="text-cyan-400 mr-2">🌐</span>
                  <span className="text-slate-400">Chihuahua, México</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 mt-12 pt-8">
          <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-800/30">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-slate-400 text-sm mb-2 md:mb-0">
                <span className="text-emerald-400">© </span>
                <span className="text-white">2025</span>
                <span className="text-slate-300"> BisonCoders.</span>
                <span className="text-slate-400"> Todos los derechos reservados.</span>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400">En línea</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-cyan-400">Versión:</span> 2.0.0-beta
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}