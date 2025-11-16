<script setup lang="ts">
import ChatInput from '~/shared/components/ChatInput.vue'
import { useProfile } from '~/shared/composables/queries/useProfile'

const { data: aiChatRooms = [], refresh } = useFetch('/api/ai-chat/rooms', {
    key: 'aiChatRooms'
})

const { data: profile } = useProfile()

const initialMessage = ref<string>('')
const sentMessage = ref<string | null>(null)

const resetInput = () => {
    initialMessage.value = ''
}

const handleSubmit = async () => {
    const message = initialMessage.value
    resetInput()
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
        body: { message },
        onResponse: async ({ error }) => {
            if (!error) {
                await navigateTo(`/ai-chat/${chatCreationResponse.chatId}`, {
                    replace: true
                })
            }
        }
    })
}
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UContainer class="flex-1">
            <LazyAiChatFeaturesChatMessage
                v-if="!!sentMessage"
                :date="new Date()"
                :type="'user'"
                :message="sentMessage"
            />
            <UContainer
                v-else-if="!!aiChatRooms?.length"
                class="flex flex-col justify-center w-min h-full gap-2"
            >
                <div v-if="profile" class="title-appear-animation w-full">
                    <h1 class="font-bold text-2xl mb-4">Hello, {{ profile.name }}</h1>
                    <p class="font-medium text-neutral-500 text-sm self-start">Recent</p>
                </div>
                <div class="flex flex-col gap-3 entries-appear-animation">
                    <ULink
                        v-for="aiChatRoom in aiChatRooms"
                        :key="aiChatRoom.id"
                        class="w-max font-medium bg-inherit text-inherit"
                        :href="`/ai-chat/${aiChatRoom.id}`"
                        >{{ aiChatRoom.name }}</ULink
                    >
                </div>
            </UContainer>
            <UContainer v-else class="flex flex-col items-center justify-center h-full">
                <p class="text-xl font-xl">Let's start chatting!</p>
            </UContainer>
        </UContainer>
        <ChatInput v-model:model-value="initialMessage" @key-enter-pressed="handleSubmit()" />
    </UContainer>
</template>

<style lang="css">
.title-appear-animation {
    animation: title-appear 0.2s ease-in-out 0s normal forwards;
    transform-origin: top center;
}

.entries-appear-animation {
    animation: entries-appear 0.8s ease-in-out 0s normal forwards;
    background: linear-gradient(
        180deg,
        var(--text-color-muted),
        var(--text-color-muted) 33.33%,
        white 66.66%
    );
    color: transparent;
    background-clip: text;
    background-size: auto 300%;
}

@keyframes entries-appear {
    from {
        background-position: bottom;
    }
    to {
        background-position: top;
    }
}

@keyframes title-appear {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0px);
    }
}
</style>
