<script setup>
const { data } = useFetch('/api/user')
</script>

<template>
    <UHeader>
        <span>
            {{ data.email }}
        </span>
    </UHeader>
</template>
