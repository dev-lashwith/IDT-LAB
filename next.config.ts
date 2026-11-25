import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Turbopack's Windows build currently needs junction privileges in this workspace.
  // Webpack keeps the production build portable without changing runtime behavior.
  distDir: "build",
};

export default nextConfig;
