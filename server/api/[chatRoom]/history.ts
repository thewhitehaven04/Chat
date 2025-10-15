export default defineEventHandler(async (event) => {
    const chatRoom = getRouterParam(event, 'chatRoom')
    return await event.context.chat.getChatHistory(chatRoom)
})
