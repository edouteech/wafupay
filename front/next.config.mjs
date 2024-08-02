/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
      domains: ['localhost', 'api.wafupay.com'],
    },
};

export default nextConfig;
