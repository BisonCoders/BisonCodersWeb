import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { content } = await request.json();
    const postId = params.id;

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Obtener información del usuario
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    const comment = {
      _id: new ObjectId(),
      content: content.trim(),
      author: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: user?.role || 'user'
      },
      createdAt: new Date()
    };

    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { 
        $push: { comments: comment },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const postId = params.id;

    if (!commentId) {
      return NextResponse.json({ error: 'ID del comentario requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Verificar si el usuario es admin o el autor del comentario
    const user = await db.collection('users').findOne({ email: session.user.email });
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }

    if (user?.role !== 'admin' && comment.author.email !== session.user.email) {
      return NextResponse.json({ error: 'No tienes permisos para eliminar este comentario' }, { status: 403 });
    }

    await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { 
        $pull: { comments: { _id: new ObjectId(commentId) } },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
