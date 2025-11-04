import type {
    IChatHistoryResponse,
    IGetChatHistoryRequestDto,
    IIncomingMessagePayload,
    IMessageInputDto,
    TSubscriptionPayload
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
}

export interface IChatService {
    subscribe(messageCallbackFn: (action: TSubscriptionPayload) => void): void
    unsubscribe(): void
    sendMessage(message: IMessageInputDto): Promise<unknown>
    getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse>
}
