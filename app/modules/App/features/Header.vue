<script setup lang="ts">
const { data } = useFetch('/api/user')
</script>

<template>
    <UHeader>
        <template #title> Multichat </template>
        <template #right>
            <span>{{ data?.email }}</span>
        </template>
    </UHeader>
</template>
