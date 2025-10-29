import type { IAIChatRoomCreateDto, IAIChatRoomDto } from './models/types'

export interface IAIChatRoomsRepository {
    createChatRoom: (data: IAIChatRoomCreateDto) => Promise<unknown>
    getAIChatRooms: () => Promise<IAIChatRoomDto[]>
}

export interface IAIChatRoomsService {
    createChatRoom: (data: IAIChatRoomCreateDto) => Promise<IAIChatRoomDto>
    getChatRooms(): Promise<IAIChatRoomDto[]>
}
