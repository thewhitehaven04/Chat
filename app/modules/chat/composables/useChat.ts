import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import type {
    IChatMessageGroup,
    IIncomingMessagePayload,
    TWebSocketSubscriptionPayload
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

    const editedMessageId = ref<string | null>(null)
    const inputMessage = ref<string>('')

    const messageIdResponse = ref<string | null>(null)

    const setIsRespondingTo = (id: string) => {
        messageIdResponse.value = id
    }

    const clearRespondingTo = () => {
        messageIdResponse.value = null
    }

    const setEditingMessage = (messageId: string) => {
        const message = messages.value
            .find((group) => group.messages.find((message) => message.id === messageId))
            ?.messages.find((message) => message.id === messageId)

        editedMessageId.value = messageId
        inputMessage.value = message?.text || ''
    }

    const resetEditingMessage = () => {
        editedMessageId.value = null
    }

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

    const _transformMessageText = (message: string) => {
        return message.trim()
    }

    const sendMessage = () => {
        if (editedMessageId.value) {
            sendWebSocketMessage({
                action: 'edit',
                id: editedMessageId.value,
                chatRoom: Number(chatRoomId),
                text: _transformMessageText(inputMessage.value),
                respondingTo: messageIdResponse.value
            })
            editedMessageId.value = null
        } else {
            sendWebSocketMessage({
                action: 'submit',
                chatRoom: Number(chatRoomId),
                text: _transformMessageText(inputMessage.value),
                respondingTo: messageIdResponse.value
            })
        }
        clearRespondingTo()
        inputMessage.value = ''
    }

    const deleteMessage = (messageId: string) => {
        sendWebSocketMessage({
            action: 'delete',
            id: messageId
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
        messages.value.forEach((group) => {
            group.messages = group.messages.filter((message) => message.id !== messageId)
        })
    }

    const onUpdate = (message: IIncomingMessagePayload) => {
        for (const group of messages.value) {
            if (group.submitted_by.id !== message.submitted_by.id) {
                continue
            }
            for (const msg of group.messages) {
                if (msg.id === message.id) {
                    msg.text = message.text
                    break
                }
            }
        }
    }

    const onInsert = (message: IIncomingMessagePayload) => {
        const mostRecentMessageSequence = messages.value.at(-1)
        if (message.submitted_by.id === mostRecentMessageSequence?.submitted_by.id) {
            mostRecentMessageSequence.messages.push({
                id: message.id,
                text: message.text,
                submitted_at: message.submitted_at,
                respondsTo: message.responds_to
            })
        } else {
            messages.value.push({
                chat_room: message.chat_room,
                id: message.id,
                messages: [
                    {
                        id: message.id,
                        submitted_at: message.submitted_at,
                        text: message.text,
                        respondsTo: message.responds_to
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
                const { action, data } = JSON.parse(event.data) as TWebSocketSubscriptionPayload

                if (action === 'delete') {
                    onDelete(data)
                }

                if (action === 'update') {
                    onUpdate(data)
                }

                if (action === 'insert') {
                    onInsert(data)
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
        setEditingMessage,
        resetEditingMessage,
        editedMessageId,
        inputMessage,
        deleteMessage,
        messages,
        isDisconnected,
        sendMessage,
        chatHistory,
        isChatHistoryLoading,
        loadMoreHistory,
        isRespondingTo: messageIdResponse,
        setIsRespondingTo
    }
}
