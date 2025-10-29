import type { IChatCreateDto } from '~~/server/modules/chats/models/types'
import type { IChatRoomRepository } from '../chat-rooms/types'

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
            type: chatRoom.type,
            description: chatRoom.description ?? undefined
        })
    }
}

export { ChatRoomsService }
