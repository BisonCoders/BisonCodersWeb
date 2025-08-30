import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">😵</div>
        <h1 className="text-4xl font-bold text-white mb-4">404 - Página no encontrada</h1>
        <p className="text-white/80 mb-8 text-lg">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link 
          href="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

