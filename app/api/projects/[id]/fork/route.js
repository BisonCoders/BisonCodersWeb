import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/Project';
import User from '../../../../../models/User';
import mongoose from 'mongoose';

// POST /api/projects/[id]/fork - Fork (crear copia) de un proyecto
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

    await connectMongoDB();

    const originalProject = await Project.findById(id);
    
    if (!originalProject) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    if (!originalProject.isPublic) {
      return NextResponse.json(
        { error: 'No puedes hacer fork de proyectos privados' },
        { status: 403 }
      );
    }

    // No permitir fork de su propio proyecto
    if (originalProject.ownerId === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes hacer fork de tu propio proyecto' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description } = body;

    // Crear nuevo proyecto basado en el original
    const forkedProject = new Project({
      ownerId: session.user.id,
      ownerName: session.user.name,
      ownerEmail: session.user.email,
      ownerImage: session.user.image,
      title: title || `Fork de ${originalProject.title}`,
      description: description || `Fork del proyecto de ${originalProject.ownerName}`,
      files: originalProject.files.map(file => ({
        path: file.path,
        content: file.content,
        language: file.language,
      })),
      mainFile: originalProject.mainFile,
      projectType: originalProject.projectType,
      tags: [...originalProject.tags, 'fork'],
      isPublic: true,
      originalProject: originalProject._id,
    });

    await forkedProject.save();

    // Incrementar contador de forks en el proyecto original
    originalProject.forkCount = (originalProject.forkCount || 0) + 1;
    await originalProject.save();

    // Incrementar contador de proyectos del usuario
    const user = await User.findById(session.user.id);
    if (user) {
      await user.incrementProjectsCount();
    }

    return NextResponse.json({
      message: 'Proyecto forkeado exitosamente',
      project: {
        _id: forkedProject._id,
        title: forkedProject.title,
        description: forkedProject.description,
        originalProject: {
          _id: originalProject._id,
          title: originalProject.title,
          ownerName: originalProject.ownerName,
        },
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error forkeando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}