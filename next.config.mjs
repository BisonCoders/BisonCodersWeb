/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para ignorar errores durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración para evitar problemas de contexto
  experimental: {
    appDir: true,
  },
  
  // Configuración para evitar generación estática problemática
  output: 'standalone',
};

export default nextConfig;
