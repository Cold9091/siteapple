import { build } from 'esbuild';
import { execSync } from 'child_process';

// Build frontend first
console.log('Building frontend...');
execSync('npm run build:frontend', { stdio: 'inherit' });

// Build backend for Vercel
console.log('Building backend for Vercel...');
await build({
  entryPoints: ['server/vercel.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/server.js',
  packages: 'external',
  tsconfig: 'tsconfig.json'
});

console.log('Build completed!');