import { navigateTo } from 'nuxt/app'
import type { ISignUpInputDto } from '../modules/auth/types'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<ISignUpInputDto>(event)
        if (!body.email || !body.password || !body.confirmPassword) {
            throw new Error('Email, password, and confirm password are required.')
        }
        event.context.auth.signUp(body)
        return sendRedirect(event, '/sign-in')
    } catch (error: unknown) {
        setResponseStatus(event, 400)
        return { success: false, message: (error as Error).message }
    }
})
