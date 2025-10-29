import type { IAIChatAdapter } from '../chat-adapter/types'
import { format } from 'date-fns'
import type { IAIChatMessageRepository, IAiChatService } from './types'
import type { IAIChatRoomsRepository } from '../ai-chat-rooms/types'

export class AiChatService implements IAiChatService {
    #adapter: IAIChatAdapter
    #chatRoomRepository: IAIChatRoomsRepository 
    #chatRepository: IAIChatMessageRepository
    #chatRoomId: number | null

    constructor(
        adapter: IAIChatAdapter,
        chatRoomRepository: IAIChatRoomsRepository,
        chatRepository: IAIChatMessageRepository
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
                    this.#chatRepository.storeModelMessage({
                        chatRoomId: this.#chatRoomId,
                        message: text
                    })
                }
            })

            this.#chatRepository.storeUserMessage({
                message: message,
                chatRoomId: this.#chatRoomId
            })
        } else throw new Error('Chat room is not set')

        return responseStream
    }
}
