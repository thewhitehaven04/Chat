import type { IChatMessageProps } from '~/modules/ai-chat/features/types'
import { v4 as uuidv4 } from 'uuid'
import { useThrottledFn } from '~/shared/core/composables/useThrottledFn'

export function useAiChatRoom(onRequest: () => void) {
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

    const inputMessage = ref<string>('')

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

    const handleLoadMore = useThrottledFn(() => {
        if (!isHistoryLoading.value && chatMessages.value?.hasMore) {
            skip.value += 30
        }
    }, 1000)
    

    const handleSubmit = async () => {
        const message = inputMessage.value
        const optimisticUserMessage = {
            id: uuidv4(),
            date: new Date(),
            message,
            type: 'user' as const
        }
        await $fetch<ReadableStream<Uint8Array>>(`/api/ai-chat/${route.params.roomId}/message`, {
            method: 'POST',
            responseType: 'stream',
            body: { message },
            onRequest: () => {
                messages.value.push(optimisticUserMessage)
                inputMessage.value = ''
                onRequest()
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

                    onRequest()

                    const incomingMessage = messages.value.at(-1)
                    const decoder = new TextDecoder('utf-8')
                    if (reader && incomingMessage) {
                        let nextChunk = await reader.read()
                        onRequest()
                        while (!nextChunk.done) {
                            incomingMessage.message += decoder.decode(nextChunk.value)
                            nextChunk = await reader.read()
                        }
                    }
                }
            }
        })
    }

    return {
        inputMessage,
        messages,
        isChatPending,
        handleSubmit,
        handleLoadMore,
        isHistoryLoading
    }
}
