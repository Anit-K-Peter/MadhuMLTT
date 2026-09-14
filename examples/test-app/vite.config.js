import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { madhuMLTTVite } from '../../packages/vite/src/index.js';
import karthikaMapping from './src/mappings/ml-tt-karthika.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    react(),
    madhuMLTTVite({
      fontFamily: 'ML-KV-Naseema',
      mapping: karthikaMapping,
      accessible: true
    })
  ],
  server: {
    port: 3000
  }
});
