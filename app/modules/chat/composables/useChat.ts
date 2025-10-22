import { ref, onMounted, onUnmounted } from 'vue'
import type { IMessageSequenceProps } from '~/modules/chat/models/types'
import type { IChatMessage } from '~~/server/modules/chat/models/types'

interface UseChatOptions {
    chatRoomId: string | string[]
    onNewMessage?: () => void
    onPrepend?: () => void
}

export function useChat(options: UseChatOptions) {
    const { chatRoomId, onNewMessage, onPrepend } = options

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

    const _pushMessage = (sequence: IMessageSequenceProps[], newMessage: IChatMessage) => {
        const currentSequence = sequence.at(-1)
        if (newMessage.submitted_by.id === currentSequence?.submittedBy.id) {
            currentSequence.messages.push({
                text: newMessage.text,
                submittedAt: newMessage.submitted_at
            })
        } else {
            sequence.push({
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

    const prependMessages = (oldMessages: IChatMessage[]) => {
        const messageSequence: IMessageSequenceProps[] = []
        for (let i = 0; i < oldMessages.length; i++) {
            const message = oldMessages[i]
            if (message) {
                _pushMessage(messageSequence, message)
            }
        }

        const lastSequence = messageSequence.at(-1)

        if (lastSequence && lastSequence?.submittedBy.id === messages.value.at(0)?.submittedBy.id) {
            messages.value[0]?.messages.unshift(...lastSequence.messages)
            messageSequence.pop()
        }

        messages.value.unshift(...messageSequence)
        onPrepend?.()
    }

    onMounted(() => {
        connection = new WebSocket(`ws://${location.host}/api/chat`)

        connection.addEventListener('open', () => {
            isDisconnected.value = false
        })

        connection.addEventListener('message', (event: MessageEvent) => {
            try {
                const newMessage = JSON.parse(event.data) as IChatMessage
                _pushMessage(messages.value, newMessage)
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
