import { createBrowserClient } from '@supabase/ssr'

export const useSupabaseClient = () => {
    const config = useRuntimeConfig()

    return useState(() =>
        createBrowserClient(config.public.supabaseUrl, config.public.supabasePublishableKey)
    ).value
}
