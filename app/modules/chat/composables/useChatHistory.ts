import { ref, onMounted, onUnmounted } from 'vue'
import type {
    IChatMessageGroup,
    IIncomingMessagePayload
} from '~~/server/modules/chat/models/types'

interface UseChatOptions {
    chatRoomId: string | string[]
    onNewMessage?: () => void
    onPrepend?: () => void
}

export function useChatHistory(options: UseChatOptions) {
    const { chatRoomId, onNewMessage, onPrepend } = options

    const messages = ref<IChatMessageGroup[]>([])
    const isDisconnected = ref(false)
    let connection: WebSocket | null = null

    const sendMessage = (message: string) => {
        if (connection && connection.readyState === WebSocket.OPEN) {
            connection.send(
                JSON.stringify({
                    chatRoom: Number(chatRoomId),
                    text: message
                })
            )
        } else {
            console.error('WebSocket is not connected.')
            isDisconnected.value = true
        }
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

    onMounted(() => {
        connection = new WebSocket(`ws://${location.host}/api/chat`)

        connection.addEventListener('open', () => {
            isDisconnected.value = false
        })

        connection.addEventListener('message', (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data) as IIncomingMessagePayload
                const currentSequence = messages.value.at(-1)
                if (message.submitted_by.id === currentSequence?.submitted_by.id) {
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
        messages: messages,
        isDisconnected,
        sendMessage,
        prependMessages
    }
}
