import type { IAiChatService } from '~~/server/modules/ai-chat/types'

export default defineEventHandler((event): ReturnType<IAiChatService['getChatHistory']> => {
    const chatRoom = getRouterParam(event, 'room')
    return event.context.aiChat.getChatHistory(Number(chatRoom))
})
