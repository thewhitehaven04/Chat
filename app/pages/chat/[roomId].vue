<script setup lang="ts">
import { useChatHistory } from '~/modules/chat/composables/useChatHistory'
import { useThrottledFn } from '~/shared/core/composables/useThrottledFn'

const params = useRoute().params

const skip = ref(0)

let observer: IntersectionObserver | null

const { data, pending } = useFetch(`/api/chat/${params.roomId}/history`, {
    query: {
        limit: 30,
        skip: skip
    },
})

watch(data, (response) => {
    prependMessages(response?.messageGroups || [])
})

const isChatHistoryLoading = computed(() => pending.value && !data.value)
const showNoMessages = computed(() => messages.value.length === 0 && !isChatHistoryLoading.value)

const { sendMessage, messages, isDisconnected, prependMessages } = useChatHistory({
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
    chatRoomId: params.roomId as string
})

const firstMessage = computed(() => messages.value[0])
const remainingMessages = computed(() => messages.value.slice(1))

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
    if (!isChatHistoryLoading.value) {
        skip.value += 30
    }

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
            if (data.value?.hasMore && entries[0] && entries[0].isIntersecting) {
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
                        {{ data?.chat.name }}
                    </h1>
                    <p class="text-neutral-700">{{ data?.chat.description }}</p>
                </div>
            </template>
            <template #right>
                <ULink as="button" href="/" icon="i-lucide-x" />
            </template>
        </UHeader>
        <div ref="chat" class="flex-1 overflow-y-scroll">
            <USkeleton v-if="isChatHistoryLoading" class="h-12 w-12 rounded-full" />
            <ul v-else>
                <li class="flex flex-col items-start justify-center flex-1 gap-8 w-full">
                    <ChatFeaturesMessageSequence
                        v-if="firstMessage"
                        :id="firstMessage?.id"
                        ref="firstMessageThreshold"
                        :chat_room="firstMessage?.chat_room"
                        :submitted_by="firstMessage?.submitted_by"
                        :messages="firstMessage?.messages"
                    />
                    <ChatFeaturesMessageSequence
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
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="isChatHistoryLoading"
            @message-submitted="sendMessage($event)"
        />
    </UContainer>
</template>
