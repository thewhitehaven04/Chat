import type {
    IAIChatMessageDto,
    IAIChatMessageHistoryDto,
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
    getChatMessage(chatRoomId: number, messageId: string): Promise<IAIChatMessageDto>
}

export interface IAiChatService {
    createChat(): Promise<{ chatId: number }>
    sendMessage(message: string): Promise<ReadableStream<string>>
    getMessage(messageId: string): Promise<IAIChatMessageDto>
    setExistingChat(chatId: number): Promise<void>
    getChatHistory(
        chatId: number,
        skip: number,
        limit: number
    ): Promise<IAIChatMessageHistoryDto>
}

export interface IAIChatRoomsRepository {
    createChatRoom: (data: IAIChatRoomCreateDto) => Promise<IAIChatRoomDto>
    getAIChatRooms: () => Promise<IAIChatRoomDto[]>
}

export interface IAIChatRoomsService {
    createChatRoom: (data: IAIChatRoomCreateDto) => Promise<IAIChatRoomDto>
    getChatRooms(): Promise<IAIChatRoomDto[]>
}
