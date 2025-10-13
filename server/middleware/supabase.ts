import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { AuthService } from '../modules/auth/service'
import { ChatService } from '../modules/chat/service'

export default defineEventHandler((event) => {
    const serverClient = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll: async () => {
                    const cookie = event.headers.get('cookie')
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

    event.context.auth = new AuthService(serverClient)
    event.context.chat = new ChatService(serverClient)
})
