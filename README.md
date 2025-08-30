# BisonCoders - Comunidad de Programadores

Una plataforma web para conectar programadores y desarrolladores, con sistema de autenticación OAuth y perfiles personalizables.

## Características

- 🔐 Autenticación OAuth con Google y GitHub
- 👤 Perfiles personalizables (nombre, carrera, semestre)
- 🗄️ Base de datos MongoDB para almacenar usuarios
- 🎨 Interfaz moderna y responsive
- ⚡ Desarrollado con Next.js 15

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui-cambialo-en-produccion

# MongoDB
MONGODB_URI=mongodb+srv://bisoncodersdb:9TO5cDHbWvr6UjfW@cluster0.ryv1yjy.mongodb.net/

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id-aqui
GOOGLE_CLIENT_SECRET=tu-google-client-secret-aqui

# GitHub OAuth
GITHUB_CLIENT_ID=tu-github-client-id-aqui
GITHUB_CLIENT_SECRET=tu-github-client-secret-aqui
```

### 3. Obtener API Keys

#### Google OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configura las URLs de redirección:
   - Desarrollo: `http://localhost:3000/api/auth/callback/google`
   - Producción: `https://tu-dominio.com/api/auth/callback/google`
6. Copia el `Client ID` y `Client Secret` a tu `.env.local`

#### GitHub OAuth:
1. Ve a [GitHub Settings](https://github.com/settings/developers)
2. Haz clic en "New OAuth App"
3. Configura las URLs de redirección:
   - Desarrollo: `http://localhost:3000/api/auth/callback/github`
   - Producción: `https://tu-dominio.com/api/auth/callback/github`
4. Copia el `Client ID` y `Client Secret` a tu `.env.local`

### 4. Generar NEXTAUTH_SECRET

Para generar un secret seguro, puedes usar:

```bash
openssl rand -base64 32
```

O visita: https://generate-secret.vercel.app/32

### 5. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js    # Configuración NextAuth
│   │   ├── profile/route.js               # API para perfiles
│   │   ├── posts/route.js                 # API para posts
│   │   ├── chat/route.js                  # API para chat
│   │   └── admin/users/route.js           # API para administración
│   ├── auth/
│   │   └── signin/page.js                 # Página de login
│   ├── components/
│   │   ├── Header.js                      # Header con autenticación
│   │   ├── AuthButton.js                  # Botón de autenticación con menú
│   │   ├── SessionProvider.js             # Provider de sesión
│   │   └── ...                            # Otros componentes
│   ├── profile/
│   │   └── page.js                        # Página de perfil
│   ├── posts/
│   │   └── page.js                        # Página de posts
│   ├── chat/
│   │   └── page.js                        # Página de chat
│   ├── admin/
│   │   └── page.js                        # Panel de administración
│   └── ...                                # Otras páginas
├── lib/
│   └── mongodb.js                         # Configuración MongoDB
└── .env.local                             # Variables de entorno
```

## Funcionalidades

### Autenticación
- Botón único de "Iniciar Sesión" con menú desplegable
- Opciones de login con Google OAuth y GitHub OAuth
- Sesiones persistentes
- Logout seguro

### Sistema de Posts
- Crear y publicar posts con título y contenido
- Ver posts de todos los usuarios
- Eliminar posts propios o como admin
- Interfaz moderna y responsive

### Chat en Tiempo Real
- Chat comunitario con mensajes en tiempo real
- Polling automático cada 3 segundos
- Eliminar mensajes propios o como admin
- Indicadores de roles (Admin)

### Sistema de Roles y Moderación
- **Roles:** Usuario (por defecto) y Admin
- **Panel de Administración** exclusivo para admins
- **Funciones de Admin:**
  - Cambiar roles de usuarios
  - Banear/Desbanear usuarios
  - Mutear/Desmutear usuarios (24 horas)
  - Ver todos los usuarios registrados
- **Moderación automática** en chat y posts

### Perfil de Usuario
- Editar nombre completo
- Entrada manual de carrera
- Entrada manual de semestre
- Avatar automático desde OAuth

### Base de Datos
- Almacenamiento en MongoDB Atlas
- Colección `users` para perfiles y roles
- Colección `posts` para publicaciones
- Colección `messages` para chat
- Colección `accounts` para OAuth (automática)
- Colección `sessions` para sesiones (automática)

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Autenticación**: NextAuth.js v4
- **Base de Datos**: MongoDB Atlas
- **Deploy**: Vercel (recomendado)

## Deploy en Producción

1. Configura las variables de entorno en tu plataforma de deploy
2. Actualiza las URLs de redirección en Google Cloud Console y GitHub
3. Cambia `NEXTAUTH_URL` a tu dominio de producción
4. Genera un nuevo `NEXTAUTH_SECRET` para producción

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.



