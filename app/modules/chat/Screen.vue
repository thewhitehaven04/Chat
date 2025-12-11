<script setup lang="ts">
import { useChat } from '~/modules/chat/composables/useChat'
import ChatInput from '~/shared/components/ChatInput.vue'
import { useThrottledFn } from '~/shared/core/composables/useThrottledFn'

const props = defineProps<{ roomId: string }>()

let observer: IntersectionObserver | null

const chat = useChat({
    onNewMessage: () => scrollToBottom(),
    onPrepend: () => {
        const scrollHeight = chatRef.value?.scrollHeight || 0

        requestAnimationFrame(() => {
            if (chatRef.value) {
                chatRef.value.scrollTop =
                    chatRef.value.scrollHeight - scrollHeight + chatRef.value.scrollTop
            }
        })
    },
    chatRoomId: props.roomId
})
const {
    messages,
    isDisconnected,
    chatHistory,
    isChatHistoryLoading,
    loadMoreHistory,
    inputMessage,
    sendMessage,
    setIsRespondingTo,
    isRespondingTo,
    clearRespondingTo
} = chat

const respondingToMessageText = computed(() => {
    for (const sequence of messages.value) {
        for (const message of sequence.messages) {
            if (message.id === isRespondingTo.value) {
                return message.text
            }
        }
    }
    return null
})

provide('chat', chat)

const showNoMessages = computed(() => messages.value.length === 0 && !isChatHistoryLoading.value)
const firstMessage = computed(() => messages.value[0])
const remainingMessages = computed(() => messages.value.slice(1))

// initial scroll
watch(
    messages,
    () => {
        scrollToBottom()
    },
    {
        once: true
    }
)

const scrollToBottom = () => {
    requestAnimationFrame(() => {
        if (chatRef.value) {
            chatRef.value.scroll({
                behavior: 'instant',
                top: chatRef.value.scrollHeight
            })
        }
    })
}

const handleLoadMore = useThrottledFn(() => {
    loadMoreHistory()

    if (observer && firstMessageRef.value?.containerRef) {
        observer.unobserve(firstMessageRef.value.containerRef)
    }
}, 1000)

const firstMessageRef = useTemplateRef('firstMessageThreshold')
const chatRef = useTemplateRef('chat')

watch(
    [isChatHistoryLoading, firstMessageRef],
    () => {
        if (firstMessageRef.value?.containerRef && observer) {
            observer.observe(firstMessageRef.value.containerRef)
        }
    },
    {
        flush: 'post'
    }
)

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            if (chatHistory.value?.hasMore && entries[0] && entries[0].isIntersecting) {
                handleLoadMore()
            }
        },
        {
            root: chatRef.value
        }
    )
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UHeader>
            <template #left>
                <div class="flex flex-col gap-2 mb-4">
                    <h1 v-if="!isChatHistoryLoading" class="text-xl font-bold">
                        {{ chatHistory?.chat.name }}
                    </h1>
                    <p class="text-neutral-700">{{ chatHistory?.chat.description }}</p>
                </div>
            </template>
            <template #right>
                <ULink as="button" href="/" icon="i-lucide-x" />
            </template>
        </UHeader>
        <div ref="chat" class="flex-1 overflow-y-auto">
            <USkeleton v-if="isChatHistoryLoading" class="h-12 w-12 rounded-full" />
            <ul v-else>
                <li class="flex flex-col items-start justify-center flex-1 gap-8 w-full">
                    <ChatFeaturesBodyComponentsMessageSequence
                        v-if="firstMessage"
                        :id="firstMessage?.id"
                        ref="firstMessageThreshold"
                        :chat_room="firstMessage?.chat_room"
                        :submitted_by="firstMessage?.submitted_by"
                        :messages="firstMessage?.messages"
                    />
                    <ChatFeaturesBodyComponentsMessageSequence
                        v-for="m in remainingMessages"
                        :id="m.id"
                        :key="m.id"
                        :chat_room="m.chat_room"
                        :submitted_by="m.submitted_by"
                        :messages="m.messages"
                    />
                </li>
            </ul>
        </div>
        <div class="flex flex-col items-center justify-center">
            <div v-if="showNoMessages">It's too empty in here...</div>
        </div>
        <div v-if="isDisconnected" class="flex flex-col text-white bg-red-300 font-bold text-lg">
            You've been disconnected
        </div>
        <div class="flex flex-col gap-1">
            <ChatFeaturesRespondingTo :text="respondingToMessageText" />
            <ChatInput v-model:model-value="inputMessage" @key-enter-pressed="sendMessage()" />
        </div>
    </UContainer>
</template>
