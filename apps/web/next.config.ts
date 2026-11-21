import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@vastunord/contracts"],
  poweredByHeader: false,
};
export default config;
