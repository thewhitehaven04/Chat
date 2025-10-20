import { ref, onMounted, onUnmounted } from 'vue'
import type { IMessageSequenceProps } from '~/modules/chat/models/types'
import type { IChatMessage } from '~~/server/modules/chat/models/types'

interface UseChatOptions {
    chatRoomId: string | string[]
    onNewMessage?: (message: IChatMessage) => void
}

export function useChat(options: UseChatOptions) {
    const { chatRoomId, onNewMessage } = options

    const messages = ref<IMessageSequenceProps[]>([])
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

    const _pushMessage = (newMessage: IChatMessage) => {
        const lastMessage = messages.value.at(-1)
        if (newMessage.submitted_by.id === lastMessage?.submittedBy.id) {
            lastMessage.messages.push({
                text: newMessage.text,
                submittedAt: newMessage.submitted_at
            })
        } else {
            messages.value.push({
                avatarUrl: newMessage.submitted_by.avatarUrl,
                id: newMessage.id,
                messages: [
                    {
                        submittedAt: newMessage.submitted_at,
                        text: newMessage.text
                    }
                ],
                submittedBy: {
                    id: newMessage.submitted_by.id,
                    name: newMessage.submitted_by.name
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
                const newMessage = JSON.parse(event.data) as IChatMessage
                _pushMessage(newMessage)

                if (onNewMessage) {
                    onNewMessage(newMessage)
                }
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
        messages,
        isDisconnected,
        sendMessage
    }
}
