import type {
    IChatHistoryResponse,
    IGetChatHistoryRequestDto,
    IMessageEditInputDto,
    IMessageInputDto, IRawChatMessagePayload, TWebSocketSubscriptionPayload
} from '~~/server/modules/chat/models/types'

export interface IChatMessageRepository {
    storeMessage(message: IMessageInputDto): Promise<unknown>
    getChatMessages(
        chatRoomId: string,
        skip: number,
        limit: number
    ): Promise<{ data: IRawChatMessagePayload[]; count: number | null }>
    deleteMessage(messageId: string): Promise<void>
    updateMessage(message: IMessageEditInputDto): Promise<IRawChatMessagePayload>
    getMessage(messageId: string): Promise<IRawChatMessagePayload>
}

export interface IChatService {
    subscribe(messageCallbackFn: (action: TWebSocketSubscriptionPayload) => void): void
    unsubscribe(): void
    sendMessage(message: IMessageInputDto): Promise<unknown>
    editMessage(message: IMessageEditInputDto): Promise<IRawChatMessagePayload>
    deleteMessage(messageId: string): Promise<void>
    getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse>
}
