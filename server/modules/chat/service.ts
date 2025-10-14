import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/server/supabase'
import type { AuthService } from '../auth/service'

class ChatService {
    client: SupabaseClient<Database>
    authSerivce: AuthService

    constructor(client: SupabaseClient<Database>, authService: AuthService) {
        this.client = client
        this.authSerivce = authService
    }

    subscribe(
        messageCallbackFn: (
            oldMessage: Record<string, unknown>,
            newMessage: Record<string, unknown>
        ) => void
    ) {
        this.client
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    messageCallbackFn(payload.old, payload.new)
                }
            )
    }

    async sendMessage(message: string) {
        await this.client
            .from('chat_messages')
            .insert({
                text: message,
                submitted_by: (await this.authSerivce.getUser()).id
            })
            .throwOnError()
    }

    async unsubscribe() {
        await this.client.channel('table-db-changes').unsubscribe()
    }
}

export { ChatService }
