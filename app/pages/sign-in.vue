<script setup>
const { data } = useFetch('/api/user') 

onBeforeMount(() => {
    if (data.value?.email && data.value?.id) {
        navigateTo('/')
    }
})
</script>

<template>
    <SignInScreen />
</template>
