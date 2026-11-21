import type { NextConfig } from 'next';
const config: NextConfig = { devIndicators: false, distDir: process.env.SKILLBRIDGE_NEXT_DIR || '.next', turbopack: { root: process.cwd() } };
export default config;
