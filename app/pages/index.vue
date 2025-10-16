<script setup lang="ts">
const { data: user } = useFetch('/api/user')

watch(user, () => {
    if (!user.value?.email || !user.value?.id) {
        navigateTo('/sign-in')
    }
})
</script>

<template>
    <UContainer class="w-full h-screen flex flex-col items-center justify-center">
        <div>Select a chat room to join</div>
    </UContainer>
</template>
