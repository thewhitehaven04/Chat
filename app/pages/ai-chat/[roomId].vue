<script setup lang="ts">
import { useThrottledFn } from '~/shared/core/composables/useThrottledFn'
import { useAiChatRoom } from '~/modules/ai-chat/composables/useAiChatRoom'

const scrollTarget = useTemplateRef('scrollingContainer')
const firstMessageRef = useTemplateRef('firstMessage')

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

const handleLoadMoreThrottled = useThrottledFn(() => {
    handleLoadMore()
}, 1000)

const { messages, handleSubmit, handleLoadMore } = useAiChatRoom(
    scrollToBottom,
    handleLoadMoreThrottled
)

let intersectionObserver: IntersectionObserver

onMounted(() => {
    intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    handleLoadMoreThrottled()
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
