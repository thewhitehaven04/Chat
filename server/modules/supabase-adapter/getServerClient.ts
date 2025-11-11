import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import type { useRuntimeConfig } from 'nuxt/app'

export function getServerClient(
    config: ReturnType<typeof useRuntimeConfig>,
    event: { headers: Headers }
) {
    return createServerClient(
        config.public.supabaseUrl as string,
        config.public.supabasePublishableKey as string,
        {
            cookies: {
                getAll: async () => {
                    const cookie = event.headers.get('Cookie')
                    return cookie
                        ? (parseCookieHeader(cookie) as { name: string; value: string }[])
                        : []
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        event.headers.append(
                            'Set-Cookie',
                            serializeCookieHeader(name, value, options)
                        )
                    )
                }
            }
        }
    )
}
