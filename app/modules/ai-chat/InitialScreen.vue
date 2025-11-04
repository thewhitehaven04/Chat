<script setup lang="ts">
const { data: aiChatRooms = [], refresh } = useFetch('/api/ai-chat/rooms', {
    key: 'aiChatRooms'
})

const isAnswerPending = ref(false)
const sentMessage = ref<string | null>(null)

const handleSubmit = async (message: string) => {
    isAnswerPending.value = true
    sentMessage.value = message
    const chatCreationResponse = await $fetch('/api/ai-chat', {
        method: 'POST',
        body: { message },
        onResponse: ({ error }) => {
            if (!error) {
                refresh()
            }
        }
    })

    await $fetch(`/api/ai-chat/${chatCreationResponse.chatId}/message`, {
        method: 'POST',
        body: { message }
    })

    await navigateTo(`/ai-chat/${chatCreationResponse.chatId}`, {
        replace: true
    })
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UContainer class="flex-1">
            <AiChatFeaturesChatMessage
                v-if="!!sentMessage"
                :date="new Date()"
                :type="'user'"
                :message="sentMessage"
            />
            <UContainer
                v-else-if="!!aiChatRooms?.length"
                class="flex flex-col items-center justify-center w-min h-full gap-2"
            >
            <h1 class="font-bold text-2xl mb-4">Hello, user.</h1>
            <p class="font-medium text-neutral-500 text-sm self-start">Recent</p>
                <UButton
                    v-for="aiChatRoom in aiChatRooms"
                    :key="aiChatRoom.id"
                    variant="soft"
                    color="neutral"
                    size="lg"
                    class="w-full"
                    :label="aiChatRoom.name"
                    :href="`/ai-chat/${aiChatRoom.id}`"
                />
            </UContainer>
            <p v-else class="text-lg font-md">You haven't started chatting yet</p>
        </UContainer>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="false"
            @message-submitted="handleSubmit($event)"
        />
    </UContainer>
</template>