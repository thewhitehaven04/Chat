import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { ChatService } from '../modules/chat/service'
import { AuthService } from '../modules/auth/service'
import type { IMessageInputDto } from '~~/server/modules/chat/models/types'
import { ProfileService } from '~~/server/modules/profile/service'
import type { IChatService } from '../modules/chat/types'
import { ChatMessageRepository } from '../modules/chat/repository'
import { ChatRoomRepository } from '../modules/chat-rooms/repository'

function defineChatHandler() {
    const chatServiceMap = new Map<string, IChatService>()

    return defineWebSocketHandler({
        async open(peer) {
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

            const auth = new AuthService(serverClient)
            const chat = new ChatService(
                serverClient,
                new ProfileService(serverClient, auth),
                new ChatMessageRepository(serverClient),
                new ChatRoomRepository(serverClient)
            )

            chatServiceMap.set(peer.id, chat)

            chat.subscribe((_, newMessage) => {
                peer.send(JSON.stringify(newMessage))
            })
        },

        async message(peer, message) {
            const messageDto = message.json<IMessageInputDto>()
            try {
                await chatServiceMap.get(peer.id)?.sendMessage(messageDto)
            } catch (_error) {
                peer.send({ success: false, data: null, error: 'Something went wrong' })
            }
        },

        close(peer) {
            chatServiceMap.get(peer.id)?.unsubscribe()
        }
    })
}

export default defineChatHandler()
