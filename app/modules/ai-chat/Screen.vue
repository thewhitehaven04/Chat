<script setup lang="ts">
import { useAiChatRoom } from '~/modules/ai-chat/composables/useAiChatRoom'
import ChatInput from '~/shared/components/ChatInput.vue'

defineProps<{
    roomId: string
}>()

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

const { messages, handleSubmit, handleLoadMore, inputMessage, isResponsePending } =
    useAiChatRoom(scrollToBottom)

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

watch(
    messages.value,
    () => {
        scrollToBottom()
    },
    {
        once: true
    }
)

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
        <ul
            ref="scrollingContainer"
            class="flex-1 flex flex-col items-stretch w-full gap-4 overflow-y-auto"
        >
            <li>
                <AiChatFeaturesChatMessage
                    v-if="!!firstMessage"
                    :id="firstMessage.id"
                    ref="firstMessage"
                    :date="firstMessage.date"
                    :type="firstMessage.type"
                    :message="firstMessage.message"
                />
            </li>
            <li>
                <AiChatFeaturesChatMessage
                    v-for="message in remainingMessages"
                    :id="message.id"
                    :key="message.id"
                    :date="message.date"
                    :type="message.type"
                    :message="message.message"
                />
            </li>
            <li>
                <div v-if="isResponsePending" class="flex flex-row justify-start">
                    <div class="h-[3rem] p-4 animate-pulse bg-accented rounded-lg w-xl" />
                </div>
            </li>
        </ul>

        <ChatInput
            v-model:model-value="inputMessage"
            :disabled="messages.length === 0"
            @key-enter-pressed="handleSubmit()"
        />
    </UContainer>
</template>
