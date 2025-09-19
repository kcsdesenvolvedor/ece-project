// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'topqqlhoigpqjmerasmz.supabase.co', // Cole o hostname do seu erro aqui
        port: '',
        pathname: '/storage/v1/object/public/avatars/**', // Permite qualquer imagem dentro do bucket 'avatars'
      },
    ],
  },
};

export default nextConfig;