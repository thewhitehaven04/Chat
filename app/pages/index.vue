<script lang="ts" setup>
definePageMeta({
    middleware: () => {
        return navigateTo({ path: '/sign-in' })
    }
})
</script>
