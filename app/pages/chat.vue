<script setup lang="ts">
import type { TChatMessage } from '~~/server/api/types'

definePageMeta({
    layout: 'authorized'
})

const isPending = ref(true)
const isDisconnected = ref(false)

const messages = ref<string[]>([])

const message = defineModel<string>('message', {
    default: ''
})

const connection = new WebSocket(`ws://${location.host}/api/chat`)
connection.addEventListener('open', () => {
    isPending.value = false
})

connection.addEventListener('message', ({ data }: MessageEvent<TChatMessage>) => {
    if (data.success) {
        messages.value.push(data.data)
    }
})

connection.addEventListener('close', () => {
    isDisconnected.value = true
})

const handleSubmit = () => {
    connection.send(message.value)
    message.value = ''
}

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleSubmit()
    }
}
</script>

<template>
    <UContainer class="flex flex-col h-full">
        <div class="flex flex-1 w-full">
            <div v-if="isPending" class="flex items-center justify-center h-full">Loading...</div>
            <div v-else class="flex flex-col items-center justify-center flex-1 gap-4">
                <div v-if="messages.length > 0">
                    <span v-for="value in messages" :key="value" class="text-lg">
                        {{ value }}
                    </span>
                </div>
                <span v-else> It's too empty in here... </span>
            </div>
            <div
                v-if="isDisconnected"
                class="flex flex-col text-white bg-red-300 font-bold text-lg"
            >
                You've been disconnected
            </div>
        </div>
        <UForm @submit="handleSubmit">
            <div class="flex flex-col items-center w-full gap-2">
                <UTextarea
                    v-model="message"
                    name="message"
                    class="w-full"
                    placeholder="What do you think?"
                    :rows="4"
                    autoresize
                    @keyup="handleKeyUp"
                />
                <UButton type="submit">Send</UButton>
            </div>
        </UForm>
    </UContainer>
</template>
