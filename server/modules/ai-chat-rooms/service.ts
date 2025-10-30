import type { IAIChatRoomDto } from './modules/types'
import type { IAiChatRoomsRepository, IAiChatRoomsService } from './types'

export class AiChatRoomsService implements IAiChatRoomsService {
    #chatRoomRepository: IAiChatRoomsRepository

    constructor(repository: IAiChatRoomsRepository) {
        this.#chatRoomRepository = repository
    }

    getAIChatRooms(): Promise<IAIChatRoomDto[]> {
        return this.#chatRoomRepository.getAIChatRooms()
    }
}
