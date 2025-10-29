import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import type {
    IChatHistoryResponse,
    IGetChatHistoryRequestDto,
    IIncomingMessagePayload,
    IMessageInputDto
} from '~~/server/modules/chat/models/types'
import type { Database } from '~~/server/supabase'
import type { IChatRoomRepository } from '../chat-rooms/types'
import type { AuthService } from '../auth/service'
import type { ProfileService } from '../profile/service'

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
}

export interface IChatService<
    TClient extends SupabaseClient<Database>,
    AuthServiceType extends AuthService<TClient>,
    ProfileServiceType extends ProfileService<TClient, AuthServiceType>,
    ChatMessageRepositoryType extends IChatMessageRepository,
    ChatRoomRepositoryType extends IChatRoomRepository
> {
    client: TClient
    authSerivce: AuthServiceType
    profileSerivce: ProfileServiceType
    chatMessageRepository: ChatMessageRepositoryType
    chatRoomRepository: ChatRoomRepositoryType
    subscriptionChannel: RealtimeChannel | null

    subscribe(
        messageCallbackFn: (oldMessage: unknown, newMessage: IIncomingMessagePayload) => void
    ): void
    unsubscribe(): void
    getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse>
}
