<script setup lang="ts">
definePageMeta({
    layout: 'authorized'
})
</script>

<template>
    <ChatScreen :room-id="$route.params.roomId as string" />
</template>
