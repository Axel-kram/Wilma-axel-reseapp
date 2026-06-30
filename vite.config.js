import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VIKTIGT: byt ut '/Wilma-axel-reseapp/' nedan om ditt repo heter något annat.
// Det måste matcha exakt ditt GitHub-repos namn, med snedstreck före och efter.
export default defineConfig({
  plugins: [react()],
  base: '/Wilma-axel-reseapp/',
})
