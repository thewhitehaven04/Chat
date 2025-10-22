<script setup lang="ts">
import { useChat } from '~/modules/chat/composables/useChat'
import type { IChatMessageGroup } from '~~/server/modules/chat/models/types'

const params = useRoute().params

const skip = ref(0)

let observer: IntersectionObserver | null

const { data, pending } = useFetch(`/api/chat/${params.roomId}/history`, {
    onResponse: ({ response, error }) => {
        if (!error) {
            prependMessages(response._data.messageGroups as IChatMessageGroup[])
        }
    },
    query: {
        limit: 30,
        skip: skip
    }
})

const isChatHistoryLoading = computed(() => pending.value && !data.value)
const showNoMessages = computed(() => messages.value.length === 0 && !isChatHistoryLoading.value)

const { sendMessage, messages, isDisconnected, prependMessages } = useChat({
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

const scrollToBottom = () => {
    requestAnimationFrame(() => {
        if (chatRef.value) {
            chatRef.value.scrollTop = chatRef.value.scrollHeight
        }
    })
}

const handleLoadMore = () => {
    if (!isChatHistoryLoading.value) {
        setTimeout(() => {
            skip.value += 30
        }, 1000)
    }

    if (observer && firstMessageRef.value) {
        observer.unobserve(firstMessageRef.value)
    }
}

const firstMessageRef = useTemplateRef('firstMessageThreshold')
const chatRef = useTemplateRef('chat')

watch(
    [isChatHistoryLoading, firstMessageRef],
    () => {
        if (firstMessageRef.value && observer) {
            observer.observe(firstMessageRef.value)
        }
    },
    {
        flush: 'post'
    }
)

onMounted(() => {
    observer = new IntersectionObserver(
        (entries, observer) => {
            if (data.value?.hasMore && entries[0] && entries[0].intersectionRatio > 0.3) {
                handleLoadMore()
            }
        },
        {
            root: chatRef.value,
            threshold: 0.3
        }
    )
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})

const router = useRouter()
const onClose = () => {
    router.push('/')
}
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
                <UButton variant="ghost" icon="i-lucide-x" @click="onClose()" />
            </template>
        </UHeader>
        <div ref="chat" class="flex-1 overflow-y-scroll">
            <USkeleton v-if="isChatHistoryLoading" class="h-12 w-12 rounded-full" />
            <ul v-else>
                <span ref="firstMessageThreshold" />
                <li class="flex flex-col items-start justify-center flex-1 gap-8 w-full">
                    <ChatFeaturesMessageSequence
                        v-for="m in messages"
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
