export default defineEventHandler((event) => {
    const chatRoom = getRouterParam(event, 'room')
    return event.context.aiChat.getChatHistory(Number(chatRoom))
})
