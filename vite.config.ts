import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:4001",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      // "^/.+\.(?:jpe?g|png)": {
      //   target: "http://localhost:4001",
      //   changeOrigin: true,
      // }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src"),
    }
  }
})
