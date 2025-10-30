<script setup lang="ts">
import MarkdownIt from 'markdown-it'
const route = useRoute()

const { data: chatMessages } = useFetch(`/api/ai-chat/${route.params.roomId}/history`)

const handleSubmit = async (message: string) => {
    await $fetch(`/api/ai-chat/${route.params.roomId}/message`, {})
}

const md = new MarkdownIt()
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UContainer class="flex-1 flex flex-col justify-start">
            <div
                v-for="message in chatMessages?.data"
                :key="message.id"
                v-html="md.render(message.message)"
            />
        </UContainer>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="false"
            @message-submitted="handleSubmit($event)"
        />
    </UContainer>
</template>
