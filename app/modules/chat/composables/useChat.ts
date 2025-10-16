import { ref, onMounted, onUnmounted } from 'vue'
import type { IChatMessage } from '~~/server/modules/chat/models/types'

interface UseChatOptions {
    chatRoomId: string | string[]
    onNewMessage?: (message: IChatMessage) => void
}

export function useChat(options: UseChatOptions) {
    const { chatRoomId, onNewMessage } = options

    const messages = ref<IChatMessage[]>([])
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

    onMounted(() => {
        connection = new WebSocket(`ws://${location.host}/api/chat`)

        connection.addEventListener('open', () => {
            isDisconnected.value = false
        })

        connection.addEventListener('message', (event: MessageEvent) => {
            try {
                const newMessage = JSON.parse(event.data) as IChatMessage
                messages.value.push(newMessage)
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
