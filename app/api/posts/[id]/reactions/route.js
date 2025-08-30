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

    const { emoji } = await request.json();
    const postId = params.id;

    if (!emoji) {
      return NextResponse.json({ error: 'Emoji requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Verificar si el usuario ya reaccionó con este emoji
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const reactions = post.reactions || {};
    const userEmail = session.user.email;
    
    // Si el usuario ya reaccionó con este emoji, remover la reacción
    if (reactions[emoji] && reactions[emoji].includes(userEmail)) {
      await db.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        { 
          $pull: { [`reactions.${emoji}`]: userEmail },
          $set: { updatedAt: new Date() }
        }
      );
    } else {
      // Agregar la reacción
      await db.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        { 
          $addToSet: { [`reactions.${emoji}`]: userEmail },
          $set: { updatedAt: new Date() }
        }
      );
    }

    // Obtener el post actualizado
    const updatedPost = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

    return NextResponse.json({ reactions: updatedPost.reactions });
  } catch (error) {
    console.error('Error al manejar reacción:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
