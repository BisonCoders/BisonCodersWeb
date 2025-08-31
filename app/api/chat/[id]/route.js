import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Chat from '@/models/Chat';
import pusher from '@/lib/pusher';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    await connectDB();

    const chat = await Chat.findById(id)
      .populate('participants', 'name email image')
      .populate('messages.sender', 'name email image')
      .populate('createdBy', 'name email image');

    if (!chat) {
      return NextResponse.json({ error: 'Chat no encontrado' }, { status: 404 });
    }

    // Verificar que el usuario tiene acceso al chat
    if (chat.type !== 'general' && 
        !chat.participants.some(p => p._id.toString() === session.user.id) &&
        chat.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No tienes acceso a este chat' }, { status: 403 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error al obtener chat:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
    }

    await connectDB();

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json({ error: 'Chat no encontrado' }, { status: 404 });
    }

    // Verificar que el usuario tiene acceso al chat
    if (chat.type !== 'general' && 
        !chat.participants.includes(session.user.id) &&
        chat.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No tienes acceso a este chat' }, { status: 403 });
    }

    // Crear el nuevo mensaje
    const newMessage = {
      sender: session.user.id,
      content: content.trim(),
      timestamp: new Date()
    };

    // Agregar el mensaje al chat
    chat.messages.push(newMessage);
    await chat.save();

    // Poblar el mensaje con la información del remitente
    const populatedChat = await Chat.findById(id)
      .populate('messages.sender', 'name email image');

    const lastMessage = populatedChat.messages[populatedChat.messages.length - 1];

    // Enviar el mensaje a través de Pusher
    await pusher.trigger(`chat-${id}`, 'new-message', {
      message: lastMessage,
      chatId: id
    });

    // Enviar notificaciones a los participantes del chat (excepto al remitente)
    const participants = chat.participants.filter(p => p.toString() !== session.user.id);
    
    for (const participantId of participants) {
      await pusher.trigger(`user-${participantId}`, 'new-message', {
        senderName: session.user.name,
        chatId: id,
        chatName: chat.name,
        message: lastMessage.content
      });
    }

    return NextResponse.json(lastMessage, { status: 201 });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
