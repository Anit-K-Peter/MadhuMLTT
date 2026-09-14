import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { madhuMLTTVite } from '@madhu-mltt/vite';

export default defineConfig({
  plugins: [
    react(),
    madhuMLTTVite({
      fontFamily: 'ML-TTKarthika',
      accessible: true
    })
  ]
});
