import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base './' keeps asset paths relative so GitHub Pages sub-paths work too.
export default defineConfig({ plugins: [react()], base: './' });
