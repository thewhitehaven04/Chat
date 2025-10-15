<script setup lang="ts">
import type { IChatMessage } from '~~/server/modules/chat/models/types'

const isDisconnected = ref(false)

const params = useRoute().params
const messages = ref<IChatMessage[]>([])

const { pending } = useFetch(`/api/${params.chatId}/history`, {
    onResponse({ response }) {
        if (response._data) {
            messages.value = response._data?.messages
        }
    }
})

const isTextareaDisabled = ref(false)

const message = defineModel<string>('message', {
    default: ''
})

const connection = new WebSocket(`ws://${location.host}/api/chat`)
connection.addEventListener('open', () => {
    isTextareaDisabled.value = false
})

connection.addEventListener('message', ({ data }: MessageEvent<IChatMessage>) => {
    messages.value.push(data)
})

connection.addEventListener('close', () => {
    isTextareaDisabled.value = true
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
    <UContainer>
        <div class="flex flex-1 w-full">
            <USkeleton v-if="pending" class="h-12 w-12 rounded-full" />
            <div v-else class="flex flex-col items-center justify-center flex-1 gap-4">
                <div v-if="messages.length > 0">
                    <ChatMessage
                        v-for="m in messages"
                        :key="m.id"
                        :text="m.text"
                        :submitted-at="m.submitted_at"
                        :submitted-by="m.submitted_by"
                    />
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
