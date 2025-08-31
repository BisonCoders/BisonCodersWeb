import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectDB } from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import User from '../../../../models/User';
import mongoose from 'mongoose';

// GET /api/projects/[id] - Obtener proyecto específico
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de proyecto inválido' },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id).lean();
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el proyecto es público o si el usuario es el owner
    const session = await getServerSession(authOptions);
    const isOwner = session?.user?.id === project.ownerId;
    
    if (!project.isPublic && !isOwner) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Agregar información adicional
    const projectData = {
      ...project,
      isOwner,
      likesCount: project.likes?.length || 0,
      isLiked: project.likes?.some(like => like.userId === session?.user?.id) || false,
    };

    return NextResponse.json({ project: projectData });

  } catch (error) {
    console.error('Error obteniendo proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Actualizar proyecto (solo owner)
export async function PUT(request, { params }) {
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

    const body = await request.json();
    const { title, description, files, mainFile, projectType, tags, isPublic } = body;

    await connectDB();

    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar ownership
    if (project.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Solo el propietario puede editar este proyecto' },
        { status: 403 }
      );
    }

    // Actualizar campos
    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (files) project.files = files;
    if (mainFile) project.mainFile = mainFile;
    if (projectType) project.projectType = projectType;
    if (tags !== undefined) project.tags = tags;
    if (isPublic !== undefined) project.isPublic = isPublic;

    project.updatedAt = new Date();
    
    await project.save();

    return NextResponse.json({
      message: 'Proyecto actualizado exitosamente',
      project: {
        _id: project._id,
        title: project.title,
        description: project.description,
        updatedAt: project.updatedAt,
      },
    });

  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Eliminar proyecto (solo owner)
export async function DELETE(request, { params }) {
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

    // Verificar ownership
    if (project.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Solo el propietario puede eliminar este proyecto' },
        { status: 403 }
      );
    }

    await Project.findByIdAndDelete(id);

    // Decrementar contador de proyectos del usuario
    const user = await User.findById(session.user.id);
    if (user) {
      await user.decrementProjectsCount();
    }

    return NextResponse.json({
      message: 'Proyecto eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}