import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // the Parse SDK is one large chunk
  build: { chunkSizeWarningLimit: 1500 },
})
