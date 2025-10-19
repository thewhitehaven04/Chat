<script setup lang="ts">
import { useChat } from '~/modules/chat/composables/useChat'

const params = useRoute().params

const { pending, data: chat } = useFetch(`/api/chat/${params.roomId}/history`, {
    onResponse({ response }) {
        if (response._data) {
            messages.value = response._data?.messages
        }
    }
})

const isTextareaDisabled = ref(false)

const { sendMessage, messages, isDisconnected } = useChat({
    onNewMessage: () => {
        scrollTargetRef.value?.scroll()
    },
    chatRoomId: params.chatId as string
})

const showLoadingState = computed(() => pending.value)
const showNoMessages = computed(() => messages.value.length === 0 && !pending.value)

const scrollTargetRef = useTemplateRef('scrollTarget')
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UHeader>
            <template #title>
                {{ chat?.chat.name }}
            </template>
        </UHeader>
        <div ref="chat" class="flex-1 overflow-y-scroll">
            <USkeleton v-if="showLoadingState" class="h-12 w-12 rounded-full" />
            <ul v-else>
                <li class="flex flex-col items-start justify-center flex-1 gap-8 w-full">
                    <ChatMessage
                        v-for="m in messages"
                        :key="m.id"
                        :text="m.text"
                        :submitted-at="m.submitted_at"
                        :submitted-by="m.submitted_by.name"
                        :avatar-url="m.submitted_by.avatarUrl"
                    />
                </li>
            </ul>
            <span ref="scrollTarget" />
        </div>
        <div class="flex flex-col items-center justify-center">
            <div v-if="showNoMessages">It's too empty in here...</div>
        </div>
        <div v-if="isDisconnected" class="flex flex-col text-white bg-red-300 font-bold text-lg">
            You've been disconnected
        </div>
        <ChatMessageSubmissionForm
            :is-disabled="isTextareaDisabled"
            @message-submitted="sendMessage($event)"
        />
    </UContainer>
</template>
