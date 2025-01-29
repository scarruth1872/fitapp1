import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: [
        '@mui/material',
        '@mui/icons-material',
        '@mui/lab',
        'react-confetti',
        'recharts',
        'framer-motion'
      ]
    },
    esbuild: {
      loader: 'jsx',
      include: /\.[jt]sx?$/,
      exclude: [],
    },
    server: {
      port: 5173,
      strictPort: false,
      open: true,
      proxy: {
        // Proxy Firebase Auth requests
        '/identitytoolkit.googleapis.com': {
          target: 'https://identitytoolkit.googleapis.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/identitytoolkit.googleapis.com/, '')
        },
        // Proxy Firestore requests
        '/firestore.googleapis.com': {
          target: 'https://firestore.googleapis.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/firestore.googleapis.com/, '')
        }
      }
    },
    define: {
      // Expose env variables to the client
      'process.env': env
    }
  };
});
