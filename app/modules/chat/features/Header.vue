<script setup lang="ts">
import { inject } from 'vue'
import type { TChat } from '~/modules/chat/composables/useChat'

const chat = inject('chat') as TChat
</script>

<template>
    <UHeader>
        <template #left>
            <div class="flex flex-col gap-2 mb-4">
                <h1 v-if="!chat.isChatHistoryLoading" class="text-xl font-bold">
                    {{ chat.chatHistory?.value?.chat.name }}
                </h1>
                <p class="text-neutral-700">{{ chat.chatHistory?.value?.chat.description }}</p>
            </div>
        </template>
        <template #right>
            <ULink as="button" href="/" icon="i-lucide-x" />
        </template>
    </UHeader>
</template>
