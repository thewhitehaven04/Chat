import type { IAIChatRoomDto } from './modules/types'

export interface IAiChatRoomsService {
    getAIChatRooms(): Promise<IAIChatRoomDto[]>
}

export interface IAiChatRoomsRepository {
    getAIChatRooms: () => Promise<IAIChatRoomDto[]>
}