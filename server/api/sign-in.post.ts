import type { ISignInInputDto } from '../../shared/modules/auth/models/types'

export default defineEventHandler(async (evt) => {
    const { email, password } = await readBody<ISignInInputDto>(evt)

    try {
        const response = await evt.context.auth.signIn({ email, password })

        if (response.error) {
            throw createError({ statusMessage: response.error.message })
        }

        return response
    } catch (error: unknown) {
        throw createError({ statusMessage: (error as Error).message })
    }
})
