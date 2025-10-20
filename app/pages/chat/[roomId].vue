<script setup lang="ts">
import { useChat } from '~/modules/chat/composables/useChat'
import type { IChatMessage } from '~~/server/modules/chat/models/types'

const params = useRoute().params

const skip = ref(0)

const { pending, data } = useFetch(`/api/chat/${params.roomId}/history`, {
    onResponse: ({ response }) => {
        prependMessages(response._data.messages as IChatMessage[])
    },
    query: {
        limit: 30,
        skip: skip
    }
})

const isTextareaDisabled = ref(true)

const { sendMessage, messages, isDisconnected, prependMessages } = useChat({
    onNewMessage: () => {
        scrollTargetRef.value?.scrollIntoView({
            block: 'end',
            behavior: 'smooth'
        })
    },
    chatRoomId: params.roomId as string
})

const handleLoadMore = () => {
    skip.value += 30
}

const showLoadingState = computed(() => pending.value)
const showNoMessages = computed(() => messages.value.length === 0 && !pending.value)

const scrollTargetRef = useTemplateRef('bottomScrollTarget')
const firstMessageRef = useTemplateRef('firstMessageThreshold')
const chatRef = useTemplateRef('chat')

const observer = new IntersectionObserver(
    (_entries, observer) => {
        if (data.value?.hasMore) {
            handleLoadMore()
        }
    },
    {
        root: chatRef.value,
        threshold: 0
    }
)

watch([showLoadingState, firstMessageRef], () => {
    if (!showLoadingState.value && firstMessageRef.value?.containerRef) {
        observer.observe(firstMessageRef.value.containerRef)
    }
})

onMounted(() => {
    scrollTargetRef.value?.scrollIntoView({
        block: 'end',
        behavior: 'smooth'
    })
})

onUnmounted(() => {
    observer.disconnect()
})

const router = useRouter()
const onClose = () => {
    router.push('/')
}

const first = computed(() => messages.value[0])
const chatMessages = computed(() => messages.value.slice(1))
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UHeader>
            <template #left>
                <div class="flex flex-col gap-2 mb-4">
                    <h1 v-if="!pending" class="text-xl font-bold">{{ data?.chat.name }}</h1>
                    <p class="text-neutral-700">{{ data?.chat.description }}</p>
                </div>
            </template>
            <template #right>
                <UButton variant="ghost" icon="i-lucide-x" @click="onClose()" />
            </template>
        </UHeader>
        <div ref="chat" class="flex-1 overflow-y-scroll">
            <USkeleton v-if="showLoadingState" class="h-12 w-12 rounded-full" />
            <ul v-else>
                <li class="flex flex-col items-start justify-center flex-1 gap-8 w-full">
                    <ChatFeaturesMessageSequence
                        v-if="first"
                        :id="first.id"
                        ref="firstMessageThreshold"
                        :avatar-url="first.avatarUrl"
                        :submitted-by="first?.submittedBy"
                        :messages="first?.messages"
                    />
                    <ChatFeaturesMessageSequence
                        v-for="m in chatMessages"
                        :id="m.id"
                        :key="m.id"
                        :avatar-url="m.avatarUrl"
                        :submitted-by="m.submittedBy"
                        :messages="m.messages"
                    />
                </li>
                <span ref="bottomScrollTarget" />
            </ul>
        </div>
        <div class="flex flex-col items-center justify-center">
            <div v-if="showNoMessages">It's too empty in here...</div>
        </div>
        <div v-if="isDisconnected" class="flex flex-col text-white bg-red-300 font-bold text-lg">
            You've been disconnected
        </div>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="isTextareaDisabled"
            @message-submitted="sendMessage($event)"
        />
    </UContainer>
</template>
