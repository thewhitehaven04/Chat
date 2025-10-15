import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import type { AuthService } from '../auth/service'
import type { Database } from '~~/server/supabase'
import type {
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
                    chat_room: message.chat_room
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

    async getChatHistory(params: IGetChatHistoryRequestDto) {
        const response = await this.client
            .from('chat_messages')
            .select('*')
            .order('submitted_at', {
                ascending: false
            })
            .filter('chat_room', 'eq', params.chat_room)
            .limit(params.limit)
            .throwOnError()

        return {
            ...response
        }
    }
}

export { ChatService }
