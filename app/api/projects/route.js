import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectMongoDB from '../../../lib/mongodb';
import Project from '../../../models/Project';
import User from '../../../models/User';

// GET /api/projects - Obtener lista de proyectos públicos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');
    const tag = searchParams.get('tag');
    
    const skip = (page - 1) * limit;

    await connectMongoDB();

    let query = { isPublic: true };
    
    // Filtrar por usuario específico
    if (userId) {
      query.ownerId = userId;
    }
    
    // Filtrar por tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-files.content') // No enviar contenido de archivos en la lista
      .lean();

    // Agregar información de likes
    const projectsWithLikes = projects.map(project => ({
      ...project,
      likesCount: project.likes?.length || 0,
      files: project.files?.map(file => ({
        path: file.path,
        language: file.language,
      })) || [],
    }));

    const totalProjects = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalProjects / limit);

    return NextResponse.json({
      projects: projectsWithLikes,
      pagination: {
        currentPage: page,
        totalPages,
        totalProjects,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Crear nuevo proyecto
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, files, mainFile, projectType, tags, isPublic } = body;

    // Validaciones básicas
    if (!title || !description || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (title.length > 100 || description.length > 500) {
      return NextResponse.json(
        { error: 'Título o descripción demasiado largos' },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Crear nuevo proyecto
    const project = new Project({
      ownerId: session.user.id,
      ownerName: session.user.name,
      ownerEmail: session.user.email,
      ownerImage: session.user.image,
      title: title.trim(),
      description: description.trim(),
      files: files.map(file => ({
        path: file.path,
        content: file.content,
        language: file.language || 'javascript',
      })),
      mainFile: mainFile || files[0].path,
      projectType: projectType || 'html',
      tags: tags || [],
      isPublic: isPublic !== false, // Por defecto público
    });

    await project.save();

    // Incrementar contador de proyectos del usuario
    const user = await User.findById(session.user.id);
    if (user) {
      await user.incrementProjectsCount();
    }

    return NextResponse.json({
      message: 'Proyecto creado exitosamente',
      project: {
        _id: project._id,
        title: project.title,
        description: project.description,
        projectType: project.projectType,
        createdAt: project.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}