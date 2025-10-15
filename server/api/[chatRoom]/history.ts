import type { IChatHistoryResponse } from '~~/server/modules/chat/models/types'

export default defineEventHandler(async (event): Promise<IChatHistoryResponse> => {
    const chatRoom = getRouterParam(event, 'chatRoom')
    const query = getQuery(event)
    return await event.context.chat.getChatHistory({
        chatRoom: Number(chatRoom),
        limit: Number(query.limit),
        skip: 0
    })
})
