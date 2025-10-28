import z from 'zod'

export default defineEventHandler(async (evt) => {
    const { data, error } = await readValidatedBody(
        evt,
        z.object({ message: z.string() }).safeParse
    )
    if (!error) {
        return sendIterable(evt, evt.context.aiChat.sendMessage(data?.message)) 
    }
    createError({
        statusCode: 400,
        statusMessage: error.message
    })
})
