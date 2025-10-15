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
    },
    routeRules: {
        '/chat': {
            ssr: false
        },
        '/sign-in': {
            ssr: false
        },
        '/sign-up': {
            ssr: false
        }
    },
    components: [
        {
            path: '~/modules'
        }
    ],
    runtimeConfig: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabasePublishableKey: process.env.SUPABASE_KEY,
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
            supabasePublishableKey: process.env.NUXT_PUBLIC_PUBLISHABLE_KEY
        }
    }
})
