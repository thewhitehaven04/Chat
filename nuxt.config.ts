// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],
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
    ssr: false,
    components: [
        {
            path: '~/modules'
        }
    ],
    runtimeConfig: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabasePublishableKey: process.env.SUPABASE_KEY,
        aiApiKey: process.env.AI_API_KEY,
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
            supabasePublishableKey: process.env.NUXT_PUBLIC_PUBLISHABLE_KEY
        }
    },
    app: {
        head: {
            title: 'Multichat',
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
        }
    },
    ui: {
        theme: {
            defaultVariants: {
                color: 'zinc'
            }
        }
    }
})
