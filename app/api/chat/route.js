import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Chat from '@/models/Chat';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();

    // Obtener todos los chats donde el usuario es participante o es el chat general
    const chats = await Chat.find({
      $or: [
        { type: 'general' },
        { participants: session.user.id },
        { createdBy: session.user.id }
      ],
      isActive: true
    })
    .populate('participants', 'name email image')
    .populate('messages.sender', 'name email image')
    .populate('createdBy', 'name email image')
    .sort({ updatedAt: -1 });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error al obtener chats:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, type, participants } = await request.json();

    await connectDB();

    // Validar que el nombre no esté vacío
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre del chat es requerido' }, { status: 400 });
    }

    // Para chats privados, validar que hay exactamente 2 participantes
    if (type === 'private' && (!participants || participants.length !== 1)) {
      return NextResponse.json({ error: 'Los chats privados deben tener exactamente 2 participantes' }, { status: 400 });
    }

    // Verificar si ya existe un chat privado entre estos usuarios
    if (type === 'private') {
      const existingChat = await Chat.findOne({
        type: 'private',
        participants: { $all: [session.user.id, participants[0]] },
        isActive: true
      });

      if (existingChat) {
        return NextResponse.json({ error: 'Ya existe un chat privado con este usuario' }, { status: 400 });
      }
    }

    // Crear el nuevo chat
    const newChat = new Chat({
      name,
      type,
      participants: type === 'private' ? [session.user.id, ...participants] : participants || [],
      createdBy: session.user.id
    });

    await newChat.save();

    // Poblar los datos del chat creado
    const populatedChat = await Chat.findById(newChat._id)
      .populate('participants', 'name email image')
      .populate('createdBy', 'name email image');

    return NextResponse.json(populatedChat, { status: 201 });
  } catch (error) {
    console.error('Error al crear chat:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
