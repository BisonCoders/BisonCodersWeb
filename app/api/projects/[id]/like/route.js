import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { connectDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';
import mongoose from 'mongoose';

// POST /api/projects/[id]/like - Toggle like/unlike
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de proyecto inválido' },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    if (!project.isPublic) {
      return NextResponse.json(
        { error: 'No puedes dar like a proyectos privados' },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const existingLike = project.likes.find(like => like.userId === userId);

    if (existingLike) {
      // Unlike - remover like
      project.likes = project.likes.filter(like => like.userId !== userId);
    } else {
      // Like - agregar like
      project.likes.push({
        userId,
        createdAt: new Date(),
      });
    }

    await project.save();

    return NextResponse.json({
      message: existingLike ? 'Like removido' : 'Like agregado',
      isLiked: !existingLike,
      likesCount: project.likes.length,
    });

  } catch (error) {
    console.error('Error procesando like:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}