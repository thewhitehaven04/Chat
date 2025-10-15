<script setup>
const { data } = useFetch('/api/user') 

onBeforeMount(() => {
    if (data.value?.email && data.value?.id) {
        navigateTo('/chat')
    }
})
</script>


<template>
    <SignUpScreen />
</template>
