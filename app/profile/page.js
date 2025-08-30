'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    carrera: '',
    semestre: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.name || session?.user?.name || '',
          carrera: data.carrera || '',
          semestre: data.semestre || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage('Perfil actualizado exitosamente');
      } else {
        setMessage('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-card shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-8">
            {session.user.image && (
              <img 
                src={session.user.image} 
                alt={session.user.name} 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-default rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label htmlFor="carrera" className="block text-sm font-medium text-foreground mb-2">
                Carrera
              </label>
              <input
                type="text"
                id="carrera"
                name="carrera"
                value={profile.carrera}
                onChange={handleChange}
                placeholder="Ej: Ingeniería en Sistemas Computacionales"
                className="w-full px-3 py-2 border border-default rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
              />
            </div>

            <div>
              <label htmlFor="semestre" className="block text-sm font-medium text-foreground mb-2">
                Semestre
              </label>
              <input
                type="text"
                id="semestre"
                name="semestre"
                value={profile.semestre}
                onChange={handleChange}
                placeholder="Ej: 5to Semestre o Egresado"
                className="w-full px-3 py-2 border border-default rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('exitosamente') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-default rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white gradient-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
