'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function Posts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);
  const [newComments, setNewComments] = useState({});

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏'];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session) {
      fetchPosts();
    }
  }, [status, session, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const post = await response.json();
        setPosts([post, ...posts]);
        setNewPost({ title: '', content: '' });
        setShowForm(false);
        setMessage('Post creado exitosamente');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error al crear el post');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al crear el post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
        setMessage('Post eliminado exitosamente');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error al eliminar el post');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al eliminar el post');
    }
  };

  const handleComment = async (postId) => {
    const comment = newComments[postId];
    if (!comment || !comment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), newComment]
            };
          }
          return post;
        }));
        setNewComments({ ...newComments, [postId]: '' });
      }
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter(c => c._id !== commentId)
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  const handleReaction = async (postId, emoji) => {
    try {
      const response = await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji }),
      });

      if (response.ok) {
        const { reactions } = await response.json();
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return { ...post, reactions };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error al reaccionar:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Posts de la Comunidad</h1>
            <p className="text-gray-600">Comparte tus ideas y conecta con otros desarrolladores</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {showForm ? 'Cancelar' : '✨ Nuevo Post'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 border-l-4 ${
            message.includes('exitosamente') 
              ? 'bg-green-50 text-green-800 border-green-400' 
              : 'bg-red-50 text-red-800 border-red-400'
          }`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Crear Nuevo Post</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Escribe un título atractivo..."
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-3">
                  Contenido
                </label>
                <textarea
                  id="content"
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Comparte tus pensamientos, preguntas o experiencias..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? 'Publicando...' : '🚀 Publicar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post._id} className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  {post.author.image && (
                    <img 
                      src={post.author.image} 
                      alt={post.author.name} 
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="font-medium">{post.author.name}</span>
                      {post.author.role === 'admin' && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          👑 Admin
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {(session.user.email === post.author.email || session.user.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
              
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
              </div>

              {/* Reacciones */}
              <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Reacciones:</span>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => {
                    const reactions = post.reactions?.[emoji] || [];
                    const hasReacted = reactions.includes(session.user.email);
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(post._id, emoji)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          hasReacted 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{emoji}</span>
                        {reactions.length > 0 && (
                          <span className="text-xs">{reactions.length}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comentarios */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Comentarios ({post.comments?.length || 0})
                  </h4>
                  <button
                    onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedPost === post._id ? 'Ocultar' : 'Ver'} comentarios
                  </button>
                </div>

                {expandedPost === post._id && (
                  <div className="space-y-4">
                    {/* Formulario de comentario */}
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newComments[post._id] || ''}
                        onChange={(e) => setNewComments({ ...newComments, [post._id]: e.target.value })}
                        placeholder="Escribe un comentario..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Comentar
                      </button>
                    </div>

                    {/* Lista de comentarios */}
                    <div className="space-y-3">
                      {post.comments?.map((comment) => (
                        <div key={comment._id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                              {comment.author.image && (
                                <img 
                                  src={comment.author.image} 
                                  alt={comment.author.name} 
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{comment.author.name}</span>
                                  {comment.author.role === 'admin' && (
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-700 mt-1">{comment.content}</p>
                                <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
                              </div>
                            </div>
                            {(session.user.email === comment.author.email || session.user.role === 'admin') && (
                              <button
                                onClick={() => handleDeleteComment(post._id, comment._id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay posts aún</h3>
              <p className="text-gray-600 text-lg">¡Sé el primero en compartir algo con la comunidad!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
