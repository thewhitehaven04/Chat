// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/ui', '@nuxt/eslint'],
    vite: {
        plugins: [tailwindcss()]
    },
    css: ['./app/assets/css/main.css'],
    typescript: {
        typeCheck: true
    },
    nitro: {
        experimental: {
            websocket: true
        }
    }
})
