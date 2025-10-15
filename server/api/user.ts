import type { IUserDto } from '~~/shared/modules/auth/models/types'

export default defineEventHandler(async (event): Promise<IUserDto> => {
    return await event.context.auth.getUser()
})
