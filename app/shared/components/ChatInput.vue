<script setup lang="ts">
const emit = defineEmits<{
    'key-enter-pressed': []
}>()

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        emit('key-enter-pressed') 
    }
}
</script>

<template>
    <UTextarea
        class="w-full"
        placeholder="What do you think?"
        :rows="4"
        autoresize
        @keyup="handleKeyUp($event)"
    />
</template>
