<script setup lang="ts">
import type { IChatMessageProps } from '~/modules/ai-chat/features/types'
import { useThrottledFn } from '~/shared/core/composables/useThrottledFn'
import { v4 as uuidv4 } from 'uuid'

const route = useRoute()

const skip = ref(0)

const { data: chatMessages, pending: isHistoryLoading } = useFetch(
    `/api/ai-chat/${route.params.roomId}/history`,
    {
        query: {
            skip: skip,
            count: 30
        }
    }
)

const messages = ref<(IChatMessageProps & { id: string })[]>([])
const isChatPending = computed(() => isHistoryLoading.value && !chatMessages.value)

watch(chatMessages, (chatMessages) => {
    if (chatMessages) {
        messages.value.unshift(
            ...chatMessages.messages.map((message) => ({
                message: message.message,
                type: message.submitter,
                id: message.id,
                date: new Date(message.date)
            }))
        )
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
    const optimisticUserMessage = {
        id: uuidv4(),
        date: new Date(),
        message: message,
        type: 'user' as const
    }

    await $fetch<ReadableStream<Uint8Array>>(`/api/ai-chat/${route.params.roomId}/message`, {
        method: 'POST',
        responseType: 'stream',
        body: { message },
        onRequest: () => {
            messages.value.push(optimisticUserMessage)
            scrollToBottom()
        },
        onResponseError: () => {
            messages.value = messages.value.filter((m) => m.id !== optimisticUserMessage.id)
        },
        onResponse: async (response) => {
            if (!response.error) {
                const reader = response.response.body?.getReader()

                messages.value.push({
                    id: uuidv4(),
                    date: new Date(),
                    message: '',
                    type: 'model' as const
                })

                scrollToBottom()

                const incomingMessage = messages.value.at(-1)
                const decoder = new TextDecoder('utf-8')
                if (reader && incomingMessage) {
                    let nextChunk = await reader.read()
                    scrollToBottom()
                    while (!nextChunk.done) {
                        incomingMessage.message += decoder.decode(nextChunk.value)
                        nextChunk = await reader.read()
                    }
                }
            }
        }
    })
}
const scrollTarget = useTemplateRef('scrollingContainer')
const firstMessageRef = useTemplateRef('firstMessage')

const handleLoadMore = useThrottledFn(() => {
    if (!isHistoryLoading.value && chatMessages.value?.hasMore && !isChatPending.value) {
        skip.value += 30
    }
}, 1000)

let intersectionObserver: IntersectionObserver

onMounted(() => {
    intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    handleLoadMore()
                }
            })
        },
        {
            root: scrollTarget.value
        }
    )
})

onUnmounted(() => {
    intersectionObserver.disconnect()
})

const firstMessage = computed(() => messages.value[0])
const remainingMessages = computed(() => messages.value.slice(1) || [])

watch(
    firstMessageRef,
    (current, previous) => {
        if (current?.container) {
            intersectionObserver.observe(current.container)
        }
        if (previous?.container) {
            intersectionObserver.unobserve(previous.container)
        }
    },
    {
        flush: 'post'
    }
)
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <div
            ref="scrollingContainer"
            class="flex-1 flex flex-col items-stretch w-full gap-4 overflow-y-scroll"
        >
            <AiChatFeaturesChatMessage
                v-if="!!firstMessage"
                ref="firstMessage"
                :date="firstMessage.date"
                :type="firstMessage.type"
                :message="firstMessage.message"
            />
            <AiChatFeaturesChatMessage
                v-for="message in remainingMessages"
                :key="message.id"
                :date="message.date"
                :type="message.type"
                :message="message.message"
            />
        </div>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="false"
            @message-submitted="handleSubmit($event)"
        />
    </UContainer>
</template>
