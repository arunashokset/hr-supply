// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// https://vite.dev/config/

// export default defineConfig({
//   plugins: [react()],
//   css: {
//     preprocessorOptions: {
//       scss: {
//         additionalData: `@import "./src/assets/sass/variables.scss";`
//       }
//     }
//   }
// })

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});