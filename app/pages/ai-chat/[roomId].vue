<script setup lang="ts">
definePageMeta({
    layout: 'authorized'
})
</script>

<template>
    <AiChatScreen :room-id="$route.params.roomId as string" />
</template>
