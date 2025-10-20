import type {
    RealtimeChannel,
    RealtimePostgresInsertPayload,
    SupabaseClient
} from '@supabase/supabase-js'
import type { AuthService } from '../auth/service'
import type { Database } from '~~/server/supabase'
import type {
    IChatHistoryResponse,
    IGetChatHistoryRequestDto,
    IMessageInputDto
} from '~~/server/modules/chat/models/types'
import type { ProfileService } from '~~/server/modules/profile/service'

class ChatService {
    client: SupabaseClient<Database>
    authSerivce: AuthService
    profileSerivce: ProfileService
    subscriptionChannel: RealtimeChannel | null

    constructor(
        client: SupabaseClient<Database>,
        authService: AuthService,
        profileService: ProfileService
    ) {
        this.client = client
        this.authSerivce = authService
        this.profileSerivce = profileService
        this.subscriptionChannel = null
    }

    subscribe(
        messageCallbackFn: (
            oldMessage: Record<string, unknown>,
            newMessage: Record<string, unknown>
        ) => void
    ) {
        this.subscriptionChannel = this.client
            .channel('chat_messages_realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                async (
                    payload: RealtimePostgresInsertPayload<
                        Database['public']['Tables']['chat_messages']['Row']
                    >
                ) => {
                    const profile = await this.profileSerivce.getProfileData(
                        payload.new.submitted_by
                    )
                    messageCallbackFn(
                        { ...payload.old, submitted_by: profile },
                        { ...payload.new, submitted_by: profile }
                    )
                }
            )
            .subscribe()
    }

    async sendMessage(message: IMessageInputDto) {
        return await this.client
            .from('chat_messages')
            .insert({
                text: message.text,
                chat_room: message.chatRoom
            })
            .throwOnError()
    }

    unsubscribe() {
        if (this.subscriptionChannel) {
            this.subscriptionChannel.unsubscribe()
        }
    }

    async getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse> {
        const [messages, chatData] = await Promise.all([
            this.client
                .from('chat_messages')
                .select('*, profiles(*)', {
                    count: 'exact'
                })
                .order('submitted_at', {
                    ascending: false
                })
                .filter('chat_room', 'eq', params.chatRoom)
                .range(params.skip, params.skip + params.limit)
                .throwOnError(),
            this.client
                .from('chat_rooms')
                .select('*')
                .filter('id', 'eq', params.chatRoom)
                .single()
                .throwOnError()
        ])
        let hasMore = false
        if (messages.count) {
            hasMore = messages.count > messages.data.length
        }

        return {
            chat: {
                id: chatData.data.id,
                name: chatData.data.name,
                description: chatData.data.description
            },
            messages: messages.data
                .sort((a, b) => (new Date(a.submitted_at) > new Date(b.submitted_at) ? 1 : -1))
                .map((message) => ({
                    ...message,
                    submitted_by: {
                        id: message.profiles.id,
                        name: message.profiles.name,
                        avatarUrl: message.profiles.avatar_url
                    }
                })),
            hasMore
        }
    }
}

export { ChatService }
