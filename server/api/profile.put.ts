import {
    profileUpdateValidation,
    type TProfileUpdateDto
} from '~~/shared/modules/profile/models/validation'

export default defineEventHandler(async (event): Promise<TProfileUpdateDto> => {
    const { data, error } = await readValidatedBody(event, profileUpdateValidation.safeParse)
    if (error) {
        return createError({ statusCode: 400, statusMessage: error.message })
    }
    return await event.context.profile.updateProfile(data)
})
