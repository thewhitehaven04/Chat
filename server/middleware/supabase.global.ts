import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { AuthService } from '../modules/auth/service'
import { ChatService } from '../modules/chat/service'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const serverClient = createServerClient(
        config.public.supabaseUrl,
        config.public.supabasePublishableKey,
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

    const auth = new AuthService(serverClient)
    event.context.auth = auth
    event.context.chat = new ChatService(serverClient, auth)
})
