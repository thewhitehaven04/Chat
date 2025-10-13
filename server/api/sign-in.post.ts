import { AuthService } from '../modules/auth/service'
import type { ISignInInputDto } from '../modules/auth/types'

export default defineEventHandler(async (evt) => {
    const client = evt.context.supabase.client
    const authService = new AuthService(client)

    const { email, password } = await readBody<ISignInInputDto>(evt)

    try {
        const { error } = await authService.signIn({ email, password })

        if (error) {
            throw createError({ statusMessage: error.message })
        }

        return sendRedirect(evt, '/chat')
    } catch (error: unknown) {
        throw createError({ statusMessage: (error as Error).message })
    }
})
