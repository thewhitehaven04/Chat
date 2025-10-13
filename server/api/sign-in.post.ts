import type { ISignInInputDto } from '../modules/auth/types'

export default defineEventHandler(async (evt) => {
    const { email, password } = await readBody<ISignInInputDto>(evt)

    try {
        const { error } = await evt.context.auth.signIn({ email, password })

        if (error) {
            throw createError({ statusMessage: error.message })
        }

        return { success: true }
    } catch (error: unknown) {
        throw createError({ statusMessage: (error as Error).message })
    }
})
