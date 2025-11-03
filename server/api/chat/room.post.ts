import z from 'zod'

export default defineEventHandler(async (event) => {
    const chatCreateDto = await readValidatedBody(
        event,
        z.object(
            {
                name: z.string(),
                description: z.string()
            },
            { error: 'Bad request' }
        ).safeParse
    )
    if (chatCreateDto.success) {
        return await event.context.chatRooms.createChatRoom(chatCreateDto.data)
    }
    throw createError({
        statusCode: 400,
        statusMessage: chatCreateDto.error.message
    })
})
