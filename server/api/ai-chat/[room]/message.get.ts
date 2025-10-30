export default defineEventHandler((evt) => {
    const query = getQuery(evt)
    const chatId = getRouterParam(evt, 'room')
    if (chatId) {
        evt.context.aiChat.setExistingChat(Number(chatId))
        return evt.context.aiChat.getMessage(query.messageId as string)
    }
})
