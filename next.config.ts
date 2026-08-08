import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  output: "standalone",
  generateBuildId: async () => {
    return process.env.GIT_HASH || `build-${Date.now()}`
  },
};

export default nextConfig;
