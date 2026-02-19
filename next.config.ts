import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Fix hot reload in git worktree setups where the working directory
    // is a symlink. Webpack's default watcher misses file changes in
    // symlinked trees, so we enable symlink following and fall back to
    // polling with a reasonable interval.
    config.watchOptions = {
      ...config.watchOptions,
      followSymlinks: true,
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
