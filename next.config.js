/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'file.zyking.xyz',
            port: '',
            pathname: '/api/**',
          },
        ],
      },
}

module.exports = nextConfig
