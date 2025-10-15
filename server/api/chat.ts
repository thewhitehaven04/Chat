import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { ChatService } from '../modules/chat/service'
import { AuthService } from '../modules/auth/service'

function defineChatHandler() {
    let chat: ChatService
    return defineWebSocketHandler({
        open(peer) {
            const request = peer.request
            const config = useRuntimeConfig()

            const serverClient = createServerClient(
                config.public.supabaseUrl,
                config.public.supabasePublishableKey,
                {
                    cookies: {
                        async getAll() {
                            const cookie = request.headers.get('Cookie')
                            if (cookie) {
                                const parsedHeader = parseCookieHeader(cookie) as {
                                    name: string
                                    value: string
                                }[]
                                return parsedHeader
                            }
                            return []
                        },
                        setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                request.headers.append(
                                    'Set-Cookie',
                                    serializeCookieHeader(name, value, options)
                                )
                            )
                        }
                    }
                }
            )

            chat = new ChatService(serverClient, new AuthService(serverClient))

            chat.subscribe((oldMessage, newMessage) => {
                peer.send({
                    success: true,
                    data: newMessage,
                    error: null
                })
            })
        },

        async message(peer, message) {
            try {
                await chat.sendMessage(message.text())
            } catch (error) {
                peer.send({ success: false, data: null, error: 'Something went wrong' })
            }
        },

        close() {
            chat.unsubscribe()
        }
    })
}

export default defineChatHandler()
