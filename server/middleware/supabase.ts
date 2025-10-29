import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { AuthService } from '../modules/auth/service'
import { ChatService } from '../modules/chat/service'
import { ProfileService } from '~~/server/modules/profile/service'
import { AiChatService } from '../modules/ai-chat/service'
import { GeminiChatAdapter } from '../modules/chat-adapter/gemini-chat'
import { ChatMessageRepository } from '../modules/chat/repository'
import { ChatRoomRepository } from '../modules/chat-rooms/repository'
import { AIChatMessageRepository } from '../modules/ai-chat/repository'
import { AIChatRoomsRepository } from '../modules/ai-chat-rooms/repository'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const serverClient = createServerClient(
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

    const auth = new AuthService(serverClient)
    event.context.auth = auth
    const profile = new ProfileService(serverClient, auth)
    event.context.profile = profile

    const chatMessageRepository = new ChatMessageRepository(serverClient)
    const chatRoomRepository = new ChatRoomRepository(serverClient)
    event.context.chat = new ChatService(
        serverClient,
        auth,
        profile,
        chatMessageRepository,
        chatRoomRepository
    )

    const adapter = new GeminiChatAdapter()
    const aiChatRepository = new AIChatMessageRepository(serverClient)
    const aiChatRoomRepository = new AIChatRoomsRepository(serverClient)
    event.context.aiChat = new AiChatService(adapter, aiChatRoomRepository, aiChatRepository)
})
