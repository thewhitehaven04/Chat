import { AuthService } from '../modules/auth/service'
import { ChatService } from '../modules/chat/service'
import { ProfileService } from '~~/server/modules/profile/service'
import { AiChatService } from '../modules/ai-chat/service'
import { GeminiChatAdapter } from '../modules/chat-adapter/gemini-chat'
import { ChatMessageRepository } from '../modules/chat/repository'
import { ChatRoomRepository } from '../modules/chat-rooms/repository'
import { AIChatMessageRepository } from '../modules/ai-chat/messageRepository'
import { AIChatRoomsRepository } from '../modules/ai-chat/roomRepository'
import { ChatRoomsService } from '../modules/chat-rooms/service'
import { AiChatRoomsService } from '../modules/ai-chat-rooms/service'
import { AIChatRoomsRepository as AiChatRoomsRepository } from '../modules/ai-chat-rooms/repository'
import { getServerClient } from '../modules/supabase-adapter/getServerClient'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const serverClient = getServerClient(config, event)

    const auth = new AuthService(serverClient)
    const profile = new ProfileService(serverClient, auth)
    const chatMessageRepository = new ChatMessageRepository(serverClient)
    const chatRoomRepository = new ChatRoomRepository(serverClient)
    const adapter = new GeminiChatAdapter()
    const aiChatRepository = new AIChatMessageRepository(serverClient)
    const aiChatRoomRepository = new AIChatRoomsRepository(serverClient)

    event.context.auth = auth
    event.context.profile = profile
    event.context.chat = new ChatService(
        serverClient,
        profile,
        chatMessageRepository,
        chatRoomRepository
    )
    event.context.chatRooms = new ChatRoomsService(chatRoomRepository)
    event.context.aiChat = new AiChatService(adapter, aiChatRoomRepository, aiChatRepository)
    event.context.aiChatRooms = new AiChatRoomsService(new AiChatRoomsRepository(serverClient))
})
