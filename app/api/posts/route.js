import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const posts = await db.collection('posts')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { content, title } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: 'Título y contenido son requeridos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Obtener información del usuario
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    const post = {
      title,
      content,
      author: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: user?.role || 'user'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
      comments: []
    };

    const result = await db.collection('posts').insertOne(post);
    post._id = result.insertedId;

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error al crear post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'ID del post requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Verificar si el usuario es admin o el autor del post
    const user = await db.collection('users').findOne({ email: session.user.email });
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    if (user?.role !== 'admin' && post.author.email !== session.user.email) {
      return NextResponse.json({ error: 'No tienes permisos para eliminar este post' }, { status: 403 });
    }

    await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });

    return NextResponse.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
