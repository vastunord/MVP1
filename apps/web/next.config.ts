import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  transpilePackages: ["@vastunord/contracts"],
  poweredByHeader: false,
};
export default config;
