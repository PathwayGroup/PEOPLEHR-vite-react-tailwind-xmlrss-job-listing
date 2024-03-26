import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import postcss from 'postcss'

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
   // postcss(),
  ],
  build: {
    rollupOptions: {
    // output: {
    //    entryFileNames: `assets/[name][hash].[ext]`,
    //    chunkFileNames: `assets/[name][hash].[ext]`,
    //    assetFileNames: `assets/[name][hash].[ext]`
     // },
     // external: [
   //     /^node:.*/
      //]
    }
  }

})
