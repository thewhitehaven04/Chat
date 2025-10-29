import type { IAIChatAdapter } from '../chat-adapter/types'
import { format } from 'date-fns'
import type { IChatRoomRepository } from '../chat-rooms/types'
import type { IChatMessageRepository } from '../chat/types'

export class AiChatService {
    #adapter: IAIChatAdapter
    #chatRoomRepository: IChatRoomRepository
    #chatRepository: IChatMessageRepository
    #chatRoomId: number | null

    constructor(
        adapter: IAIChatAdapter,
        chatRoomRepository: IChatRoomRepository,
        chatRepository: IChatMessageRepository
    ) {
        this.#adapter = adapter
        this.#chatRoomRepository = chatRoomRepository
        this.#chatRepository = chatRepository
        this.#chatRoomId = null
    }

    setRoomId(roomId: number) {
        this.#chatRoomId = roomId
    }

    async createChat() {
        const chatRoom = await this.#chatRoomRepository.createChatRoom({
            name: `test-${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
            type: 'AI',
            description: 'Test chat'
        })

        if (chatRoom) {
            this.setRoomId(chatRoom.id)
        }
    }

    async sendMessage(message: string) {
        const response = this.#adapter.sendMessage(message)
        const [messageStream, responseStream] = response.tee()

        if (this.#chatRoomId) {
            const reader = messageStream.getReader()
            let text = ''
            reader.read().then((result) => {
                if (result.value) {
                    text += result.value
                }
                if (result.done && this.#chatRoomId) {
                    this.#chatRepository.storeMessage({
                        text: text,
                        chatRoom: this.#chatRoomId
                    })
                }
            })

            this.#chatRepository.storeMessage({
                text: message,
                chatRoom: this.#chatRoomId
            })
        } else throw new Error('Chat room is not set')

        return responseStream
    }
}
