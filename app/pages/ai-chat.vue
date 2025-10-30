<script setup lang="ts">

import markdownIt from 'markdown-it'

const { data: aiChatRooms = [] } = useFetch('/api/ai-chat/rooms')

const isAnswerPending = ref(false)

const handleSubmit = async (message: string) => {
    isAnswerPending.value = true
    await $fetch('/api/ai-chat', {
        method: 'POST',
        body: {  },
        responseType: 'stream',
        onResponse: async ({ response }) => {
            if (response.body) {
                const stream = response.body.pipeThrough(new TextDecoderStream())
                for await (const chunk of stream) {
                    isAnswerPending.value = false
                    bottomMessage.value += chunk
                }
            }
        }
    })
}
</script>
<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UContainer class="flex-1">
            <UButton
v-for="chatRoom in aiChatRooms"

        </UContainer>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="false"
            @message-submitted="handleSubmit($event)"
        />
    </ubutton></UContainer>
</ucontainer></template>

<style lang="css" scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
