export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path !== '/sign-in' && to.path !== '/sign-up') {
        const user = await $fetch('/api/user')

        if (!user.email || !user.id) {
            return navigateTo('/sign-in')
        }
    }
})
