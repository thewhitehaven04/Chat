import type { RealtimeChannel } from '@supabase/supabase-js'
import type {
    IChatHistoryResponse,
    IGetChatHistoryRequestDto,
    IIncomingMessagePayload,
    IMessageInputDto
} from '~~/server/modules/chat/models/types'

export interface IChatService<
    TClient = unknown,
    TAuthService = unknown,
    TProfileService = unknown
> {
    client: TClient
    authSerivce: TAuthService
    profileSerivce: TProfileService
    subscriptionChannel: RealtimeChannel | null

    subscribe(
        messageCallbackFn: (oldMessage: unknown, newMessage: IIncomingMessagePayload) => void
    ): void
    sendMessage(message: IMessageInputDto): Promise<unknown>
    unsubscribe(): void
    getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse>
}
