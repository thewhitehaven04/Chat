import type { IChatCreateDto } from '~~/server/modules/chats/models/types'

export interface IChatRoomsService<TClient> {
    client: TClient

    getChatRooms(): Promise<unknown[] | null>
    createChatRoom(chatRoom: IChatCreateDto): Promise<unknown[] | null>
}
