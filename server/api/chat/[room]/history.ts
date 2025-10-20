import type { IChatHistoryResponse } from '~~/server/modules/chat/models/types'

export default defineEventHandler<{ query: { limit: number; skip: number } }>(
    async (event): Promise<IChatHistoryResponse> => {
        const chatRoom = getRouterParam(event, 'room')
        const query = getQuery(event)
        return await event.context.chat.getChatHistory({
            chatRoom: Number(chatRoom),
            limit: Number(query.limit),
            skip: Number(query.skip)
        })
    }
)
