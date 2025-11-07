<script setup lang="ts">
import type { TChat } from '~/modules/chat/composables/useChat'

const chat = inject<TChat>('chat')
const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        chat?.sendMessage()
    }
}

</script>

<template>
    <UTextarea
        v-if="!!chat"
        v-model="chat.inputMessage.value"
        class="w-full"
        placeholder="What do you think?"
        :rows="4"
        autoresize
        @keyup="handleKeyUp($event)"
    />
</template>
