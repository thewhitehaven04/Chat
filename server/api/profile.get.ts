import type { IProfileReadDto } from '~~/server/modules/profile/models/types'

export default defineEventHandler(async (event): Promise<IProfileReadDto> => {
    return await event.context.profile.getCurrentProfile()
})
