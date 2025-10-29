import type { IAIChatRoomDto } from '~~/server/modules/ai-chat-rooms/models/types'

export default defineEventHandler(async (event): Promise<IAIChatRoomDto[]> => {
    return await event.context.aiChatRooms.getChatRooms()
})
