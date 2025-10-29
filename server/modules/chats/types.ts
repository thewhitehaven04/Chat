import type { IChatCreateDto } from '~~/server/modules/chats/models/types'

export interface IChatRoomsService {
    getChatRooms(): Promise<unknown[] | null>
    createChatRoom(chatRoom: IChatCreateDto): Promise<unknown[] | null>
}
