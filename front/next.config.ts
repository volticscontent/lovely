import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações de imagens
  images: {
    unoptimized: true,
    domains: ['localhost', '127.0.0.1', 'lovelygame.shop', 'api.lovelygame.shop', 'app.lovelygame.shop']
  },
  
  // Configurações de headers para desenvolvimento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Configurações de webpack para desenvolvimento
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
  
  // Configurações de servidor para desenvolvimento
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  
  // Configurações de output
  output: 'standalone',
  
  // Configurações de compressão
  compress: true,
  
  // Configurações de redirecionamentos
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
