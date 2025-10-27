export default defineEventHandler(async (event) => {
    const formData = await readFormData(event)
    await event.context.profile.updateProfile(Object.fromEntries(formData.entries()))
    return { success: true }
})
