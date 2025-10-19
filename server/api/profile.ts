import type { IProfile } from '~~/server/modules/profile/models/types'

export default defineEventHandler(async (event): Promise<IProfile> => {
    return await event.context.profile.getCurrentProfile()
})
