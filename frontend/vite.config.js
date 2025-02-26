import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api': {
      //   target: 'http://localhost:3001',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/)
      // },
      '/memory': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/memory/, '')
      }
    }
  },
  define: {
    'process.env': {
      VITE_LINEA_TESTNET_RPC: JSON.stringify('https://rpc.goerli.linea.build')
    }
  }
})
