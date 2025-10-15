import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import type { AuthService } from '../auth/service'
import type { Database } from '~~/server/supabase'
import type {
    IChatHistoryResponse,
    IGetChatHistoryRequestDto,
    IMessageInputDto
} from '~~/server/modules/chat/models/types'

class ChatService {
    client: SupabaseClient<Database>
    authSerivce: AuthService
    subscriptionChannel: RealtimeChannel | null

    constructor(client: SupabaseClient<Database>, authService: AuthService) {
        this.client = client
        this.authSerivce = authService
        this.subscriptionChannel = null
    }

    subscribe(
        messageCallbackFn: (
            oldMessage: Record<string, unknown>,
            newMessage: Record<string, unknown>
        ) => void
    ) {
        this.subscriptionChannel = this.client
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    messageCallbackFn(payload.old, payload.new)
                }
            )
            .subscribe()
    }

    async sendMessage(message: IMessageInputDto) {
        const user = await this.authSerivce.getUser()

        if (user.id) {
            return await this.client
                .from('chat_messages')
                .insert({
                    text: message.text,
                    submitted_by: user.id,
                    chat_room: message.chatRoom
                })
                .throwOnError()
        } else {
            throw new Error('Sender is not logged in')
        }
    }

    unsubscribe() {
        if (this.subscriptionChannel) {
            this.subscriptionChannel.unsubscribe()
        }
    }

    async getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse> {
        const [response, count] = await Promise.all([
            this.client
                .from('chat_messages')
                .select('*', {
                    count: 'exact'
                })
                .order('submitted_at', {
                    ascending: false
                })
                .filter('chat_room', 'eq', params.chatRoom)
                .limit(params.limit)
                .throwOnError(),
            (
                await this.client
                    .from('chat_messages')
                    .select('COUNT(*)')
                    .filter('chat_room', 'eq', params.chatRoom)
                    .throwOnError()
            ).count
        ])
        let hasMore = false
        if (count && response.count) {
            hasMore = response.count < count
        }

        return {
            messages: response.data,
            hasMore
        }
    }
}

export { ChatService }
