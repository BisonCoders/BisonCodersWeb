import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection('users').findOne(
      { email: session.user.email },
      { projection: { name: 1, carrera: 1, semestre: 1, image: 1, role: 1 } }
    );

    return NextResponse.json(user || {});
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, carrera, semestre } = await request.json();

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('users').updateOne(
      { email: session.user.email },
      { 
        $set: { 
          name: name || session.user.name,
          carrera: carrera || '',
          semestre: semestre || '',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Perfil actualizado' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
