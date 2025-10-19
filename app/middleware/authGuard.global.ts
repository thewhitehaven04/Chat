export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await $fetch('/api/user')
    if (to.path !== '/sign-in' && to.path !== '/sign-up') {
        if (!user.email || !user.id) {
            return navigateTo('/sign-in')
        }
    } else {
        if (user.email && user.id) {
            return navigateTo('/')
        }
    }
})
