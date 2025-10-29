import type { IChatCreateDto } from './models/types'
import type { IChatRoomRepository } from './types'

class ChatRoomsService {
    #repository: IChatRoomRepository

    constructor(chatRoomRepository: IChatRoomRepository) {
        this.#repository = chatRoomRepository
    }

    async getChatRooms() {
        return this.#repository.getChatRooms()
    }

    async createChatRoom(chatRoom: IChatCreateDto) {
        return this.#repository.createChatRoom({
            name: chatRoom.name,
            description: chatRoom.description ?? undefined
        })
    }
}

export { ChatRoomsService }
