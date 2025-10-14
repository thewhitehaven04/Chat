export default defineEventHandler(async (event) => {
    return await event.context.auth.getUser()
})
