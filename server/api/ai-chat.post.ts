export default defineEventHandler(async (evt): Promise<{ chatId: number }> => {
    return await evt.context.aiChat.createChat()
})
