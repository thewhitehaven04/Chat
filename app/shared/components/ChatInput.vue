<script setup lang="ts">
const emit = defineEmits<{
    'key-enter-pressed': []
}>()

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        emit('key-enter-pressed')
        event.preventDefault()
    }
}

const model = defineModel<string>({
    required: true
})
</script>

<template>
    <UTextarea
        v-model="model"
        class="w-full"
        placeholder="What do you think?"
        :rows="4"
        autoresize
        @keyup="handleKeyUp($event)"
    />
</template>
