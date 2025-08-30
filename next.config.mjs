/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para ignorar errores durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Experimental features
  experimental: {
    turbo: {},
  },
  
  // Configuración para evitar generación estática problemática
  output: 'standalone',
};

export default nextConfig;
