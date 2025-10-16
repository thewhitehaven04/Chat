import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { ChatService } from '../modules/chat/service'
import { AuthService } from '../modules/auth/service'
import type { IMessageInputDto } from '~~/server/modules/chat/models/types'

function defineChatHandler() {
    let chat: ChatService

    return defineWebSocketHandler({
        open(peer) {
            const request = peer.request
            const config = useRuntimeConfig()

            const serverClient = createServerClient(
                config.public.supabaseUrl as string,
                config.public.supabasePublishableKey as string,
                {
                    cookies: {
                        async getAll() {
                            const cookie = request.headers.get('Cookie')
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

            chat.subscribe((_, newMessage) => {
                peer.send(JSON.stringify(newMessage))
            })
        },

        async message(peer, message) {
            const messageDto = message.json<IMessageInputDto>()
            try {
                await chat.sendMessage(messageDto)
            } catch (_error) {
                peer.send({ success: false, data: null, error: 'Something went wrong' })
            }
        },

        close() {
            chat.unsubscribe()
        }
    })
}

export default defineChatHandler()
