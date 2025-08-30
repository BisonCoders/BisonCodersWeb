import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Verificar si el usuario es admin
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const users = await db.collection('users')
      .find({})
      .project({ 
        name: 1, 
        email: 1, 
        role: 1, 
        banned: 1, 
        muted: 1, 
        mutedUntil: 1,
        createdAt: 1 
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Verificar si el usuario es admin
    const adminUser = await db.collection('users').findOne({ email: session.user.email });
    
    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { userId, action, value } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'ID de usuario y acción requeridos' }, { status: 400 });
    }

    const updateData = {};

    switch (action) {
      case 'ban':
        updateData.banned = value;
        break;
      case 'mute':
        updateData.muted = value;
        if (value) {
          updateData.mutedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
        } else {
          updateData.mutedUntil = null;
        }
        break;
      case 'role':
        if (!['user', 'admin'].includes(value)) {
          return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
        }
        updateData.role = value;
        break;
      default:
        return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Usuario ${action === 'ban' ? (value ? 'baneado' : 'desbaneado') : 
                       action === 'mute' ? (value ? 'muteado' : 'desmuteado') : 
                       `rol cambiado a ${value}`} exitosamente` 
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
