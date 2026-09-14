import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { madhuMLTTVite } from '../../packages/vite/src/index.js';
export default defineConfig({
  plugins: [
    react(),
    madhuMLTTVite({
      fontFamily: 'ML-KV-Naseema',
      accessible: true
    })
  ],
  server: {
    port: 3000
  }
});
