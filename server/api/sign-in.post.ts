import type { ISignInInputDto } from '../../shared/modules/auth/models/types'

export default defineEventHandler(async (evt) => {
    const { email, password } = await readBody<ISignInInputDto>(evt)

    const response = await evt.context.auth.signIn({ email, password })

    if (!response.success) {
        throw createError({ statusCode: 401, statusMessage: response.message })
    }

    return response
})
