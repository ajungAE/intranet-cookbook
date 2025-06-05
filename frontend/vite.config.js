import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'ajubuntu',
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../backend/ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../backend/ssl/cert.pem')),
    },
    allowedHosts: ['ajubuntu']
  }
});
