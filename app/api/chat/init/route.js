import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Chat from '@/models/Chat';

export async function POST() {
  try {
    await connectDB();

    // Verificar si ya existe un chat general
    const existingGeneralChat = await Chat.findOne({ type: 'general' });
    
    if (existingGeneralChat) {
      return NextResponse.json({ message: 'Chat general ya existe', chat: existingGeneralChat });
    }

    // Crear el chat general por defecto
    const generalChat = new Chat({
      name: 'Chat General',
      type: 'general',
      participants: [],
      messages: []
    });

    await generalChat.save();

    return NextResponse.json({ 
      message: 'Chat general creado exitosamente', 
      chat: generalChat 
    }, { status: 201 });
  } catch (error) {
    console.error('Error al inicializar chat general:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
