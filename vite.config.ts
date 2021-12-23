import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "^/.+\.(?:jpe?g|png)": {
        target: "http://localhost:4001",
        changeOrigin: true,
      }
    },
  },
})
