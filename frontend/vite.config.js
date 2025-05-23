import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },

  esbuild: {
    pure: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production' ? ['console.log'] : [],
  },

  // server: {
  //   hmr: false
  // }

  // build: {
  //   rollupOptions: {
  //     output: {
  //       assetFileNames: 'assets/[name]-[hash][extname]',
  //       entryFileNames: 'assets/[name]-[hash].js',
  //       chunkFileNames: 'assets/[name]-[hash].js'
  //     }
  //   }
  // },
  // assetsInclude: ['**/*.png', '**/*.jpg'] // Explicitly include file types
})
