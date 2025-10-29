import type { IChatDto } from '~~/server/modules/chat-rooms/models/types'

export default defineEventHandler(async (event): Promise<IChatDto[]> => {
    return await event.context.chatRooms.getChatRooms()
})
