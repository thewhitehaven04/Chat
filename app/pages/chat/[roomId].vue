<script setup lang="ts">
import { useChat } from '~/modules/chat/composables/useChat'

const params = useRoute().params

const { pending } = useFetch(`/api/chat/${params.roomId}/history`, {
    onResponse({ response }) {
        if (response._data) {
            messages.value = response._data?.messages
        }
    },
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
            <span ref="scrollTarget" />
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
