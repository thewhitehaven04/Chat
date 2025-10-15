import type { IChatDto } from '~~/server/modules/chats/models/types'

export default defineEventHandler(async (event): Promise<IChatDto[]> => {
    return await event.context.chatRooms.getChatRooms()
})
