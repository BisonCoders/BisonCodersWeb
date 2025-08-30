# Sitio Web Bisoncoders 
> Les dejo algo de documentación de mi parte

Este proyecto está basado en NextJS y Tailwind CSS para el frontend,
por ahora, para el backend pueden usar lo que mas se acomode a ustedes, mongoose, prisma, etc. Por mientras se me ocurrió hacer una plantilla simple genérica para que sea mas facil para ustedes modificarla.y

En la carpeta /components puse todas las partes del sitio web el About, Eventos, Footer, Navbar, y Hero, y la página principal es la que dice page.js que esta directamente en la carpeta /app, si necesitan o quieren hacer CSS custom ahi está el globals.css dentro de la carpeta /app también, en la carpeta /public pueden meter las imagenes o assets que se les de la gana y meterlas a la página.

**Este proyecto es libre y cualquiera del club que quiera contribuir adelante!**
> Atte: Andre Aguirre
##  Guía para Todos

### 1. Requisitos Previos
Antes de empezar, necesitas tener instalado:

1. **Git** (para clonar y subir cambios)
   - Descarga desde: https://git-scm.com/
   - En Windows: instala Git Bash también

2. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Esto también instala npm automáticamente

3. **Editor de código** (recomendado)
   - Visual Studio Code: https://code.visualstudio.com/

### 2. Clonar el Proyecto
Abre tu terminal/command prompt y ejecuta:

```bash
# Clona el repositorio
git clone [URL_DEL_REPOSITORIO]

# Entra a la carpeta del proyecto
cd BisonCodersWeb
```

### 3. Instalar Dependencias
```bash
# Instala todas las dependencias necesarias
npm install
```

### 4. Ejecutar el Proyecto
```bash
# Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la página.

### 5. 🎨 Cómo Modificar la Página

#### **Cambiar Colores**
Todos los colores están en las clases de Tailwind CSS. Los principales colores del tema son:

- **Azul principal**: `bg-blue-600`, `text-blue-600`, `hover:bg-blue-700`
- **Texto**: `text-gray-900` (oscuro), `text-white` (blanco)
- **Fondos**: `bg-white`, `bg-gray-50`, `bg-gray-900`

**Ejemplo**: Para cambiar el color principal de azul a verde:
```javascript
// En cualquier componente, cambia:
className="bg-blue-600 hover:bg-blue-700"
// Por:
className="bg-green-600 hover:bg-green-700"
```

#### **Cambiar Textos**
- **Hero section**: Edita `/app/components/Hero.js`
- **Información del club**: Edita `/app/components/About.js` 
- **Eventos**: Edita `/app/components/Events.js`
- **Pie de página**: Edita `/app/components/Footer.js`

#### **Agregar Imágenes**
1. Coloca tus imágenes en la carpeta `/public/`
2. Úsalas en los componentes:
```javascript
<Image src="/nombre-de-tu-imagen.jpg" alt="Descripción" width={300} height={200} />
```

#### **Modificar Estilos Globales**
Edita `/app/globals.css` para cambios de CSS personalizados.

### 6. 📤 Subir Cambios (Git)

#### **Primera vez (configurar Git)**
```bash
# Configura tu nombre y email
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

#### **Subir cambios**
```bash
# Ver qué archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "Descripción de lo que cambiaste"

# Subir a GitHub
git push
```

### 7. 🛠️ Comandos Útiles

```bash
# Ejecutar el proyecto
npm run dev

# Construir para producción
npm run build

# Revisar errores de código
npm run lint

# Ver el estado de Git
git status

# Ver historial de commits
git log --oneline

# Crear nueva rama para trabajar
git checkout -b nombre-de-tu-rama

# Cambiar entre ramas
git checkout nombre-de-rama
```

### 8. 📁 Estructura del Proyecto
```
BisonCodersWeb/
├── app/
│   ├── components/          # Todos los componentes
│   │   ├── Header.js       # Barra de navegación
│   │   ├── Hero.js         # Sección principal
│   │   ├── About.js        # Información del club
│   │   ├── Events.js       # Próximos eventos
│   │   └── Footer.js       # Pie de página
│   ├── globals.css         # Estilos globales
│   ├── layout.js           # Layout principal
│   └── page.js             # Página principal
├── public/                 # Imágenes y archivos estáticos
├── package.json            # Dependencias del proyecto
└── README.md              # Este archivo
```

### 9. ❓ Solución de Problemas Comunes

**Error: "npm no se reconoce"**
- Reinstala Node.js desde nodejs.org

**Error: "git no se reconoce"**
- Reinstala Git y asegúrate de agregarlo al PATH

