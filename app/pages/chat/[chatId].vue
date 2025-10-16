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

const connection = new WebSocket(`ws://${location.host}/api/chat`)
connection.addEventListener('open', () => {
    isTextareaDisabled.value = false
})

const chatRef = useTemplateRef('chat')

connection.addEventListener('message', ({ data }: MessageEvent<IChatMessage>) => {
    messages.value.push(data)
    chatRef.value?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
        inline: 'nearest'
    })
})

connection.addEventListener('close', () => {
    isTextareaDisabled.value = true
})

const handleMessageSubmit = (message: string) => {
    connection.send(
        JSON.stringify({
            chatRoom: Number(params.chatId),
            text: message
        })
    )
}

const showLoadingState = computed(() => pending.value)
const showNoMessages = computed(() => messages.value.length === 0 && !pending.value)
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <div ref="chat" class="flex-1 overflow-y-scroll">
            <USkeleton v-if="showLoadingState" class="h-12 w-12 rounded-full" />
            <ul v-else>
                <li class="flex flex-col items-start justify-center flex-1 gap-8">
                    <ChatMessage
                        v-for="m in messages"
                        :key="m.id"
                        :text="m.text"
                        :submitted-at="m.submitted_at"
                        :submitted-by="m.submitted_by"
                    />
                </li>
            </ul>
            <span v-if="showNoMessages"> It's too empty in here... </span>
        </div>
        <div v-if="isDisconnected" class="flex flex-col text-white bg-red-300 font-bold text-lg">
            You've been disconnected
        </div>
        <ChatMessageSubmissionForm @message-submitted="handleMessageSubmit($event)" />
    </UContainer>
</template>
