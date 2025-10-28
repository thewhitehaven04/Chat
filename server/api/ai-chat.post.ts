import z from 'zod'
export default defineEventHandler(async (evt) => {
    const { data, error } = await readValidatedBody(
        evt,
        z.object({ message: z.string() }).safeParse
    )
    if (!error) {
        return sendStream(evt, evt.context.aiChat.sendMessage(data?.message) as ReadableStream<string>)
    }
    createError({
        statusCode: 400,
        statusMessage: error.message
    })
})
