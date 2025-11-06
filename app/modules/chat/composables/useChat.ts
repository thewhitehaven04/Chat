import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import type {
    IChatMessageGroup,
    IIncomingMessagePayload,
    TOutgoingWebSocketMessagePayload,
    TSubscriptionPayload
} from '~~/server/modules/chat/models/types'

export type TChat = ReturnType<typeof useChat>

export function useChat(options: {
    chatRoomId: string | string[]
    onNewMessage?: () => void
    onPrepend?: () => void
}) {
    const { chatRoomId, onNewMessage, onPrepend } = options

    const messages = ref<IChatMessageGroup[]>([])
    const isDisconnected = ref(false)

    const editedMessage = ref<null | string>(null)
    const inputMessage = ref<string>('')

    let connection: WebSocket | null = null

    const sendWebSocketMessage = (payload: object) => {
        if (connection && connection.readyState === WebSocket.OPEN) {
            connection.send(JSON.stringify(payload))
        } else {
            console.error('WebSocket is not connected.')
            isDisconnected.value = true
        }
    }

    const skip = ref(0)
    const { data: chatHistory, pending: isChatHistoryPending } = useFetch(
        `/api/chat/${chatRoomId}/history`,
        {
            query: {
                limit: 30,
                skip: skip
            }
        }
    )

    watch(chatHistory, (response) => {
        if (response?.messageGroups) {
            prependMessages(response.messageGroups)
        }
    })

    const isChatHistoryLoading = computed(() => isChatHistoryPending.value && !chatHistory.value)

    const loadMoreHistory = () => {
        if (!isChatHistoryLoading.value) {
            skip.value += 30
        }
    }

    const sendMessage = () => {
        if (editedMessage.value) {
            sendWebSocketMessage({
                action: 'edit',
                messageId: editedMessage.value,
                chatRoom: Number(chatRoomId),
                text: inputMessage.value
            })
        } else {
            sendWebSocketMessage({
                action: 'submit',
                chatRoom: Number(chatRoomId),
                text: inputMessage.value
            })
        }
    }

    const deleteMessage = (messageId: string) => {
        sendWebSocketMessage({
            action: 'delete',
            messageId
        })
    }

    const prependMessages = (oldMessages: IChatMessageGroup[]) => {
        if (messages.value.length === 0) {
            messages.value = oldMessages
        } else {
            const lastGroup = oldMessages.at(-1)
            if (lastGroup && lastGroup?.submitted_by.id === messages.value[0]?.submitted_by.id) {
                messages.value[0]?.messages.unshift(...lastGroup.messages)
            }
            messages.value.unshift(...oldMessages.slice(0, -1))
        }
        onPrepend?.()
    }

    const onDelete = (messageId: string) => {
        const groups = messages.value.map((group) => {
            group.messages = group.messages.filter((message) => message.id !== messageId)
            return group
        })

        return groups.filter((group) => group.messages.length > 0)
    }

    const onUpdate = (message: IIncomingMessagePayload) => {
        for (const group of messages.value) {
            for (const msg of group.messages) {
                msg.text = message.text
            }
        }
    }

    const onInsert = (message: IIncomingMessagePayload) => {
        const currentSequence = messages.value.at(-1)
        if (message.id === currentSequence?.submitted_by.id) {
            currentSequence.messages.push({
                id: message.id,
                text: message.text,
                submitted_at: message.submitted_at
            })
        } else {
            messages.value.push({
                chat_room: message.chat_room,
                id: message.id,
                messages: [
                    {
                        id: message.id,
                        submitted_at: message.submitted_at,
                        text: message.text
                    }
                ],
                submitted_by: {
                    id: message.submitted_by.id,
                    name: message.submitted_by.name,
                    avatarUrl: message.submitted_by.avatarUrl
                }
            })
        }
    }

    onMounted(() => {
        connection = new WebSocket(`ws://${location.host}/api/chat`)

        connection.addEventListener('open', () => {
            isDisconnected.value = false
        })

        connection.addEventListener('message', (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data) as TOutgoingWebSocketMessagePayload

                if (message.action === 'delete') {
                    onDelete(message.messageId)
                }

                if (message.action === 'update') {
                    onUpdate(message.message)
                }

                if (message.action === 'insert') {
                    onInsert(message.message)
                }

                onNewMessage?.()
            } catch (error) {
                console.error('Failed to parse message:', error)
            }
        })

        connection.addEventListener('close', () => {
            isDisconnected.value = true
        })
    })

    onUnmounted(() => {
        if (connection) {
            connection.close()
        }
    })

    return {
        editedMessage,
        inputMessage,
        deleteMessage,
        messages,
        isDisconnected,
        sendMessage,
        chatHistory,
        isChatHistoryLoading,
        loadMoreHistory
    }
}
