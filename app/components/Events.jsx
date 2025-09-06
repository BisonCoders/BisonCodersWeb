import Link from "next/link";

export default function Events() {
  const events = [
    {
      title: "Space Apps Challenge 2025",
      date: "X oct, 2025", 
      time: "36 horas",
      description: "NASA's international hackathon. Build innovative solutions for space exploration challenges using real NASA data.",
      link: "https://www.spaceappschallenge.org/2025/",
      type: "hackathon",
      status: "en proceso",
      tech: ["JavaScript", "Python", "Data Science", "APIs"],
      difficulty: "intermedio",
    },
    {
      title: "Escuelita Maker Batch 4 Luminar",
      date: "September 9, 2025",
      time: "3 Meses Intensivos",
      description: "Batch 4 Luminar - Transform your idea into reality",
      link: "https://escuelitamaker.com/",
      type: "hackathon",
      status: "llega pronto",
      tech: [""],
      difficulty: "all-levels",
    },
    // {
    //   title: "Taller de Git y GitHub para Principiantes",
    //   date: "5 de sept, 2025",
    //   time: "10:30am - 12:00pm",
    //   description: "Aprende a usar Git y GitHub para gestionar tu código de manera eficiente. Este taller es ideal para principiantes que quieren aprender a usar estas herramientas esenciales para el desarrollo de software.",
    //   link: "#",
    //   type: "taller",
    //   status: "available",
    //   tech: ["GitBash", "GitHub", "Terminal", "VSCode"],
    //   difficulty: "beginner",
    // },
    // {
    //   title: "AI & Machine Learning Bootcamp",
    //   date: "12-14 de Abril, 2025",
    //   time: "weekend intensive",
    //   description: "Comprehensive ML/AI bootcamp covering neural networks, computer vision, and deployment strategies.",
    //   link: "https://bisoncoders.dev/ai-bootcamp",
    //   type: "bootcamp",
    //   status: "early-bird",
    //   tech: ["Python", "TensorFlow", "PyTorch", "MLOps"],
    //   difficulty: "intermediate",
    // },
    // {
    //   title: "Web3 & Blockchain Development",
    //   date: "19 de Abril, 2025",
    //   time: "14:00 - 18:00",
    //   description: "Build your first DApp. Smart contracts, Solidity programming, and decentralized application architecture.",
    //   link: "https://bisoncoders.dev/web3-workshop",
    //   type: "workshop",
    //   status: "available",
    //   tech: ["Solidity", "Web3.js", "Ethereum", "IPFS"],
    //   difficulty: "beginner",
    // },
    // {
    //   title: "DevOps & Cloud Native Summit",
    //   date: "26-27 de Abril, 2025",
    //   time: "full weekend",
    //   description: "Master modern DevOps practices. CI/CD pipelines, cloud infrastructure, monitoring, and security best practices.",
    //   link: "https://bisoncoders.dev/devops-summit",
    //   type: "conference",
    //   status: "early-bird",
    //   tech: ["AWS", "Terraform", "Jenkins", "Monitoring"],
    //   difficulty: "intermediate",
    // },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'from-emerald-500 to-green-500';
      case 'registering': return 'from-blue-500 to-cyan-500';
      case 'coming-soon': return 'from-purple-500 to-violet-500';
      case 'early-bird': return 'from-orange-500 to-yellow-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hackathon': return '🚀';
      case 'workshop': return '⚡';
      case 'bootcamp': return '🎯';
      case 'conference': return '🌟';
      default: return '💻';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/10';
      case 'intermediate': return 'text-cyan-400 bg-cyan-500/10';
      case 'advanced': return 'text-purple-400 bg-purple-500/10';
      case 'all-levels': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <section id="events" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 font-mono text-sm text-emerald-400">
          {'for (const event of events) {'}
        </div>
        <div className="absolute top-32 right-20 font-mono text-sm text-cyan-400">
          {'  event.execute();'}
        </div>
        <div className="absolute bottom-20 left-32 font-mono text-sm text-purple-400">
          {'}'}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-700 mb-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 rounded">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              </div>
              <span className="font-arial text-slate-400 text-lg">eventos</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
              Próximos Eventos
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Eventos técnicos diseñados por y para desarrolladores. Desde hackathons hasta workshops especializados,
            conecta con la comunidad tech y mejora tus habilidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-105 cursor-pointer"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(event.type)}</span>
                    <span className="font-mono text-xs text-slate-400">{event.type}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-mono font-medium bg-gradient-to-r ${getStatusColor(event.status)} text-white`}>
                    {event.status.replace('-', ' ')}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                  {event.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-2 py-1 bg-slate-800/50 border border-slate-600/30 rounded text-xs font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Event Details */}
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex items-center text-slate-400 font-mono">
                    <span className="text-cyan-400 mr-2">📅</span>
                    {event.date}
                  </div>
                  <div className="flex items-center text-slate-400 font-mono">
                    <span className="text-emerald-400 mr-2">⏱️</span>
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">🎯</span>
                    <span className={`px-2 py-1 rounded text-xs font-mono ${getDifficultyColor(event.difficulty)}`}>
                      {event.difficulty.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={event.link}
                  className="block w-full text-center bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Registrarse
                </Link>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-cyan-500/0 to-emerald-500/0 group-hover:from-emerald-500/20 group-hover:via-cyan-500/20 group-hover:to-emerald-500/20 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-slate-400 text-lg">
            ¿Quieres organizar un evento con nosotros?
          </p>
          <button className="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300">
            Contáctanos
          </button>
        </div>
      </div>
    </section>
  );
}
