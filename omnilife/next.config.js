/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // 实验性功能
  experimental: {
    serverComponentsExternalPackages: [],
  },

  // 自定义目录路径
  distDir: '.next',

  // 图片优化配置
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'source.unsplash.com',
      'cdn.omnilife.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    ANALYTICS_ID: process.env.ANALYTICS_ID,
    API_BASE_URL: process.env.API_BASE_URL || 'https://api.omnilife.com',
  },

  // 启用严格模式
  reactStrictMode: true,

  // 启用SWC压缩
  swcMinify: true,

  // 性能优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // 输出配置 (Vercel部署时注释掉standalone)
  // output: 'standalone',

  // 压缩配置
  compress: true,

  // 性能配置
  poweredByHeader: false,
  generateEtags: true,

  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // ESLint 配置
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    dirs: ['src', 'app'],
  },

  // 静态文件配置
  trailingSlash: false,

  // 页面扩展名
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // 开发服务器配置
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // 生产优化
  productionBrowserSourceMaps: false,
  optimizeFonts: true,

  // PWA 和安全头配置
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // API 代理
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.omnilife.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
