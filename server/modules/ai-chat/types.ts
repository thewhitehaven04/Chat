import type {
    IAIChatMessageDto,
    IAIChatMessageInputDto,
    IAIChatRoomCreateDto,
    IAIChatRoomDto
} from './models/types'

export interface IAIChatMessageRepository {
    storeUserMessage(message: IAIChatMessageInputDto): Promise<unknown>
    storeModelMessage(message: IAIChatMessageInputDto): Promise<unknown>
    getChatHistory(
        chatRoomId: number,
        skip: number,
        limit: number
    ): Promise<{ data: IAIChatMessageDto[]; count: number | null }>
}

export interface IAiChatService {
    createChat(): Promise<{ chatId: number }>
    sendMessage(message: string): ReadableStream<string>
    setExistingChat(chatId: number): Promise<void>
    getChatHistory(chatId: number): Promise<{ data: IAIChatMessageDto[]; count: number | null }>
}

export interface IAIChatRoomsRepository {
    createChatRoom: (data: IAIChatRoomCreateDto) => Promise<IAIChatRoomDto>
    getAIChatRooms: () => Promise<IAIChatRoomDto[]>
}

export interface IAIChatRoomsService {
    createChatRoom: (data: IAIChatRoomCreateDto) => Promise<IAIChatRoomDto>
    getChatRooms(): Promise<IAIChatRoomDto[]>
}
