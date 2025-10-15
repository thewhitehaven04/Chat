<script setup>
const { data } = useFetch('/api/user') 

watch(data, () => {
    if (data.value?.email && data.value?.id) {
        navigateTo('/')
    }
})
</script>


<template>
    <SignUpScreen />
</template>
