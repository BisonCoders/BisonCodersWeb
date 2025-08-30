import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  // Datos de OAuth providers
  providers: [{
    provider: String, // 'google', 'github'
    providerId: String,
  }],
  // Estadísticas del usuario
  projectsCount: {
    type: Number,
    default: 0,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
  // Configuraciones del editor
  editorSettings: {
    theme: {
      type: String,
      enum: ['vs-dark', 'vs-light', 'hc-black'],
      default: 'vs-dark',
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    wordWrap: {
      type: String,
      enum: ['on', 'off', 'wordWrapColumn', 'bounded'],
      default: 'on',
    },
    minimap: {
      enabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Índices
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ lastActive: -1 });

// Método para actualizar última actividad
UserSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Método para incrementar contador de proyectos
UserSchema.methods.incrementProjectsCount = function() {
  this.projectsCount += 1;
  return this.save();
};

// Método para decrementar contador de proyectos
UserSchema.methods.decrementProjectsCount = function() {
  this.projectsCount = Math.max(0, this.projectsCount - 1);
  return this.save();
};

export default mongoose.models.User || mongoose.model('User', UserSchema);