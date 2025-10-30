<script setup lang="ts">
import type { IChatMessageProps } from '~/modules/ai-chat/features/types'
const route = useRoute()

const { data: chatMessages, refresh } = useFetch(`/api/ai-chat/${route.params.roomId}/history`)
const messages = ref<(IChatMessageProps & { id: string })[]>([])
const pendingModelResponse = ref<IChatMessageProps | null>(null)
const lastUserRequest = ref<IChatMessageProps | null>(null)

const isWaitingForResponse = ref(false)
watch(
    () => chatMessages.value,
    (chatMessages) => {
        if (chatMessages) {
            messages.value = chatMessages?.data.map((message) => ({
                message: message.message,
                type: message.submitter,
                id: message.id,
                date: new Date(message.date)
            }))
        }
    }
)

const handleSubmit = async (message: string) => {
    isWaitingForResponse.value = true
    lastUserRequest.value = {
        date: new Date(),
        message: message,
        type: 'user'
    }
    const response = await $fetch(`/api/ai-chat/${route.params.roomId}/message`, {
        method: 'POST',
        responseType: 'stream',
        body: {
            message
        }
    })

    for await (const chunk of response) {
        if (!pendingModelResponse.value) {
            pendingModelResponse.value = {
                date: new Date(),
                message: '',
                type: 'model'
            }
        } else {
            pendingModelResponse.value.message = pendingModelResponse.value.message + chunk
        }
    }
    requestAnimationFrame(async () => {
        await refresh()
        lastUserRequest.value = null
        pendingModelResponse.value = null
    })
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UContainer class="flex-1 flex flex-col items-stretch w-full gap-4">
            <AiChatFeaturesChatMessage
                v-for="message in messages"
                :key="message.id"
                :date="message.date"
                :type="message.type"
                :message="message.message"
            />
        </UContainer>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="false"
            @message-submitted="handleSubmit($event)"
        />
    </UContainer>
</template>
