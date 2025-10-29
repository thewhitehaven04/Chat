import type { IChatCreateDto, IChatRoomCreateDto, IChatRoomReadDto } from './models/types'

export interface IChatRoomRepository {
    createChatRoom: (data: IChatRoomCreateDto) => Promise<IChatRoomReadDto>
    getChatRooms: () => Promise<IChatRoomReadDto[]>
    getChatRoom: (chatRoomId: string) => Promise<IChatRoomReadDto>
}

export interface IChatRoomsService {
    getChatRooms(): Promise<IChatRoomReadDto[]>
    createChatRoom(chatRoom: IChatCreateDto): Promise<unknown>
}