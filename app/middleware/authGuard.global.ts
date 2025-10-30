export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await $fetch('/api/user')
    if (!user.email || !user.id) {
        if (to.path !== '/sign-in' && to.path !== '/sign-up') {
            return navigateTo('/sign-in')
        }
    } else {
        if (to.path === '/sign-in' || to.path === '/sign-up') {
            return navigateTo('/')
        }
    }
})
