import type {
    IChatHistoryResponse,
    IGetChatHistoryRequestDto,
    IMessageEditInputDto,
    IMessageInputDto,
    TWebSocketSubscriptionPayload
} from '~~/server/modules/chat/models/types'

export interface IRawProfileData {
    id: string
    name: string
    avatar_url: string | null
}

export interface IRawChatMessagePayload {
    chat_room: number
    id: string
    modified_at: string | null
    submitted_at: string
    submitted_by: string
    text: string
    profiles: IRawProfileData
}

export interface IChatMessageRepository {
    storeMessage(message: IMessageInputDto): Promise<unknown>
    getChatMessages(
        chatRoomId: string,
        skip: number,
        limit: number
    ): Promise<{ data: IRawChatMessagePayload[]; count: number | null }>
    deleteMessage(messageId: string): Promise<void>
    updateMessage(message: IMessageEditInputDto): Promise<IRawChatMessagePayload>
}

export interface IChatService {
    subscribe(messageCallbackFn: (action: TWebSocketSubscriptionPayload) => void): void
    unsubscribe(): void
    sendMessage(message: IMessageInputDto): Promise<unknown>
    editMessage(message: IMessageEditInputDto): Promise<IRawChatMessagePayload>
    deleteMessage(messageId: string): Promise<void>
    getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse>
}
