/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/admin/:path*',
                destination: '/admin/:path*',
            },
        ];
    },
};

export default nextConfig;
