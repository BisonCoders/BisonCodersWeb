import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    default: 'javascript',
  },
});

const ProjectSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    index: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  ownerImage: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  files: [FileSchema],
  mainFile: {
    type: String,
    required: true,
    default: 'index.html',
  },
  projectType: {
    type: String,
    required: true,
    enum: ['html', 'react', 'vue', 'vanilla-js', 'css', 'markdown'],
    default: 'html',
  },
  tags: [{
    type: String,
    trim: true,
    maxLength: 20,
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  likes: [{
    userId: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  forkCount: {
    type: Number,
    default: 0,
  },
  originalProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Índices para optimizar consultas
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ ownerId: 1, createdAt: -1 });
ProjectSchema.index({ isPublic: 1, createdAt: -1 });
ProjectSchema.index({ tags: 1 });

// Middleware para actualizar updatedAt
ProjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método estático para buscar proyectos públicos
ProjectSchema.statics.findPublicProjects = function(limit = 20, skip = 0) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-files.content') // No incluir contenido de archivos en el feed
    .lean();
};

// Método para verificar si un usuario es el owner
ProjectSchema.methods.isOwner = function(userId) {
  return this.ownerId === userId;
};

// Método para obtener el archivo principal
ProjectSchema.methods.getMainFileContent = function() {
  const mainFile = this.files.find(file => file.path === this.mainFile);
  return mainFile ? mainFile.content : '';
};

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);