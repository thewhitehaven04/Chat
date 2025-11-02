import type { IAiChatService } from '~~/server/modules/ai-chat/types'

export default defineEventHandler<
    {
        query: {
            skip: string
            count: string
        }
    },
    ReturnType<IAiChatService['getChatHistory']>
>((event) => {
    const chatRoom = getRouterParam(event, 'room')
    const query = getQuery(event)
    return event.context.aiChat.getChatHistory(
        Number(chatRoom),
        Number(query.skip),
        Number(query.count)
    )
})
