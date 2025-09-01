/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para ignorar errores durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración de imágenes para permitir dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    turbo: {},
  },
  
  // Configuración para evitar generación estática problemática
  output: 'standalone',
};

export default nextConfig;
