import { createBrowserClient } from '@supabase/ssr'

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.client) {
        const config = useRuntimeConfig()
        const client = createBrowserClient(
            config.public.supabaseUrl,
            config.public.supabasePublishableKey
        )
        const { data } = await client.auth.getUser()
        if (!data.user) {
            if (to.path !== '/sign-in' && to.path !== '/sign-up') {
                return navigateTo('/sign-in')
            }
        } else {
            if (to.path === '/sign-in' || to.path === '/sign-up') {
                console.log('navigate to:', 'root')
                return navigateTo('/')
            }
        }
    }
})
