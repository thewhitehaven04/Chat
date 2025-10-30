import type { IAIChatAdapter } from '../chat-adapter/types'
import { format } from 'date-fns'
import type { IAIChatMessageRepository, IAIChatRoomsRepository, IAiChatService } from './types'
import type { IContentInstance } from '../chat-adapter/models/types'

export class AiChatService implements IAiChatService {
    #adapter: IAIChatAdapter
    #chatRoomRepository: IAIChatRoomsRepository
    #chatRepository: IAIChatMessageRepository
    #chatRoomId: number | null

    static CHAT_WINDOW = 1000

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

    async createChat() {
        const chatRoom = await this.#chatRoomRepository.createChatRoom({
            name: `test-${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`
        })

        if (chatRoom) {
            this.#chatRoomId = chatRoom.id
        }

        this.#adapter.createChatSession([])

        return { chatId: chatRoom.id, name: chatRoom.name, createdBy: chatRoom.createdBy }
    }

    async setExistingChat(chatId: number) {
        this.#chatRoomId = chatId
        const history = await this.#chatRepository.getChatHistory(
            chatId,
            0,
            AiChatService.CHAT_WINDOW
        )
        const contentInstances: IContentInstance[] = history.data.map((d) => ({
            role: d.submitter,
            parts: [
                {
                    text: d.message
                }
            ]
        }))

        this.#adapter.createChatSession(contentInstances)
    }

    async sendMessage(message: string) {
        const response = this.#adapter.sendMessage(message)
        const [messageStream, responseStream] = response.tee()

        if (this.#chatRoomId) {
            const reader = messageStream.getReader()
            let text = ''

            const processModelMessage = async (
                result: ReadableStreamReadResult<string>
            ): Promise<void> => {
                if (result.value) {
                    text += result.value
                }
                if (result.done && this.#chatRoomId) {
                    await this.#chatRepository.storeModelMessage({
                        chatRoomId: this.#chatRoomId,
                        message: text
                    })
                    return
                }

                return reader.read().then(processModelMessage)
            }

            reader.read().then(processModelMessage)

            await this.#chatRepository.storeUserMessage({
                message: message,
                chatRoomId: this.#chatRoomId
            })
        } else throw new Error('Chat room is not set')

        return responseStream
    }

    async getChatHistory(chatId: number) {
        return await this.#chatRepository.getChatHistory(chatId, 0, AiChatService.CHAT_WINDOW)
    }
}
