import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const messages = await db.collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Obtener información del usuario
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    // Verificar si el usuario está baneado o muteado
    if (user?.banned) {
      return NextResponse.json({ error: 'Tu cuenta ha sido baneada' }, { status: 403 });
    }
    
    if (user?.muted && user.mutedUntil && new Date() < new Date(user.mutedUntil)) {
      return NextResponse.json({ error: 'Estás muteado temporalmente' }, { status: 403 });
    }
    
    const message = {
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

    const result = await db.collection('messages').insertOne(message);
    message._id = result.insertedId;

    // Mensaje guardado exitosamente en DB

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error al crear mensaje:', error);
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
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json({ error: 'ID del mensaje requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Verificar si el usuario es admin o el autor del mensaje
    const user = await db.collection('users').findOne({ email: session.user.email });
    const message = await db.collection('messages').findOne({ _id: new ObjectId(messageId) });

    if (!message) {
      return NextResponse.json({ error: 'Mensaje no encontrado' }, { status: 404 });
    }

    if (user?.role !== 'admin' && message.author.email !== session.user.email) {
      return NextResponse.json({ error: 'No tienes permisos para eliminar este mensaje' }, { status: 403 });
    }

    await db.collection('messages').deleteOne({ _id: new ObjectId(messageId) });

    return NextResponse.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
