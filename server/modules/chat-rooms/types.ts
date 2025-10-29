import type { IChatRoomCreateDto, IChatRoomReadDto } from './models/types'

export interface IChatRoomRepository {
    createChatRoom: (data: IChatRoomCreateDto) => Promise<IChatRoomReadDto>
    getChatRooms: () => Promise<IChatRoomReadDto[]>
    getChatRoom: (chatRoomId: string) => Promise<IChatRoomReadDto>
}
