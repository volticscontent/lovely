/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  
  // Configurações otimizadas para produção
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Configurações de imagem otimizadas
  images: {
    domains: ['localhost', '31.97.15.106', 'pub-9e19518e85994c27a69dd5b29e669dca.r2.dev'],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers otimizados para resolver problemas de CSP e HTTP/2
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.facebook.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' blob: https: http: https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev",
              "connect-src 'self' https: http: ws: wss: https://www.facebook.com https://connect.facebook.net https://www.google-analytics.com",
              "frame-src 'self' https://www.facebook.com https://connect.facebook.net",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Headers específicos para vídeos
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes'
          },
          {
            key: 'Content-Type',
            value: 'video/webm'
          }
        ]
      },
      // Headers para arquivos estáticos do Next.js
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/api/:path*`,
      },
    ];
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Configurações experimentais para melhor performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },

  // Configurações do webpack para otimização
  webpack: (config, { isServer }) => {
    // Otimizações para produção
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Corrigir problema "self is not defined" no SSR
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Definir variáveis globais para compatibilidade
    config.plugins = config.plugins || [];
    config.plugins.push(
      new config.webpack.DefinePlugin({
        'typeof window': JSON.stringify('object'),
        'typeof self': JSON.stringify('undefined'),
      })
    );

    // Configurações para melhor compressão
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig; 