**La página no carga cambios**
- Para el servidor (Ctrl+C) y vuelve a ejecutar `npm run dev`

**Conflictos en Git**
```bash
# Descarga los últimos cambios antes de hacer push
git pull
# Resuelve conflictos manualmente y luego:
git add .
git commit -m "Resolución de conflictos"
git push
```

### 10. 🎯 Consejos para Contribuir

1. **Siempre crea una rama nueva** para tus cambios
2. **Haz commits pequeños** y frecuentes con mensajes descriptivos
3. **Prueba tus cambios** antes de hacer push
4. **Pide ayuda** si tienes dudas en el grupo del club

¡Happy coding! 🐃💻

---

## 📚 Glosario de Conceptos para Novatos

### 🔧 Conceptos de Desarrollo

**Ejecutar/Correr el proyecto** 🏃‍♂️
- Iniciar el servidor de desarrollo para ver tu página web en el navegador
- Comando: `npm run dev`

**Instalar dependencias** 📦
- Descargar todas las librerías y herramientas que necesita el proyecto para funcionar
- Comando: `npm install`

**Construir/Build** 🏗️
- Preparar tu proyecto para ponerlo en producción (internet)
- Optimiza y comprime todos los archivos
- Comando: `npm run build`

**Linting** 🧹
- Revisar tu código en busca de errores o malas prácticas
- Como un corrector ortográfico pero para código
- Comando: `npm run lint`

### 📁 Conceptos de Git

**Clonar** 📋
- Descargar una copia completa del proyecto desde GitHub a tu computadora
- Como "descargar" pero con todo el historial de cambios
- Comando: `git clone [URL]`

**Inicializar** 🎬
- Crear un nuevo repositorio de Git en una carpeta
- Solo se hace una vez por proyecto
- Comando: `git init`

**Commit** 💾
- Guardar una "foto" de tus cambios con una descripción
- Es como guardar un punto de control en un videojuego
- Comando: `git commit -m "mensaje"`

**Push** ⬆️
- Subir tus commits (cambios guardados) a GitHub
- Como subir tus archivos a la nube
- Comando: `git push`

**Pull** ⬇️
- Descargar los últimos cambios que otros hayan subido
- Como actualizar tu copia con la versión más reciente
- Comando: `git pull`

**Status** 📊
- Ver qué archivos has modificado, agregado o eliminado
- Te dice el "estado" actual de tu proyecto
- Comando: `git status`

**Add** ➕
- Preparar archivos para incluir en tu próximo commit
- Como poner archivos en una "canasta" antes de guardarlos
- Comando: `git add .` (todos los archivos) o `git add archivo.js`

**Rama/Branch** 🌿
- Una versión paralela del proyecto donde puedes trabajar sin afectar la principal
- Como tener una copia de trabajo separada
- Comandos: `git checkout -b nueva-rama`, `git checkout rama-existente`

**Merge** 🤝
- Combinar los cambios de una rama con otra
- Unir tu trabajo con el trabajo principal
- Se hace generalmente desde GitHub (Pull Request)

### 🌐 Conceptos Web

**Frontend** 🎨
- La parte visual de la página web (lo que ves y con lo que interactúas)
- HTML, CSS, JavaScript, React, etc.

**Backend** ⚙️
- La parte del servidor (bases de datos, lógica del negocio)
- Node.js, Python, bases de datos, etc.

**Localhost** 🏠
- Tu computadora actuando como servidor web
- `localhost:3000` = tu página corriendo en tu compu en el puerto 3000

**Repositorio** 📚
- El "contenedor" donde vive todo tu proyecto
- Como una carpeta súper inteligente que recuerda todos los cambios

**URL/Link** 🔗
- La dirección web de tu proyecto
- Ejemplo: `https://github.com/usuario/BisonCodersWeb`

### 🔄 Flujo Típico de Trabajo

1. **Clonar** el proyecto → Tenerlo en tu compu
2. **Instalar** dependencias → Preparar herramientas
3. **Ejecutar** → Ver la página funcionando
4. **Modificar** archivos → Hacer cambios
5. **Add** → Preparar cambios
6. **Commit** → Guardar cambios con mensaje
7. **Push** → Subir a GitHub
8. **Repetir** pasos 4-7 según necesites

### 💡 Analogías Útiles

- **Git** = Sistema de "ctrl+z" súper avanzado para proyectos
- **GitHub** = Google Drive pero para código
- **Commit** = Punto de guardado en videojuegos
- **Branch** = Dimension paralela de tu proyecto
- **Merge** = Fusionar dimensiones paralelas
- **Clone** = Fotocopiadora de proyectos completos
- **npm** = App Store para herramientas de programación


