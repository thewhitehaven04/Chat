import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { ChatService } from '../modules/chat/service'
import { AuthService } from '../modules/auth/service'

function defineChatHandler() {
    let chat: ChatService
    return defineWebSocketHandler({
        open(peer) {
            const request = peer.request

            const serverClient = createServerClient(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_PUBLISHABLE_KEY!,
                {
                    cookies: {
                        async getAll() {
                            const cookie = request.headers.get('cookie')
                            if (cookie) {
                                return parseCookieHeader(cookie) as {
                                    name: string
                                    value: string
                                }[]
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
                    errors: null
                })
            })
        },

        async message(peer, message) {
            try {
                await chat.sendMessage(message.text())
            } catch (error) {
                console.error('Something went wrong: ', error)
                peer.send({ success: false, error: 'Something went wrong' })
            }
        },

        close() {
            chat.unsubscribe()
        }
    })
}

export default defineChatHandler()
