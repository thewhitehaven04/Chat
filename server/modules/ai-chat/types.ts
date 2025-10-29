import type { IAIChatMessageDto, IAIChatMessageInputDto } from './models/types'

export interface IAIChatMessageRepository {
    storeUserMessage(message: IAIChatMessageInputDto): Promise<unknown>
    storeModelMessage(message: IAIChatMessageInputDto): Promise<unknown>
    getChatHistory(
        chatRoomId: string,
        skip: number,
        limit: number
    ): Promise<{ data: IAIChatMessageDto[]; count: number | null }>
}

export interface IAiChatService {
    setRoomId(roomId: number): void
    createChat(): Promise<void>
    sendMessage(message: string): ReadableStream<string>
}
