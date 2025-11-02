<script setup lang="ts">
import type { IChatMessageProps } from '~/modules/ai-chat/features/types'
const route = useRoute()

const { data: chatMessages, refresh } = useFetch(`/api/ai-chat/${route.params.roomId}/history`)
const messages = ref<(IChatMessageProps & { id: string })[]>([])
const pendingModelResponse = ref<IChatMessageProps | null>(null)
const lastUserRequest = ref<IChatMessageProps | null>(null)

const isWaitingForResponse = ref(false)

watch(chatMessages, (chatMessages) => {
    if (chatMessages) {
        messages.value = chatMessages?.data.map((message) => ({
            message: message.message,
            type: message.submitter,
            id: message.id,
            date: new Date(message.date)
        }))
    }
})

// initial scroll
watch(
    chatMessages,
    () => {
        scrollToBottom()
    },
    {
        once: true
    }
)

const scrollToBottom = () => {
    requestAnimationFrame(() => {
        if (scrollTarget.value) {
            scrollTarget.value.scroll({
                behavior: 'instant',
                top: scrollTarget.value.scrollHeight
            })
        }
    })
}

const handleSubmit = async (message: string) => {
    isWaitingForResponse.value = true

    lastUserRequest.value = {
        date: new Date(),
        message: message,
        type: 'user'
    }
    scrollToBottom()

    const reader = (
        await $fetch<ReadableStream<Uint8Array>>(`/api/ai-chat/${route.params.roomId}/message`, {
            method: 'POST',
            responseType: 'stream',
            body: { message }
        })
    ).getReader()
    const decoder = new TextDecoder('utf-8')

    pendingModelResponse.value = {
        date: new Date(),
        message: '',
        type: 'model'
    }
    let nextChunk = await reader.read()
    scrollToBottom()
    while (!nextChunk.done) {
        pendingModelResponse.value.message += decoder.decode(nextChunk.value)
        nextChunk = await reader.read()
    }

    requestAnimationFrame(async () => {
        await refresh()
        lastUserRequest.value = null
        pendingModelResponse.value = null
    })
}
const scrollTarget = useTemplateRef('scrollingContainer')
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <div
            ref="scrollingContainer"
            class="flex-1 flex flex-col items-stretch w-full gap-4 overflow-y-scroll"
        >
            <AiChatFeaturesChatMessage
                v-for="message in messages"
                :key="message.id"
                :date="message.date"
                :type="message.type"
                :message="message.message"
            />
            <AiChatFeaturesChatMessage
                v-if="!!lastUserRequest"
                :date="lastUserRequest.date"
                :type="lastUserRequest.type"
                :message="lastUserRequest.message"
            />
            <AiChatFeaturesChatMessage
                v-if="!!pendingModelResponse"
                :date="pendingModelResponse.date"
                :type="pendingModelResponse.type"
                :message="pendingModelResponse.message"
            />
        </div>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="false"
            @message-submitted="handleSubmit($event)"
        />
    </UContainer>
</template>
