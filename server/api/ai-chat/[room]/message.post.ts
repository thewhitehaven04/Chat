import z from 'zod'

export default defineEventHandler(async (evt) => {
    const chatId = getRouterParam(evt, 'room')

    const { data, error } = await readValidatedBody(
        evt,
        z.object({ message: z.string() }).safeParse
    )
    if (!error) {
        await evt.context.aiChat.setExistingChat(Number(chatId))
        return (await evt.context.aiChat.sendMessage(data?.message)) as ReadableStream<string>
    }
    createError({
        statusCode: 400,
        statusMessage: error.message
    })
})
