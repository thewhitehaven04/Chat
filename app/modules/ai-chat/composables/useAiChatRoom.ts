import type { IChatMessageProps } from '~/modules/ai-chat/features/types'
import { v4 as uuidv4 } from 'uuid'

export function useAiChatRoom(scrollToBottom: () => void, onInfiniteScroll: () => void) {
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

    const handleLoadMore = () => {
        if (!isHistoryLoading.value && chatMessages.value?.hasMore && !isChatPending.value) {
            skip.value += 30
            onInfiniteScroll()
        }
    }

    return {
        messages,
        isChatPending,
        handleSubmit,
        handleLoadMore,
        isHistoryLoading
    }
}
