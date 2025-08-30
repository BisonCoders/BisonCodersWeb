'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const checkAdminAndFetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 403) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      router.push('/');
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session) {
      checkAdminAndFetchUsers();
    }
  }, [status, session, router]);

  const handleAction = async (userId, action, value) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action, value }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
        // Actualizar la lista de usuarios
        const updatedUsers = users.map(user => {
          if (user._id === userId) {
            switch (action) {
              case 'ban':
                return { ...user, banned: value };
              case 'mute':
                return { 
                  ...user, 
                  muted: value,
                  mutedUntil: value ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
                };
              case 'role':
                return { ...user, role: value };
              default:
                return user;
            }
          }
          return user;
        });
        setUsers(updatedUsers);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error al realizar la acción');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al realizar la acción');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="max-w-6xl mx-auto py-12 px-4">
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
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground mt-2">Gestiona usuarios, roles y moderación</p>
        </div>

        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            message.includes('exitosamente') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-card shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-default">
            <h2 className="text-lg font-semibold text-foreground">Usuarios ({users.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-default">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Fecha de Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-default">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {user.name || 'Sin nombre'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleAction(user._id, 'role', e.target.value)}
                        disabled={loading}
                        className="text-sm border border-default rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground"
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {user.banned && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Baneado
                          </span>
                        )}
                        {user.muted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Muteado
                          </span>
                        )}
                        {!user.banned && !user.muted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(user._id, 'ban', !user.banned)}
                          disabled={loading}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            user.banned
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } disabled:opacity-50`}
                        >
                          {user.banned ? 'Desbanear' : 'Banear'}
                        </button>
                        <button
                          onClick={() => handleAction(user._id, 'mute', !user.muted)}
                          disabled={loading}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            user.muted
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          } disabled:opacity-50`}
                        >
                          {user.muted ? 'Desmutear' : 'Mutear'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
