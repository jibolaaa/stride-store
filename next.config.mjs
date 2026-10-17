/** @type {import('next').NextConfig} */
const nextConfig = {
  // The back office talks to Postgres with node-postgres; keep it out of the bundle.
  experimental: { serverComponentsExternalPackages: ["pg"] }
};
export default nextConfig;
