import z from 'zod'
import type { IAICreateChatResponseDto } from '../modules/ai-chat/models/types'

export default defineEventHandler(async (evt): Promise<IAICreateChatResponseDto> => {
    const body = await readValidatedBody(evt, z.object({ message: z.string() }).safeParse)
    if (!body.error) {
        return await evt.context.aiChat.createChat(body.data.message)
    }
    throw createError({
        statusCode: 400,
        statusMessage: body.error.message
    })
})
